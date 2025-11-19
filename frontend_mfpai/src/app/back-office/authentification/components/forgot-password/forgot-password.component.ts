import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
   isLoading = false;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      login: ['', Validators.required]
    })
  }

  onForgetPassword() {
   // console.log(this.forgetPasswordForm.value.login)
    const login = this.forgetPasswordForm.value.login
    this.authService.forgotPassword(login).subscribe({
      next: (response) => {

        if(response?.status === 'NOT_FOUND') {
          this.authService.showSwal('error', response.message);
        }else {
          Swal.fire({
            title: "Votre demande de changement de mot de passe est bien prise en compte. Merci de réinitialiser votre mot de passe.",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: 'rgba(29, 74, 123, 1)',
            confirmButtonText: 'OK',
          }).then(() => {
             this.router.navigate(['login'], { relativeTo: this.route.parent });
          })
        }

      },

      complete: () => {
        // Called when the request is completed (optional)
      },
      error: (error) => {
        // Error occurred, handle the error here
        this.isLoading = false;
        // this.loginForm.reset();
        console.log(error)
        this.authService.showSwal('error', error);
      }

    })


  }
}
