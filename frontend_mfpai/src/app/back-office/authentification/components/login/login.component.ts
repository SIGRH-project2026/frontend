import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {AuthService} from "../../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Credentials} from "../../../../models/auth-response";
import {AuthResponseApi} from "../../../../models/response-api.model";
import {CredentialsService} from "../../../../services/credentials.service";
import {AlertService} from "../../../../shared/commons/alert.service";
import {ReferencesService} from "../../../../services/references.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm!: FormGroup;
  token: any = '';
  isLoading = false;
   userProfile!: string;
     userInfos: any;


    profilConnecte : any
    profile : any
    profileId : any
     menuItems: any;

  constructor(
     private router:Router,
    private spinner: NgxSpinnerService,
       private formBuilder: FormBuilder,  private authService: AuthService,
     private _credentialsService: CredentialsService,
     private alert: AlertService,
     private credentialsService: CredentialsService,
     private readonly referenceService : ReferencesService
  ) {

  }

  ngOnInit(): void {



    this.loginForm = this.formBuilder.group({
        login: ['', Validators.required], // Assurez-vous que 'login' est correct
      password: ['', Validators.required] // Assurez-vous que 'password' est correct
    });
  }

  onLogin(): void {
    if (this.isLoading || this.loginForm.invalid) {
      return;
    }
    this.menuItems = undefined;
    const credentials: Credentials = {
        token: "",
        login: this.loginForm.value.login.trim(),
      password: this.loginForm.value.password
    };

   this.isLoading = true;


    this.authService.loginUser(credentials).subscribe({
      next: (response: AuthResponseApi) => {
        const resp : any =   response.payload
   
        if (response.status === "WRONG_CREDENTIALS"){
          this.isLoading = false;
          this.authService.showSwal('error', response.message);
        }
        else if (resp?.token !== undefined){
        //  console.log(resp["token"]);
          this._credentialsService.setCredentials(resp["token"])
          this._credentialsService.setRefreshToken(resp["refreshToken"])

            this.userInfos = this._credentialsService.getUserInfos();

            this.userProfile = this._credentialsService.userProfils[0];

            //this.userInfos = this.credentialsService.getUserInfos();
            this.profilConnecte = this.userInfos?.profil
            this.profileId = this.profilConnecte[0].id

            this.spinner.show();
            this.getMenus();
        } else {
          this.isLoading = false;
          this.authService.showSwal('error', response.message || 'La connexion a échoué.');
        }


      },
      complete: () => {
        // Called when the request is completed (optional)
      },
      error: (error) => {
          this.isLoading = false;
        // Error occurred, handle the error here
          if (typeof error === 'undefined' || error == null) {
              this.authService.showSwal('error', "Serveur indisponible.");
          } else {

              const message = typeof error === 'string' ? error : error?.error?.message || 'Une erreur est survenue.';
              this.authService.showSwal('error', message);
          }
      }
    });



  }

    getMenus(): void {
        this.referenceService.getMenus(this.profileId, true)
            .subscribe({
              next: (data : any) => {
                this.menuItems = this.sortMenus(data);
                this.finishLoginNavigation();
              },
              error: () => this.finishLoginNavigation()
            });
    }

    private async finishLoginNavigation(): Promise<void> {
        const targetPath = this.findMenuPath(this.menuItems) || '/dashboard';
        try {
            let navigated = await this.router.navigateByUrl(targetPath).catch(() => false);
            if (!navigated && targetPath !== '/dashboard') {
                navigated = await this.router.navigateByUrl('/dashboard');
            }
            navigated = navigated && !!this._credentialsService.getCredentials()
                && !this.router.url.startsWith('/auth/');
            this.alert.showAlert({
                message: navigated
                    ? `Bienvenue ${this.userInfos?.prenom} ${this.userInfos?.nom}`
                    : 'La navigation après connexion a été refusée. Veuillez réessayer.',
                titre: 'Plateforme SIGRH',
                status: navigated ? 'INFO' : 'ERROR'
            });
        } catch {
            this.alert.showAlert({
                message: 'Impossible de charger la page après connexion. Veuillez actualiser la page.',
                titre: 'Plateforme SIGRH',
                status: 'ERROR'
            });
        } finally {
            this.isLoading = false;
            this.spinner.hide();
        }
    }

    private findMenuPath(menus: any[]): string | undefined {
        for (const menu of menus || []) {
            if (menu?.menPath === '/dashboard') {
                return '/dashboard';
            }
            const childPath = this.findMenuPath(menu?.children);
            if (childPath) {
                return childPath;
            }
            const path = menu?.menPath?.trim();
            if (path?.startsWith('/') && !path.startsWith('//') && path !== '/') {
                return path;
            }
        }
        return undefined;
    }

    private order = [113, 100, 137, 114, 130, 103, 106, 108, 126, 138];

    private sortMenus(menus: any[]): any[] {
        // Fonction de comparaison pour l'ordre personnalisé
        const compareFn = (a: any, b: any) => {
            return this.order.indexOf(a.menId) - this.order.indexOf(b.menId);
        };

        // Trier les menus
        menus.sort(compareFn);

        // Trier les sous-menus de chaque menu
        // menus.forEach(menu => {
        //   if (menu.children && menu.children.length) {
        //     menu.children.sort(compareFn);
        //   }
        // });




        return menus;
    }


}
