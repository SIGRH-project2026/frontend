import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {FormBuilder, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthService} from "../../../../services/auth.service";
import {CredentialsService} from "../../../../services/credentials.service";
import {Credentials, ResetOrForgetFormDTO} from "../../../../models/auth-response";
import {AuthResponseApi} from "../../../../models/response-api.model";
import {jwtDecode } from  'jwt-decode';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  hide = true;
  hideConfirmPassword = true;
  resetPasswordForm: any;
   isLoading: boolean = false;
   login: string = '';
   token: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
   private spinner: NgxSpinnerService,
    private authService: AuthService,
  private _credentialsService: CredentialsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.token =  this.activatedRoute.snapshot.queryParams['token'];
   // console.log('token', token)
    if(this.token!=null){
      let decodeToken: any = jwtDecode(this.token);

     // console.log("dec", decodeToken)

      this.login = decodeToken?.infos?.login

    }
    this.resetPasswordForm = this.formBuilder.group({
       password: ['', Validators.required],
      passwordConfirmed: ['', Validators.required],
    })
  }


  onResetPassword() {
    const credentials: ResetOrForgetFormDTO = {
      login: this.login,
      newPassword: this.resetPasswordForm.value.password,
      password: this.resetPasswordForm.value.password,
      passwordConfirmed:  this.resetPasswordForm.value.passwordConfirmed

    };





    this.authService.resetPassword(credentials).subscribe({
      next: (response: AuthResponseApi) => {
        this.isLoading = false;
        this.spinner.show();
        if(response?.status === 'OK') {
          const resp : any =   response.payload

          this._credentialsService.logout();
          //  console.log(resp['token'])
          this._credentialsService.setCredentials(resp["token"]);

          this.isLoading = true;
          Swal.fire({
            title: 'Votre mot de passe a été changé avec succès.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
          //  this.spinner.hide();
            this.router.navigate(['dashboard']);
          }).finally(() => {
            this.spinner.hide();
          })



        }


      },
      complete: () => {
        this.spinner.hide();
      },
      error: (error) => {
        // Error occurred, handle the error here
        this.isLoading = false;

        this.spinner.hide();
       // this.resetPasswordForm.reset();
        this.authService.showSwal('error', error);
      }
    })


  }


}
