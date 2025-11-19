import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {CampagneService} from "../../../../../services/campagne.service";
import {ResponseApi} from "../../../../../shared/models/utils/response-api.model";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {CampagneInterface} from "../../../../../models/campagne.interface";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-edit-create-campagne',
  templateUrl: './edit-create-campagne.component.html',
  styleUrls: ['./edit-create-campagne.component.css']
})
export class EditCreateCampagneComponent implements OnInit{

  campagneForm!: FormGroup;
  actionBtn: string = "Enregistrer";
  titleForm: string = "Nouvelle campagne";


  @Input() editData!: CampagneInterface ;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private campagneService : CampagneService,
    private alert: AlertService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit() {
    this.initForm();
  }

  listFiledForEdit: any[] = []
  // Initialiser le formulaire
  initForm() {
    this.campagneForm = this.fb.group({
      nom: ['', Validators.required,],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });


    if (this.editData) {
      // this.piecesJointesFiles = this.editData.pieceJoint
      this.listFiledForEdit = this.editData.pieceJoint
      this.titleForm = "Modifier Campagne";
      //  get Action button
      this.actionBtn = "Modifier";
      // get Form Value
      this.campagneForm.patchValue(this.editData);
    }
  }


  onSubmit() {
    this.spinner.show()
    if (this.campagneForm.valid) {
    const formData = this.campagneForm.value;
      if (this.editData){
        console.log('===============')
        console.log(this.piecesJointesFiles)
        this.campagneService.editCampagne(this.editData.id, {
          "nom": formData.nom,
          "dateDebut": formData.dateDebut,
          "dateFin": formData.dateFin,
          // "isFilePresent": this.piecesJointesFiles.length === 0 ? "non" : "oui"
        }).subscribe((res)=>{
          if (res.status === "EXCEPTION"){
            this.spinner.hide()
            this.alert.showAlert({status: res.status, message: res.message, titre: "Démarrage Campagne."});
          }else {
            const formData = new FormData();
            if (this.piecesJointesFiles.length == 1) {
              console.log("Un fichier");
              formData.append('files', this.piecesJointesFiles[0]);
            }
            else{
              console.log("Plusieur fichiers");
              this.piecesJointesFiles.forEach(value => {
                formData.append('files', value);
              });
            }

            // formData.append('files', this.piecesJointesFiles);
            if (this.piecesJointesFiles.length != 0){
              this.campagneService.saveCampgneFile(formData,res.payload.id).subscribe((res)=>{
                this.spinner.hide()
                Swal.fire({
                  title:
                      'La campagne a été modifiée avec succès.' ,

                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {

                  this.activeModal.close('Submit click');
                })
              })
            }else{
              this.spinner.hide()
              Swal.fire({
                title:
                    'La campagne a été modifiée avec succès.' ,

                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.spinner.hide()
                this.activeModal.close('Submit click');
              })
            }


          }
        })

      }else{
        this.campagneService.saveCampagne({
          "nom": formData.nom,
          "dateDebut": formData.dateDebut,
          "dateFin": formData.dateFin,
        }).subscribe((res: ResponseApi)=>{

            const formData = new FormData();
            this.piecesJointesFiles.forEach(value => {
              formData.append('files', value);
            });
            if (res.status === 'OK'){
              if (this.piecesJointesFiles.length != 0){
                this.campagneService.saveCampgneFile(formData,res.payload.id).subscribe((res)=>{
                  this.spinner.hide()
                  Swal.fire({
                    title:
                        'La campagne a été enregistrée avec succès.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                  }).then(() => {
                    this.activeModal.close('Submit click');
                  })
                })
              }else{
                this.spinner.hide()
                Swal.fire({
                  title:
                      'La campagne a été enregistrée avec succès.',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  this.activeModal.close('Submit click');
                })
              }


            }else{
              this.spinner.hide()
              this.alert.showAlert({status: res.status, message: res.message, titre: "Créaction Campagne."});
            }
          // }


        })
        this.spinner.hide()
      }
    }else{
      this.spinner.hide()
      this.alert.showAlert({status: "ERROR", message: "Veuillez renseigner tous les champs svp.", titre: "Créaction Campagne."});
    }
  }

  onCancel() {
    this.activeModal.dismiss('Cancel click');
  }


  piecesJointesFiles: File[] = [];
  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    console.log(event);
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  deletePieceJoint(idCampagne: string, file: any) {

    this.spinner.show();

    this.campagneService.deleteCampgneFile(idCampagne,file.id).subscribe((res)=>{
      console.log(res.message);
      if (res.status == 'OK') {
        this.listFiledForEdit = this.listFiledForEdit.filter(value => value != file)
        this.spinner.hide()
        this.alert.showAlert({message: res.message, titre: 'Suppression fichier', status: 'OK'});
      }
      else{
        this.alert.showAlert({message: res.message, titre:'Suppression fichier', status:'EXCEPTION'})
        this.spinner.hide();
      }
    })
  }
}
