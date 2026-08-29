import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../services/auth.service';
import { ActivateAccountDTO } from '../../../../models/auth-response';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent {
  activationForm: FormGroup;
  isLoading = false;
  hideDefaultPassword = true;
  hideNewPassword = true;
  hideConfirmation = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.activationForm = this.formBuilder.group({
      matricule: ['', [Validators.required, Validators.maxLength(20)]],
      defaultPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmed: ['', Validators.required]
    });
  }

  activate(): void {
    if (this.activationForm.invalid || this.isLoading) return;
    if (this.activationForm.value.newPassword !== this.activationForm.value.passwordConfirmed) {
      this.authService.showSwal('error', 'Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading = true;
    const data: ActivateAccountDTO = {
      ...this.activationForm.getRawValue(),
      matricule: this.activationForm.value.matricule.trim()
    };
    this.authService.activateAccount(data).subscribe({
      next: response => {
        this.isLoading = false;
        if (response.status !== 'OK') {
          this.authService.showSwal('error', response.message);
          return;
        }
        Swal.fire({
          icon: 'success',
          title: 'Compte activé',
          text: response.message,
          confirmButtonColor: '#056db6'
        }).then(() => this.router.navigate(['/auth/login']));
      },
      error: message => {
        this.isLoading = false;
        this.authService.showSwal('error', message);
      }
    });
  }
}
