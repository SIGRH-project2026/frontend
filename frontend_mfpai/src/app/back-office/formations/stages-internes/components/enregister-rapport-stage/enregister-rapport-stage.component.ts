import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {DemandeStage} from "../../../../../models/demande-stage.interface";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-enregister-rapport-stage',
  templateUrl: './enregister-rapport-stage.component.html',
  styleUrls: ['./enregister-rapport-stage.component.css']
})
export class EnregisterRapportStageComponent implements OnInit{

  piecesJointeFile!: File;
  demandeStage!: DemandeStage
  idDemandeStage: string | null = ""
  rapportStageForm!: FormGroup;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private demandeStageService: DemandeStageService,
    private _formGroup: FormBuilder,
    private alert : AlertService,
    private spinner: NgxSpinnerService
  ){}


  initForm(){
    this.rapportStageForm = this._formGroup.group({
      commentaire: [''],
    })
  }

  ngOnInit(): void {

    this.idDemandeStage = this.route.snapshot.paramMap.get('dataId')
    this.getDemande()
    this.initForm()
  }

  getDemande(){
    this.spinner.show()
    this.demandeStageService.getDemande(this.idDemandeStage).subscribe((res)=>{
      this.spinner.hide()
      this.demandeStage = res.payload
    })
  }



  onSaveDemande(){
    this.spinner.show()
    const formData = new FormData();
    formData.append('file', this.piecesJointeFile);
    if (!this.piecesJointeFile){
      this.spinner.hide()
      this.alert.showAlert({status: "EXCEPTION", message: "Veuillez choisir pièces joints", titre: "Enregistrement Rapport de Stage"});
    }else{
      this.demandeStageService.saveRapportStage({commentaire: this.rapportStageForm.value.commentaire, demandeStageId: this.idDemandeStage})
          .subscribe((res)=>{
            this.demandeStageService.uploadFileForRapportStage(res.payload.id,formData).subscribe((result)=>{
              this.spinner.hide()
              if (res.status === 'OK'){
                Swal.fire({
                  icon: 'success',
                  html: 'Le rapport de stage a été enregistré avec succès.',
                  showConfirmButton: false,
                  timer: 2000
                }).then(() => {
                  this.location.back();
                })
              }else{
                this.spinner.hide()
                this.alert.showAlert({status: res.status, message: res.message, titre: "Enregistrement Rapport de Stage"});
              }
            })
          })
    }
  }

  onReset() {
    this.location.back();
  }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File) {
    this.piecesJointeFile = event.addedFiles[0]
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

}
