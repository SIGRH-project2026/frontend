import { Location } from '@angular/common';
import {Component, TemplateRef, inject, OnInit} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {CredentialsService} from "../../../services/credentials.service";
import {ResponseApi} from "../../../models/response-api";
import {NgxSpinnerService} from "ngx-spinner";
import {UtilisateurService} from "../../../services/utilisateur.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResetOrForgetFormDTO} from "../../../models/auth-response";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.css']
})
export class MonCompteComponent implements OnInit {

  
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  userInfos: any;
  profile: any;
  utilisateur!: any;
   resetPasswordForm!: FormGroup;

  constructor(
    private location: Location,
    public modalService: NgbModal = inject(NgbModal),
    private credentialsService: CredentialsService,
    private spinner: NgxSpinnerService,
    private userService: UtilisateurService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',  centered: true }).result.then(
      (result) => {
        `Closed with: ${result}`;
      },
      (reason) => {
        `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  
  onUpdateInfos() {


    Swal.fire({
      icon: 'success',
      html: 'Informations modifiées avec succès.',
      showConfirmButton: false,
      timer: 1500
    })
  }

  onUpdatePassword() {


    const credentials: ResetOrForgetFormDTO = {
      login: this.userInfos?.email,
      newPassword: this.resetPasswordForm.value.newPassword,
      password: this.resetPasswordForm.value.password

    };

   // console.log(credentials)

    this.authService.updatePassword(credentials).subscribe( {
      next: (response) => {
        console.log(response)

        if(response?.status === 'BAD_REQUEST') {
          this.authService.showSwal('error', response?.message);
        } else {
          Swal.fire({
            html: 'Votre mot de passe a été changé avec succès.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {

            this.modalService.dismissAll();
          })
        }
      },
      complete: () => {},

      error: (error) => {
        this.authService.showSwal('error', error);
      }

    })


  }

  onReset() {
    this.location.back();
  }


  ngOnInit(): void {
    this.userInfos = this.credentialsService.getUserInfos();
    this.getCentralUser(this.userInfos?.id);
    this.initForm();
  }


  initForm() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      passwordConfirmed: ['', Validators.required],
    })
  }



  getCentralUser(id: number) {
    this.spinner.show();
    this.userService.getUser(id)
        .subscribe({
          next : (response : ResponseApi) => {
            if(response.success){
              this.utilisateur = response.data;

              // console.log(this.utilisateur);
              this.profile = this.utilisateur.profils[0];

              this.spinner.hide()


            }
          }
        })
  }
}
