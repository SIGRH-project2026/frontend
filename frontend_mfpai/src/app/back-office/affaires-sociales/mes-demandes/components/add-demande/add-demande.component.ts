import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DemandePecService } from 'src/app/services/demandePecService';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { FileService } from 'src/app/shared/services/files/file.service';
import Swal from 'sweetalert2';
import { DemandePecDTO } from '../../../models/DemandePecDTO';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { ActeService } from 'src/app/services/acteService.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';

@Component({
  selector: 'app-add-demande',
  templateUrl: './add-demande.component.html',
  styleUrls: ['./add-demande.component.css']
})
export class AddDemandeComponent implements OnInit {

  infosBeneficiairesGroup = this._formBuilder.group({});
  infosDemandeursGroup = this._formBuilder.group({});


  selectedDiscipline: string = '';
  piecesJointesFiles: File[] = [];
  demandePecForm!:FormGroup;
  demandePec!:DemandePecDTO;
  typeDemande:string="";
  dateDemande:string=""
  demandeId!:number;
  typeSelectionne:string="";
  userInfos: any;
  userDTO!:UserDTOs;
  matricule:string="";
  utilisateur!:UserDTOs;
  telephone:string="";
  nom:string="";
  email!:string;
  prenom:string="";
  userId:any;
  direction:string="";
  cfp:string="";
  eff:string="";


  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private readonly _fb : FormBuilder,
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly userService:UtilisateurService,
    private readonly fileService:FileService,
    private readonly acteService:ActeService
  ) { 
    this.userInfos = this.credentialService.getUserInfos();
    this.userId=this.userInfos.id;
    //if(this.userInfos)
  //  console.log({mess:this.userInfos});
  }

  ngOnInit(): void {
    this.userId=this.userInfos.id;
    this.getInfoAgent(this.userId);
    this.initForm();
  }

  async getInfoAgent(id:number){
   await this.acteService.getOneUser(id)
    .subscribe((data: any) => {
      if (data.success) {
     //   console.log({utilisateur:data.data});
        this.userDTO=data.data;
      //  console.log({agent:data.data});
       // console.log({userDTO:this.userDTO})
      } else {
      }
    });     
  }

  initForm(): void {
    this.demandePecForm = this._fb.group({
      codeTypeDemande:['',Validators.required],
      objetDemande:['',Validators.required],
      files: [null, Validators.required],
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.demandePecForm!.controls;
  }




  checkConstraintsValidation(): void {
    Object.keys(this.f).forEach(field => {
      const control = this.demandePecForm!.get(field);
      control!.markAsTouched({onlySelf: true});
    });
  }
  onSaveDemande() {
    let demandePec : DemandePecDTO = new DemandePecDTO()
    demandePec.idUtilisateur=this.userDTO.id;
    demandePec.objetDemande=this.demandePecForm.value.objetDemande;
    demandePec.codeTypeDemande=this.demandePecForm.value.codeTypeDemande;
   // console.log({demandePec:demandePec});
    this.demandePecService.create(demandePec)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
          {
        //    console.log({data : data});
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
      html: 'Demande de prise en charge a été enregistrée avec succès.',
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
  files: File[] = [];
  onSelectFiles(event: { addedFiles: any; }) {
    const addedFiles = event.addedFiles;
    this.files.push(...addedFiles);
    this.demandePecForm.get('files')?.setValue(this.files);
    this.piecesJointesFiles = [...this.files];
  }
  
  onRemoveFile(event: File) {
    const index = this.files.indexOf(event);
    if (index !== -1) {
      this.files.splice(index, 1);
      this.demandePecForm.get('files')?.setValue(this.files.length > 0 ? this.files : null);
    }
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

