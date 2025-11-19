import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DemandePecService } from 'src/app/services/demandePecService';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { FileService } from 'src/app/shared/services/files/file.service';
import Swal from 'sweetalert2';
import { DemandePecDTO } from '../../../models/DemandePecDTO';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { FileDTO } from 'src/app/back-office/carrieres/mes-demandes/components/models/FileDTO';

@Component({
  selector: 'app-edit-demande',
  templateUrl: './edit-demande.component.html',
  styleUrls: ['./edit-demande.component.css']
})
export class EditDemandeComponent implements OnInit{


  infosBeneficiairesGroup = this._formBuilder.group({});
  infosDemandeursGroup = this._formBuilder.group({});
  demandePecForm!:FormGroup;
  demandeId!:any;
  demande!:DemandePecDTO;
  userDTO!:UserDTOs;
  selectedDiscipline: string = '';
  piecesJointesFiles: any[] = [];
  typeSelectionne:string="";

  files: any;
 
  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private readonly _fb : FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly userService:UtilisateurService,
    private readonly fileService:FileService,
    private readonly demandeService:DemandePecService
  ) { 
    this.demandeId = this.activatedRoute.snapshot.paramMap.get('dataId')

  }

  ngOnInit(): void {
    this.getOneDemande();
    this.initForm();

  }

  getOneDemande(){
    this.demandePecService.getDemandePec(this.demandeId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.demande = data.payload;
              this.typeSelectionne=this.demande.typeDemandePeec.code;
              console.log({acte:this.demande});
            }
          }
        });
}



loadDemandeData() {
  this.demandePecForm.patchValue({
    codeTypeDemande: this.demande?.codeTypeDemande || '',
    dateDemande: this.demande?.dateDemande || '',
    objetDemande: this.demande?.objetDemande || ''
  });

 // this.piecesJointesFiles = this.demande?.pieceJointes || [];
}

onReset1() {
  this.demandePecForm.reset();
}


initForm(): void {
  this.demandePecForm = this._fb.group({
    codeTypeDemande:[''],
    dateDemande:[''],
    objetDemande:[''],
  });
  //this.loadDemandeData();

}

  onSaveDemande() {
    console.log("i'm saving");
    let demandePec : DemandePecDTO = new DemandePecDTO()
    console.log(demandePec)
    console.log(this.demandePecForm.value)
    demandePec.objetDemande=this.demandePecForm.value.objetDemande;
    demandePec.codeTypeDemande=this.demandePecForm.value.codeTypeDemande;
    //demandePec.dateDemande=this.demandePecForm.value.dateDemande
    console.log({demandePec:demandePec});
    this.demandePecService.editPec(this.demande.id,demandePec)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
          {
            console.log({data : data});
            this.storeFile(data.payload.id)
            Swal.fire({
              icon: 'success',
              html: 'La demande d\'acte a été soumise avec succès.',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['affaires-sociales/mes-demandes']);
            });
          }
      }
    });
    Swal.fire({
      icon: 'success',
      html: 'Demande de prise en charge a été modifiée avec succès.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.location.back();
    })
  }

  storeFile(id:number){
    //console.log(this.files);
    this.fileService.storeMultipleFiles(id,"pec",this.piecesJointesFiles).
    subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
          {
           // console.log({files : data});
          }
      }
    })
  }


  onDisciplineChange(value: string) {
    this.selectedDiscipline = value;
  }

   onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }
  onRemove(event: FileDTO) {
    console.log(event);
    this.files.splice(event.id);
  }
   

  onReset() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous annuler l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.demandePecForm.reset();
        this.loadDemandeData();
        Swal.fire({
          html: 'L’enregistrement  a été annulé avec succès.',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        }).then(() => {
          this.location.back();
        })
      }
    });
  }
}


