import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationChangeEvent } from '@angular/common';
import { ActeService } from 'src/app/services/acteService.service';
import { FileService } from 'src/app/shared/services/files/file.service';
import Swal from 'sweetalert2';
import { ActeDTO } from '../models/ActeDTO';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { environment } from 'src/environments/environment';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileDTO } from '../models/FileDTO';
import { CredentialsService } from 'src/app/services/credentials.service';
import { TypeAGDTO } from '../models/TypeAGDTO ';
import { TypeAADTO } from '../models/TypeAADTO ';
import { TypeActeDTO } from '../models/TypeActeDTO';


@Component({
  selector: 'app-edit-acte',
  templateUrl: './edit-acte.component.html',
  styleUrls: ['./edit-acte.component.css']
})
export class EditActeComponent implements OnInit{

  actId: any;
  idNumber!:number;
  editActeForm!:FormGroup;
  acte : ActeDTO = new ActeDTO();
  agent!:UserDTOs;
  fileUrl = environment.apiUrl + "file/download"
  //actes: string[] = [];
  typeSelectionne:string="";
  typeActeSelected : string="";
  piecesJointesFiles: File[] = [];
  userInfos: any;
  userId:any;
  actes: TypeAADTO[] | TypeAGDTO[] = [];  
  acteAA:TypeAADTO[]=[];
  acteAG:TypeAGDTO[]=[];
  typeActes: TypeActeDTO[] = [];


  constructor(
    private router: Router,
    private location: Location,
    private readonly activatedRoute: ActivatedRoute,
    private readonly acteService: ActeService,
    private readonly _fb : FormBuilder,
    private readonly fileService:FileService,
    private readonly credentialService: CredentialsService,

    ) { 
      this.actId = this.activatedRoute.snapshot.paramMap.get('dataId')
      this.userInfos = this.credentialService.getUserInfos();
      this.userId=this.userInfos.id;
     // console.log({user:this.userId})

    }

  ngOnInit(): void {
    this.getAA();
    this.getAG();
    this.getOneDemande();
    this.initForm();
    this.getTypeActes();
  }

  getTypeActes(): void {
    this.acteService.listTypeActe().subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes('OK')) {
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
                console.log({AA: this.acteAA});
            }
        }
    });
}

getAG() {
    this.acteService.listAG().subscribe({
        next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
                this.acteAG = data.payload;
                console.log({AG: this.acteAG});
            }
        }
    });
}

onchangeActe(event: any) {
  this.typeSelectionne = event.target.value;
  if (this.typeSelectionne.toLowerCase() === "aa") { 
      this.actes = this.acteAA;     
  } else if (this.typeSelectionne.toLowerCase() === "ag") {
      this.actes = this.acteAG;
  } else {
      this.actes = [];
  }
}
  
  getOneDemande(){
    this.acteService.getActe(this.actId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.acte = data.payload;
              this.typeSelectionne = this.acte.typeActe.codeActe
              if (this.typeSelectionne == "aa") {
                this.actes = this.acteAA;
                this.typeActeSelected = this.acte.typeAA.libelle
            } else {
                this.actes = this.acteAG;
                this.typeActeSelected = this.acte.typeAG.libelle
            }
              //console.log({acte:this.acte});
              console.log({acte:this.acte});
              this.loadInitialFiles();

            }
          }
        });
}

editActe(){
  let acte:ActeDTO;
 
}

loadInitialFiles(): void {
  // Conversion de FileDTO en File
  console.log("Conversion"+this.acte.pieceJointes.length)
  this.files = this.acte.pieceJointes.map(pj => {
      const file = new File([pj.generatedName], pj.originalName, { type: pj.fileType });
      console.log({11:file})
      return file;
  });

  // Patch des fichiers dans le formulaire
  this.editActeForm.patchValue({
      file: this.files
  });
}

onSelect(event: { addedFiles: any[] }): void {
  // Ajout des nouveaux fichiers
  this.files.push(...event.addedFiles);
  this.editActeForm.patchValue({
      file: this.files
  });
}

onRemove(event: File): void {
  // Suppression du fichier sélectionné
  this.files = this.files.filter(f => f !== event);
  this.editActeForm.patchValue({
      file: this.files
  });
}
 

initForm(): void {
  this.editActeForm = this._fb.group({
    commentaire: [''],
    acte:['', Validators.required],
    typeActe: ['', Validators.required],
    file: [this.files, Validators.required]  // Synchronisation avec this.files

  });
}

get f(): { [p: string]: AbstractControl } {
  return this.editActeForm!.controls;
}


checkConstraintsValidation(): void {
  Object.keys(this.f).forEach(field => {
    const control = this.editActeForm!.get(field);
    control!.markAsTouched({onlySelf: true});
  });
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






telecharger(item:string){
  console.log(item);
  this.fileService.telecharger(item)
}

files: File[] = [];

onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
  filesArray.push(...event.addedFiles);
}

onRemoveFile(event: File, filesArray: File[]) {
  filesArray.splice(filesArray.indexOf(event), 1);
}


  /* onSelect(event: { addedFiles: any; }) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }


  onRemove(event: any) {
    console.log(event);
    this.files.splice(event);
  }
 */
  onSaveDemande() {
    let demandeActe : ActeDTO = new ActeDTO();
    demandeActe.idAgent=this.userId;
    demandeActe.id=this.actId;
    demandeActe.codetypeActe=this.editActeForm.value.acte.toLowerCase();
    if( this.typeSelectionne=="aa"){
      demandeActe.codeTypeActeAA=this.editActeForm.value.typeActe;
    }
    if( this.typeSelectionne=="ag"){
      demandeActe.codeTypeActeAG=this.editActeForm.value.typeActe;
    }
    demandeActe.commentaire=this.editActeForm.value.commentaire;
    
    console.log({demande:demandeActe});
    this.acteService.editActe(this.actId,demandeActe)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK")){
          this.acte = data.payload;
          console.log({acte:this.acte});
          this.storeFile(this.actId);
          Swal.fire({
            icon: 'success',
            html: 'La demande  <strong> '+this.acte.referenceActe +'</strong> a été modifiée avec succès.',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['carrieres/mes-demandes']);
          })
        }
      }
    });
   
  }

  onReset() {
    this.router.navigate(['carrieres/mes-demandes']);
  }


  goBack() {
    this.location.back()
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
