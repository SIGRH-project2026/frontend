import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {ActivatedRoute} from "@angular/router";
import {CampagneService} from "../../../../../services/campagne.service";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExpressionDeBesoinService} from "../../../../../services/expression-de-besoin.service";

@Component({
  selector: 'app-edit-expression',
  templateUrl: './edit-expression.component.html',
  styleUrls: ['./edit-expression.component.css']
})
export class EditExpressionComponent{
 
  text = '';
  expressionId: string | null = '';
  campaign: any = null;
  myForm!: FormGroup;
  expressionDeBesoin: any

  constructor(
      private route: ActivatedRoute,
    private location: Location,
      private alert : AlertService,
      private campagneService: CampagneService,
      private fb: FormBuilder,

      private expressionDeBesoinService: ExpressionDeBesoinService,
  ){}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      // date: ['', Validators.required],
      besoin: ['', Validators.required],
      motif: ['', Validators.required],
    });
    this.expressionId = this.route.snapshot.paramMap.get('themeId')
    this.getCampagne()
    this.getExpressionDeBesoin()

    }

  onEditExpressionDeBesoin(){
    if (this.myForm.valid) {
      // Perform actions with form data
      const formData = this.myForm.value;
      this.expressionDeBesoinService.editExpressionDeBesoin(formData,this.expressionId).subscribe((res)=>{
        if (res.status === 'OK'){
          Swal.fire({
            text: `Expressions de besoins a éte modifiée avec succès`,
            icon: 'success',
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false
          }).then(() => {
            this.location.back();
          })
        }else{
          this.alert.showAlert({status: res.status, message: res.message, titre: "Erreur Enregistrement expression de besoin."});

        }

      })
    }else{
      this.alert.showAlert({status: "ERROR", message: "Veuillez renseigner tous les champs svp.", titre: "Soumission expression de besoin."});
    }

  }

  getExpressionDeBesoin(){
    this.expressionDeBesoinService.getExpressionDeBesoin(this.expressionId).subscribe((res)=>{
      this.expressionDeBesoin = res.payload
      this.myForm.patchValue({motif: this.expressionDeBesoin.motif, besoin: this.expressionDeBesoin.besoin});
    })
  }

  idCampagne:any = ''
  getCampagne(){
    this.idCampagne = sessionStorage.getItem('campagneId');
    this.campagneService.getCampagne(this.idCampagne!).subscribe((res)=>{
      if (res.status === 'OK'){
        this.campaign = res.payload
        switch (this.campaign.statut){
          case 'NEW_CAMPAGNE':
            this.campaign['statut'] = 'Nouvelle'
            break
          case 'STARTED_CAMPAGNE':
            this.campaign['statut'] = 'En cours'
            break
          case 'ENDED_CAMPAGNE':
            this.campaign['statut'] = 'Clôturée'
            break
          default:
            break
        }

      }else{
        this.alert.showAlert({status: res.status, message: res.message, titre: "Erreure recuperation expression de besoin."});

      }
    })
  }


  onEditDemande(): void {
    Swal.fire({
      title: 'Souhaitez-vous confirmer ces modifications ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onEditExpressionDeBesoin()
      }
    })
  }

  onReset() {
    this.location.back();
  }
}
