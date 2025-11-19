import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {NgxSpinnerService} from "ngx-spinner";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {DemandeStage} from "../../../../../models/demande-stage.interface";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-autorisation-stage',
  templateUrl: './autorisation-stage.component.html',
  styleUrls: ['./autorisation-stage.component.css']
})
export class AutorisationStageComponent implements OnInit {

  piecesJointesFiles: File[] = [];
  demandeStage!: DemandeStage;
  form!: FormGroup

  constructor(
    private router: Router,
    private location :Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private demandeStageService: DemandeStageService,
    private alert: AlertService,
    private formGroup: FormBuilder
  ) { }


  initForm(){
    this.form = this.formGroup.group({
      dateDebut: new FormControl('', [Validators.required]),
      dateFin: new FormControl('', [Validators.required])
    })
  }

  /**
   * recuperation demande de stage
   */
  getDemande(){
   this.spinner.show()
    this.demandeStageService.getDemande(this.route.snapshot.paramMap.get('dataId')).subscribe((res)=>{
      if (res.status === 'OK'){
        this.demandeStage = res.payload
        this.spinner.hide()
      }else{
        this.spinner.hide()
      }

    })
  }
  ngOnInit(): void {
    this.getDemande()
    this.initForm()
  }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {

        filesArray.push(...event.addedFiles);

  }

  onRemoveFile(event: File, filesArray: File[]) {
      filesArray.splice(filesArray.indexOf(event), 1);
  }

  onSaveDemande() {
    if (this.piecesJointesFiles.length > 1){
      this.alert.showAlert({status:'EXCEPTION',message:'Veuillez choisir un seul pièce jointe ',titre:'Chargement autorisation'})
    }else if(this.piecesJointesFiles.length === 0){
      this.alert.showAlert({status:'EXCEPTION',message:'Veuillez choisir un pièce jointe ',titre:'Chargement autorisation'})
    }
      else{
      let data = {
        id: this.demandeStage.id,
        dateDebut: this.form.value['dateDebut'],
        dateFin: this.form.value['dateFin']
      }
      if (this.form.valid){
        this.spinner.show()
        this.demandeStageService.authorisationDeStage(data).subscribe((res)=>{
          if (res.status === 'OK'){

            let formData = new FormData()
            this.piecesJointesFiles.forEach(file => {
              formData.append('files', file);
            });

            this.demandeStageService.uploadFileForAuthorization(this.demandeStage.id.toString(),formData).subscribe((res)=>{
              if (res.status === 'OK'){
                this.spinner.hide()
                Swal.fire({
                  icon: "success",
                  html: "L' autorisation de stage a été enregistré avec succès.",
                  showConfirmButton: false,
                  timer: 2000,
                }).then(() => {
                  this.router.navigate(["formations/stages-internes"]);
                });
              }else{
                this.spinner.hide()
                this.alert.showAlert({status:res.status,message:res.message,titre:'Enregistrement authorisation de stage.'})
              }
            })

          }else{
            this.spinner.hide()
            this.alert.showAlert({status:res.status,message:res.message,titre:'Enregistrement authorisation de stage.'})
          }
        })
      }else{
        this.alert.showAlert({status:'EXCEPTION',message:'Veuillez renseigner tous les champs svp.',titre:'Enregistrement authorisation de stage.'})
      }

    }


  }
  onReset() {
    this.location.back();
  }
}
