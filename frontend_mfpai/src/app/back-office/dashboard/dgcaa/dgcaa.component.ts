import { Component } from '@angular/core';
import { IndicateurActe } from '../models/IndicateurActe';
import { ActeService } from 'src/app/services/acteService.service';
import { CredentialsService } from 'src/app/services/credentials.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TypeAGDTO } from '../../carrieres/mes-demandes/components/models/TypeAGDTO ';
import { TypeAADTO } from '../../carrieres/mes-demandes/components/models/TypeAADTO ';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dgcaa',
  templateUrl: './dgcaa.component.html',
  styleUrls: ['./dgcaa.component.css']
})

export class DgcaaComponent {
  profileCode: any;
  filterForm!:FormGroup;
  userInfos: any;
  profilConnecte: any;
  statActes !: IndicateurActe;
  items !: { title: string; count: number; statut: string; path: string; }[];
  selectedActe: string = '';
  showTypeActe: boolean = false;
  selectedTypeActe: string = '';
  actes: TypeAADTO[] | TypeAGDTO[] = [];
  acteAA:TypeAADTO[]=[];
  acteAG:TypeAGDTO[]=[];
  url:string='/carrieres/demandes-recues-dashboard';

  onActeChange() {
    this.showTypeActe = true;
    if (this.selectedActe=='Acte Administratif') {
      this.actes=this.acteAA;
    } else {
      //this.showTypeActe = false;
      this.selectedTypeActe = '';
      this.actes=this.acteAG;
    }
  }

  constructor(
    private router: Router,
    private readonly acteService : ActeService,
    private readonly _credentialService: CredentialsService,
    private spinner: NgxSpinnerService,

  ){
    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profileCode = this.profilConnecte[0].code
  }
  ngOnInit(): void {
    //this.statistiquesActe(this.profileCode,this.selectedTypeActe);
    this.getAA();
    this.getAG();
  }


  getAA() {
    this.acteService.listAA().subscribe({
        next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
                this.acteAA = data.payload;
               // console.log({AA: this.acteAA});
            }
        }
    });
}

getAG() {
    this.acteService.listAG().subscribe({
        next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
                this.acteAG = data.payload;
                //console.log({AG: this.acteAG});
            }
        }
    });
}

filtrer(){
  //console.log('Hello')
  this.statistiquesActe(this.profileCode,this.selectedTypeActe) ;

   //console.log(this.selectedActe)
  //console.log(this.selectedTypeActe)

}


  redirect(url: string) {
   // console.log("redirection");
    this.router.navigateByUrl(url)
  }

  getBackgroundColor(title: string): string {
    if (title.toLowerCase().includes('sortie')) {
      return 'background-pink';
    } else if (title.toLowerCase().includes('actes')) {
      return 'background-gray';
    } else if (title.toLowerCase().includes('demandes')) {
      return 'background-green';
    }
    return '';
  }

  getIconColor(title: string): string {
    if (title.toLowerCase().includes('Actes')) {
      return 'rose';
    } else if (title.toLowerCase().includes('agents')) {
      return 'gray';
    } else if (title.toLowerCase().includes('demandes')) {
      return 'green';
    }
    return 'black';
  }

  statistiquesActe(profil: string,codeTypeActe:string) {
    this.spinner.show()
    this.acteService.statActes(profil,codeTypeActe)
      .subscribe({
        next: (data: ResponseApi2) => {
          if (data.status?.includes("OK")) {
            this.spinner.hide();
            this.statActes = data.payload
            console.log({ ind: this.statActes });
            this.items = [
              { title: 'Demande d\'Actes',  count: this.selectedActe==="Acte Administratif" ? this.statActes.countInProcessAA : this.statActes.countInProcessAG, statut: 'en cours de traitement',path:this.selectedActe==="Acte Administratif" ?`${this.url}/aa/${this.selectedTypeActe}/InProcess`:`${this.url}/ag/${this.selectedTypeActe}/InProcess`},
              { title: 'Demande d\'Actes ', count: this.selectedActe==="Acte Administratif" ? this.statActes.countValidAA : this.statActes.countValidAG, statut: 'validés', path:this.selectedActe==="Acte Administratif" ? `${this.url}/aa/${this.selectedTypeActe}/VALIDEDGCAA`:`${this.url}/ag/${this.selectedTypeActe}/VALIDEDGCAA` },
              { title: 'Demande d\'Actes ', count: this.selectedActe==="Acte Administratif" ? this.statActes.countRejectAA : this.statActes.countRejectAG, statut: 'rejetés', path:this.selectedActe==="Acte Administratif"? `${this.url}/aa/${this.selectedTypeActe}/INVALIDEDGCAA`: `${this.url}/ag/${this.selectedTypeActe}/INVALIDEDGCAA`},
              { title: 'Demande d\'Actes ', count: this.selectedActe==="Acte Administratif" ? this.statActes.sumAA : this.statActes.sumAG, statut: 'total', path:this.selectedActe==="Acte Administratif"? `${this.url}/aa/${this.selectedTypeActe}/all`:`${this.url}/ag/${this.selectedTypeActe}/all` },
              // { title: 'Sortie temporaire', count: this.statActes?.countStem, statut: 'Total', path: '/carrieres/sortie-temporaire' },
              // { title: 'Sortie définitive', count: this.statActes?.countSdef, statut: 'Total', path: '/carrieres/sortie-definitive' },
              // -----------------------
              //               a) Un clic sur un type  "d'acte d'administration", m'afficher les boxes suivants
              //                 - Nombre de demande de ce  Type  d'acte Total enregistrés
              //                   - Nombre de demande de ce  Type  d'acte en cours de traitement
              //                     - Nombre de demande de ce  Type  d'acte validées
              //                       - Nombre de demande de ce  Type  d'acte   rejetés
            ];

            //console.log({items : this.items});
            
          }
      }
    })

  }

  viewBox(item : any) : boolean{
    if((this.profileCode.includes("Chef-service") || this.profileCode.includes("Chef-division")) && this.profileCode !== 'Chef-division-dgpeec')
      if(this.profileCode.includes("Chef-service") )
        this.profileCode = "Chef-service"
      else
        this.profileCode = "Chef-division"

    let profile = item.role.find((pro : any) =>((pro === this.profileCode)))
    if(profile)
      return true
    return false
  }
}
