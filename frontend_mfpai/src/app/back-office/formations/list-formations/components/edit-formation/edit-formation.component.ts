import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';

import { BreakpointObserver } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {FormationService} from "../../../../../services/formation.service";

export interface Participant {
  matricule: string;
  prenom: string;
  nom: string;
}

export interface Formateur {
  matricule: string;
  prenom: string;
  nom: string;
}


@Component({
  selector: 'app-edit-formation',
  templateUrl: './edit-formation.component.html',
  styleUrls: ['./edit-formation.component.css']
})
export class EditFormationComponent implements OnInit {

  selectedParticipantAdd: string = '';
  selectedIndex = 0;
  isPublished: boolean = false;
  commentaire: string="";

  convocationFiles: any[] = [];
  tdrFiles: any[] = [];
  participantsFiles: any[] = [];
  participantsBisFiles: any[] = [];
  rapportFiles: any[] = [];
  othersFiles: any[] = [];
  pjCandidatsRetenus: any[] = [];
  pjConvocation: any[] = [];
  pjDossierParticipants: any[] = [];
  pjTypeFormationDiplomante: any[] = [];
  FormationId: string="";
  formation: any;
  planiForm!: FormGroup;
  dateDebut: string="";
      dateFin: string="";
      intitule: string="";
      typeFormation: string="";
      cout: string="";
      description: string="";
      theme: string="";
      duree: string="";
      prestataires: string="";

  planificationForm = this._formBuilder.group({});
  convocationForm = this._formBuilder.group({});
  participantForm = this._formBuilder.group({});
  rapportForm = this._formBuilder.group({});

  fileListConvocation: any[] = [
    
  ];

  ListFiles: any[] = [
    
  ];

  autocompleteParticipants: string[] = [];
  autocompleteFormateurs: string[] = [];
  selectedParticipants: string[] = [];
  selectedFormateurs: string[] = [];
  participants: Participant[] = [
    { matricule: 'MAT001', prenom: 'Lamine', nom: 'Dieme' },
    { matricule: 'MAT002', prenom: 'Dieumbe', nom: 'Thiam' },
    { matricule: 'MAT003', prenom: 'Libasse', nom: 'Yade' },
    { matricule: 'MAT004', prenom: 'Aissatou', nom: 'Ndiaye' },
    { matricule: 'MAT005', prenom: 'Ousmane', nom: 'Fall' }
  ];
  formateurs: Formateur[] = [
    { matricule: 'MAT001', prenom: 'Lamine', nom: 'Dieme' },
    { matricule: 'MAT002', prenom: 'Dieumbe', nom: 'Thiam' },
    { matricule: 'MAT003', prenom: 'Libasse', nom: 'Yade' },
    { matricule: 'MAT004', prenom: 'Aissatou', nom: 'Ndiaye' },
    { matricule: 'MAT005', prenom: 'Ousmane', nom: 'Fall' }
  ];

  stepperOrientation: Observable<StepperOrientation>;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private location: Location,
    breakpointObserver: BreakpointObserver,
    private formationService: FormationService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.initPlaniForm();
    this.route.params.subscribe(params => {
      this.FormationId = params['dataId'];
      console.log(this.FormationId);
    });
   // this.getFormation(this.FormationId);
    this.getFormation(this.FormationId);
    this.getConvocation();
    this.getParticipant();
    this.getRapport();
    this.autocompleteParticipants = this.participants.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
    this.autocompleteFormateurs = this.formateurs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
  }

  

  initPlaniForm() {
    this.planiForm = this.fb.group({
      dateDebut: [''],
      dateFin: [''],
      intitule: [''],
      typeFormation: [''],
      cout: [''],
      description: [''],
      prestataires: ['']
    });
  }

  getRapport(){
    this.http.get(environment.apiUrl+"api/rapports/by-formation/"+this.FormationId, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        //console.log(response.data);
        this.commentaire=response.commentaire;
        this.rapportFiles=response.files;
      },
      (error) => {
        console.log(error);
        console.log(error.status);
      }
    )
   }

  getConvocation(){

    this.http.get(environment.apiUrl+"api/convocations/"+this.FormationId, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response.success);
        console.log(response.data);
        if(response.success==true){
          
          this.fileListConvocation = response.data;
          
        }else {
  
        }
      },
      (error) => {
        console.log(error);
        console.log(error.status);
        
      }
    )
   }

  getParticipant(){

    this.http.get(environment.apiUrl+"api/participants/formation/"+this.FormationId, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        console.log(response.fileParticipant);
        this.participantsBisFiles.push(response.fileParticipant);
        if(response.fileParticipant){
          //this.isParticipant=true;
        }
      },
      (error) => {
        console.log(error);
        console.log(error.status);
        
      }
    )
   }



  getFormation(id:string){
    this.http.get(environment.apiUrl+"api/formations/"+id, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        
        this.formation=response;
        console.log(this.formation.prestataires);
        this.dateDebut=this.formation.dateDebut;
        this.dateFin=this.formation.dateFin;
        this.cout=this.formation.cout;
        this.description=this.formation.description;
        this.prestataires=this.formation.prestataires;        ;
        this.intitule=this.formation.intitule;
        this.typeFormation=this.formation.typeFormation.libelle;
        this.theme=this.formation.themeFormation.libelle;
        this.duree=this.formation.duree;
        this.pjTypeFormationDiplomante.push(this.formation.cahierCharge);
        //this.selectedFormateurs=this.form
      //  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
        
        this.planiForm.patchValue({
         intitule: this.intitule,
         dateDebut: this.dateDebut,
         dateFin: this.dateFin,
         description: this.description,
         prestataires: this.prestataires,
         cout: this.cout,
         typeFormation: this.typeFormation
       });
 
        //console.log(this.getThemeFormation(response[0].themeFormationId));
        //console.log(this.getThemeFormation(response[0].themeFormationId));
 
        for(var i=0; i<=this.formation.formateurs.length; i++){
         this.selectedFormateurs.push(this.formation.formateurs[i].matricule + " "+ this.formation.formateurs[i].prenom + " "+ this.formation.formateurs[i].nom)
        }
 
      },
      (error) => console.log(error)
    )
  }

  onSaveFormation() {
    Swal.fire({
      icon: 'success',
      html: 'La formation a été modifiée avec succès.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.location.back();
    })
  }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  onReset() {
    this.location.back();
  }

    onDisciplineChange(value: string) {
    this.selectedParticipantAdd = value;
   }

   onAddFile() {

    this.ListFiles.push(this.pjConvocation[0]);
   
    this.fileListConvocation.push({
      fileName: document.querySelector<HTMLInputElement>('#nom-fichier')?.value,
      fileSize: 32,
      fileNameComplet: this.pjConvocation[0].name,
    });

    this.onRemoveFile(this.pjConvocation[0], this.pjConvocation);

    const inputElement = document.querySelector<HTMLInputElement>('#nom-fichier');

// Vérification si l'élément a été trouvé
if (inputElement) {
    // Effacer le contenu de l'input en définissant sa valeur sur une chaîne vide
    inputElement.value = '';

    // Optionnel : mettre le focus sur l'input après l'effacement
    inputElement.focus();
} else {
    console.error('L\'élément input n\'a pas été trouvé.');
}
    
     Swal.fire({
      icon: "success",
      html: "Document ajouté avec succès.",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  onDeleteFile(index: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous supprimer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Retiré',
          html: ' élément retiré ',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        }).then(() => {
          this.fileListConvocation.splice(index, 1)
        })
      }
    });
  }

  addConvocation(){
   this.stepper.next();
  }

}