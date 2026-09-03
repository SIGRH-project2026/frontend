import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActeDTO } from '../models/ActeDTO';

import { ActeService } from 'src/app/services/acteService.service';
import { ResponseApi } from 'src/app/models/response-api';
import { CredentialsService } from 'src/app/services/credentials.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { DeconectedDTO } from 'src/app/models/utilisateur';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ResponseApiData } from 'src/app/models/response-api.model';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { FileService } from 'src/app/shared/services/files/file.service';
import { TypeAADTO } from '../models/TypeAADTO ';
import { TypeAGDTO } from '../models/TypeAGDTO ';
import { TypeActeDTO } from '../models/TypeActeDTO';

@Component({
  selector: 'app-add-acte',
  templateUrl: './add-acte.component.html',
  styleUrls: ['./add-acte.component.css']
})
export class AddActeComponent implements OnInit {
  demandeActeForm!:FormGroup;
  matricule:string="";
  agent!:DeconectedDTO;
  utilisateur!:any;
  telephone:string="";
  nom:string="";
  email!:string;
  prenom:string="";
  userId:any;
  direction:string="";
  acteDTO!:ActeDTO;
  acteAA:TypeAADTO[]=[];
  acteAG:TypeAGDTO[]=[];
  idActe!:number;
  idAgent!:number;
  filesForm!: FormGroup;
  userInfos: any;
  userDTO!:UserDTOs;
  private _alert: any;
  formBuilder: any;
 // actes: string[] = [];   
  typeSelectionne:string="";
  showDateInput = false;
  dateRetour:Date=new Date();
  actes: TypeAADTO[] | TypeAGDTO[] = [];  
  typeActes: TypeActeDTO[] = [];



  constructor(
    private router: Router,
    private location: Location,
    private readonly _fb : FormBuilder,
    private readonly acteService: ActeService,
    private readonly credentialService: CredentialsService,
    private readonly userService:UtilisateurService,
    private readonly fileService:FileService

  ){
    this.userInfos = this.credentialService.getUserInfos();
    this.userId=this.userInfos.id;
   // if(this.userInfos)
   // console.log({mess:this.userInfos})
  }

  ngOnInit(): void {
    this.userId=this.userInfos.id;
    this.getInfoAgent(this.userId);
    this.initForm();
    this.getAA();
    this.getAG();
    this.getTypeActes();
    //this.formBuilder.array([])
  }



  initForm(): void {
    this.demandeActeForm = this._fb.group({
      commentaire: [''],
      acte:['', Validators.required],
      typeActe: ['', Validators.required],
      files: [null, Validators.required] 

    });
  }

  get pieces(): FormArray {
    return this.demandeActeForm.get('pieces') as FormArray;
  }


  getInfoAgent(id:number){
    this.acteService.getOneUser(id)
    .subscribe((data: any) => {
      if (data.success) {
       // console.log({utilisateur:data.data});
        this.userDTO=data.data;
       // console.log({agent:data.data});
        //if(this.userDT)
      } else {
      }
    });     
  }

 

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
    
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

/* 
  checkIfDateRequired(selectedValue: any) {
    let type= selectedValue.target.value;
    console.log({type:type})
    if(stem.includes(type))
    //if (stem.includes(selectedValue.target.value)) {
        this.showDateInput = true;
     else {
        this.showDateInput = false;
    }
} */

  files: File[] = [];
  onSelect(event: { addedFiles: any; }) {
  //  console.log(event);
    // Limiter le nombre de fichiers à ajouter à la liste à la fois pour éviter une surcharge de traitement côté client
    const maxFilesToAdd = 10; // Limitez à 10 fichiers à la fois 
    const addedFiles = event.addedFiles.slice(0, maxFilesToAdd);
    this.files.push(...addedFiles);
    this.demandeActeForm.patchValue({ files: this.files });
    this.demandeActeForm.get('files')?.updateValueAndValidity();
   // console.log(this.files);
}
  get fics(): FormControl[] {
    return (this.filesForm.get('files') as FormArray).controls as FormControl[];
  }


  onRemove(event: File) {
   // console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    this.demandeActeForm.patchValue({ files: this.files.length > 0 ? this.files : null });
    this.demandeActeForm.get('files')?.updateValueAndValidity();
  }

  

  onchangeActe(event: any) {
    this.typeSelectionne = event.target.value;
    this.demandeActeForm.get('typeActe')?.reset('');
    const codeType = this.typeSelectionne.trim().toLowerCase();
    if (codeType === "aa") { 
        this.actes = this.acteAA;     
    } else if (codeType === "ag") {
        this.actes = this.acteAG;
    } else {
        this.actes = [];
    }
}

getTypeActes() {
    this.acteService.listTypeActe().subscribe({
        next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
                this.typeActes = data.payload ?? [];
            }
        }
    });
}

getAA() {
    this.acteService.listAA().subscribe({
        next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
                this.acteAA = data.payload;
              //  console.log({AA: this.acteAA});
            }
        }
    });
}

