import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {CredentialsService} from "../../../../../services/credentials.service";
import {CampagneService} from "../../../../../services/campagne.service";
import {CampagneInterface} from "../../../../../models/campagne.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExpressionDeBesoinService} from "../../../../../services/expression-de-besoin.service";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-soumettre-expression',
  templateUrl: './soumettre-expression.component.html',
  styleUrls: ['./soumettre-expression.component.css']
})
export class SoumettreExpressionComponent implements OnInit{


  id: string | null | undefined;
  campaign: any | undefined;
   constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    // private credentialsService: CredentialsService,
    private campagneService: CampagneService,
    private expressionDeBesoinService: ExpressionDeBesoinService,
    private fb: FormBuilder,
    private alert: AlertService,
    private spinner: NgxSpinnerService
  ){}

  myForm!: FormGroup;
  formGroup!: FormGroup;

   initForm(){
     this.myForm = this.fb.group({
       // date: ['', Validators.required],
       besoin: ['', Validators.required],
       motif: ['', Validators.required],
     });
   }
  ngOnInit(): void {
    this.initForm()
    this.id = this.route.snapshot.paramMap.get('campagneId');
    this.getCampagne()
    }

    getCampagne(){
     this.spinner.show()
      this.campagneService.getCampagne(this.id!).subscribe((res)=>{
        if (res.status === 'OK'){

          this.campaign = res.payload
          this.spinner.hide()
        }else{
          this.spinner.hide()
          this.alert.showAlert({status: res.status, message: res.message, titre: "Erreure recuperation expression de besoin."});

        }
      })

    }




  onSaveExpression(){
    this.spinner.show()
    if (this.myForm.valid) {
      // Perform actions with form data
      const formData = this.myForm.value;
      this.expressionDeBesoinService.soumettreExpressionDeBesoin(formData,this.id).subscribe((res)=>{
        if (res.status === 'OK'){
          this.spinner.hide()
          Swal.fire({
            icon: 'success',
            html: 'La demande d\'expression de besoins a été soumise avec succès.',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['formations/expression-besoins']);
          })
        }else{
          this.spinner.hide()
          this.alert.showAlert({status: res.status, message: res.message, titre: "Erreur Enregistrement expression de besoin."});

        }

      })
    }else{
      this.spinner.hide()
      this.alert.showAlert({status: "ERROR", message: "Veuillez renseigner tous les champs svp.", titre: "Soumission expression de besoin."});
    }

  }

  onReset() {
    this.location.back();
  }

}
