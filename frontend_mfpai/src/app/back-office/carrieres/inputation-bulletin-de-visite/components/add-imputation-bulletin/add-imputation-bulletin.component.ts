import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ImputationOuBulletinService } from '../../../services/ImputationOuBulletin/ImputationOuBulletin.service';
import { UserDTOs } from 'src/app/models/UserDTOs';

import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FileService } from 'src/app/shared/services/files/file.service';
import { ImputationDTO } from '../../../models/dossier-agent/imputation';
import { Imputation } from '../../../models/dossier-agent/imputation';



@Component({
  selector: 'app-add-imputation-bulletin',
  templateUrl: './add-imputation-bulletin.component.html',
  styleUrls: ['./add-imputation-bulletin.component.css']
})
export class AddImputationBulletinComponent implements OnInit {
  selectedValue: string =''  ;

  matricule !: string

  utilisateur !: UserDTOs

  Imputation !: Imputation

  imputationForm !: FormGroup
  selectedFile : boolean = false;
  isSoi: boolean = false;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private imputationOuBulletinService : ImputationOuBulletinService,
    private fileService : FileService
  ) { }


  ngOnInit(): void {
    this.initForm()
    this.matricule = this.route.snapshot.params['matricule'];
    this.imputationOuBulletinService.recherche(this.matricule)
      .subscribe({
        next : (data : any)=>{
          //this.Imputation = data.data
          this.utilisateur = data.data.utilisateur
          console.log("add imputation part ==== >",this.utilisateur);
        },
        error : (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Agent introuvable',
            text: error?.error?.message ?? "Impossible de retrouver les informations de l'agent pour le matricule saisi.",
            showConfirmButton: true,
          }).then(() => {
            this.router.navigate(['carrieres/inputation-bulletin']);
          })
        }
      })
  
   }

   initForm() {
    this.imputationForm = this._formBuilder.group({
      typeDemande: ['',Validators.required],
      //dateImputation: ['',Validators.required],
      statusBeneficiere: ['',Validators.required],
      prenomBeneficiere: ['',Validators.required],
      nomBeneficiere: ['',Validators.required],
/*       numeroDemande : ['',Validators.required],
 */      status: true // Actif default value
    });
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: [''],
  });


  onSelectionChange(value: string): void {
    console.log("value : ", value);
    
    this.selectedValue = value!;
    if(value =="Soi"){
      this.isSoi = true
    }

    console.log("impu form ", this.imputationForm);
    
  }



  files: File[] = [];
  filesIsNull : boolean = true
  disableButton : boolean = true

  onSelect(event: { addedFiles: File[]; rejectedFiles?: File[]; }) {
    const pdfFiles = event.addedFiles.filter(file => /\.pdf$/i.test(file.name));
    if (event.rejectedFiles?.length || pdfFiles.length !== event.addedFiles.length) {
      Swal.fire({
        icon: 'error',
        title: 'Format de fichier non autorisé',
        text: 'Veuillez insérer uniquement des pièces justificatives au format PDF (.pdf). Les autres formats ne sont pas acceptés.',
        confirmButtonText: 'Compris'
      });
    }
    this.files.push(...pdfFiles);
    this.filesIsNull = this.files.length === 0;
    this.selectedFile = !this.filesIsNull;
  }

  disabledButtonFunc(){
    if(this.imputationForm.value.statusBeneficiere != 'Soi' && this.filesIsNull){
      this.disableButton = false
    }

  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    this.filesIsNull = this.files.length === 0;
    this.selectedFile = !this.filesIsNull;
  }

  onSaveImputationBulletin(){
    let imputationDTO : ImputationDTO = new ImputationDTO();
    imputationDTO.utilisateurId = this.utilisateur.id;
    imputationDTO.statusBeneficiere = this.imputationForm.value.statusBeneficiere
    if( this.imputationForm.value.statusBeneficiere =="Soi"){
     // console.log("ici ");
      imputationDTO.prenomBeneficiere = this.utilisateur.prenom
      imputationDTO.nomBeneficiere = this.utilisateur.nom
    }else{
      imputationDTO.prenomBeneficiere = this.imputationForm.value.prenomBeneficiere
      imputationDTO.nomBeneficiere = this.imputationForm.value.nomBeneficiere
    }
    imputationDTO.typeDemande = this.imputationForm.value.typeDemande
    //imputationDTO.dateImputation = this.imputationForm.value.dateImputation
/*     imputationDTO.numeroDemande = this.imputationForm.value.numeroDemande
 */

    this.imputationOuBulletinService.post(imputationDTO).
    subscribe({
      next : (data : any) =>{
        if(data.success){  
          for(let i=0; i<this.files.length; i++)        
            this.storeFile(data.data.id, this.files[i])
          Swal.fire({
            icon: 'success',
            // title: 'Confirmation',
            html: 'La demande   <strong>(Imputation Budgetaire/Bulletin de visite) </strong>  a été enregistrée avec succès.',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['carrieres/inputation-bulletin']);
          })
        }else{
          Swal.fire({
            icon: 'error',
            // title: 'Confirmation',
            html: 'Error création de la demande   <strong>(Imputation Budgetaire/Bulletin de visite) </strong>',
            showConfirmButton: false,
            timer: 2000
          })
        }
        
      }
    })
  
}

storeFile(id:number, file : File){
  this.fileService.storeSingleImputationFile(id,file).
  subscribe({
    next : (data : ResponseApi2) => {
      if(data.status?.includes("OK"))
        {
         // console.log({files : data});
        }
    }
  })
}
onCancel(){
  Swal.fire({
    icon: 'info',
    title: 'Confirmation',
    html: "Voulez-vous annuler l'enregistrement ?",
    showConfirmButton: true,
    showCancelButton : true ,
    cancelButtonColor : '#FF4D4F',
    cancelButtonText : 'Non',
    confirmButtonText : 'Oui'
   
  }).then((result) => {
    if (result.isConfirmed) {
      this.imputationForm.reset()
      this.router.navigate(['carrieres/inputation-bulletin']);
    }
  })
}
}
