import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {DemandeStage} from "../../../../../models/demande-stage.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-enregister-attestation-stage',
  templateUrl: './enregister-attestation-stage.component.html',
  styleUrls: ['./enregister-attestation-stage.component.css']
})
export class EnregisterAttestationStageComponent implements OnInit{

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

  getDemande(){
    this.spinner.show()
    this.demandeStageService.getDemande(this.idDemandeStage).subscribe((res)=>{
      this.demandeStage = res.payload
      this.spinner.hide()

    })
  }

  initForm(){
    this.rapportStageForm = this._formGroup.group({
      commentaire: [''],
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

      this.demandeStageService.saveAttestationStage({commentaire: this.rapportStageForm.value.commentaire, demandeStageId: this.idDemandeStage})
          .subscribe((res)=>{
            this.demandeStageService.uploadFileForAttestationStage(res.payload.id,formData).subscribe((result)=>{
              if (res.status === 'OK'){
                this.spinner.hide()

                Swal.fire({
                  icon: 'success',
                  html: 'L’attestation de stage a été enregistrée avec succès.',
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
    let acceptedFile = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf']

    if (!acceptedFile.includes(event.addedFiles[0].type)){
      this.alert.showAlert({status: 'EXCEPTION', message: "Fichier invalide.", titre: "Piece jointe"});
    }else{
      if (this.piecesJointeFile)
        this.alert.showAlert({status: 'OK', message: "Pièce jointe changé.", titre: "Piece jointe"});
      this.piecesJointeFile = event.addedFiles[0]
    }

  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }


  ngOnInit(): void {
    this.idDemandeStage = this.route.snapshot.paramMap.get('dataId')
    this.getDemande()
    this.initForm()
  }
}