getAG() {
    this.acteService.listAG().subscribe({
        next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
                this.acteAG = data.payload;
                //console.log({AG: this.acteAG});
            }
        }
    });
}


  get f(): { [p: string]: AbstractControl } {
    return this.demandeActeForm!.controls;
  }


  checkConstraintsValidation(): void {
    Object.keys(this.f).forEach(field => {
      const control = this.demandeActeForm!.get(field);
      control!.markAsTouched({onlySelf: true});
    });
  }
  
  onSaveDemande(){
   // console.log(("on clique"))
    if (!this.demandeActeForm!.valid) {
      this.checkConstraintsValidation();
    }else {
    //  console.log(("on est là"))
 
    //  console.log("formulaire",this.demandeActeForm.value)
      let demandeActe : ActeDTO = new ActeDTO()
      demandeActe.idAgent=this.userDTO.id;
      demandeActe.division=this.userDTO.division
      demandeActe.direction=this.userDTO.direction
      demandeActe.commentaire=this.demandeActeForm.value.commentaire;
      // console.log({code:this.demandeActeForm.value.typeActe});
      const codeTypeActe = String(this.demandeActeForm.value.acte).trim();
      const codeTypeActeNormalise = codeTypeActe.toLowerCase();
      demandeActe.codetypeActe=codeTypeActe;
      // console.log({aaaaaaaaaa:demandeActe.codetypeActe});
      if(codeTypeActeNormalise==="aa"){
        // console.log("1111111111");
        demandeActe.codeTypeActeAA=this.demandeActeForm.value.typeActe;
      }
      if(codeTypeActeNormalise==="ag"){
        demandeActe.codeTypeActeAG=this.demandeActeForm.value.typeActe;
        //console.log("222222222222");
      }
      console.log({demande: demandeActe});
      this.acteService.create(demandeActe)
          .subscribe({
            next : (data : ResponseApi2) => {
              if(data.status?.includes("OK"))
              {
                //console.log({data : data});
                this.storeFile(data.payload.id)
                Swal.fire({
                  icon: 'success',
                  html: 'La demande d\'acte  <strong> '+data.payload.referenceActe +'</strong> a été soumise avec succès.',
                  showConfirmButton: false,
                  timer: 2000
                }).then(() => {
                  this.router.navigate(['carrieres/mes-demandes']);
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Création impossible',
                  text: data.message || data.errors || 'La demande d\'acte n\'a pas pu être créée.'
                });
              }
            },
            error: (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Création impossible',
                text: error?.error?.message || error?.message || 'Le serveur ne répond pas.'
              });
            }
          })

      //this.acteDTO=this.initDemandeActeForm.value;
  /*     Swal.fire({
        icon: 'success',
        // title: 'Création de compte',
        html: 'La demande  <strong> Numéro </strong> a été crée avec succès.',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        // this.acteService.createActe(this.acteDTO)
        this.router.navigate(['carrieres/mes-demandes']);
      }) */
    }

  }

  storeFile(id:number){
    //console.log(this.files);
    this.fileService.storeMultipleFiles(id,"acte",this.files).
    subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
          {
           // console.log({files : data});
          }
      }
    })
  }
}

const actesAdministration: string[] = [
  "Demande de contrat d'engagement (contractualisation)",
  "Demande d'intégration ou de régularisation",
  "Demande de mise en solde",
  "Demande de validation",
  "Demande d'avancement automatique (échelon)",
  "Demande de reclassement",
  "Demande de maintien en activité d'un agent",
  "Demande d'arrêté ou décision de nomination",
  "Demande de traduction au conseil de santé",
  "Demande d'évacuation sanitaire",
  "Demande de grâce",
  "Demande de démission",
  "Demande mise en position de disponibilité",
  "Demande de suspension de contrat ou d'engagement",
  "Demande de détachemnt (fonctionnaire)",
  "Demande d'affectation (décisionnaire)",
  "Demande d'allocation famiale à la caisse de sécurité sociale",
  "Demande de radiation pour décés",
  "Demande de mise en position de stage",
  "Demande de retraite anticipée",
  "Demande d'indemnité compensatrice de congé",
  "Demande de réintégration",
  "Demande d'indemnité compensatrice de surcharge horaire"
];

const actesGestion: string[] = [
  "Certificat ou attestation de prise service",
  "Etat des services effectués",
  "Certificat administratif",
  "Certificat d'exercice ou attestation de service",
  "Certificat de conformité",
  "Demande de congé administratif",
  "Demande de congé de maternité",
  "Demande de congé de maladie",
  "Demande d'autorisation de sortie du territoire national",
  "Demande d'autorisation d'effectuer des heures de vacation",
  "Demande d'autorisation d'effectuer des heures supplémentaires",
  "Convocation des malades au centre médico-social"
];


const stem: string[] = [
  "Demande mise en position de disponibilité",
  "Demande de détachemnt (fonctionnaire)",
  "Demande d'autorisation de sortie du territoire national",
  "Demande de mise en position de stage",
];
