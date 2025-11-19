import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';

import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TagModel } from 'ngx-chips/core/tag-model';
import { FormationService } from 'src/app/services/formation.service';


export interface Formateur {
  matricule: string;
  prenom: string;
  nom: string;
}


@Component({
  selector: 'app-complete-formation',
  templateUrl: './complete-formation.component.html',
  styleUrls: ['./complete-formation.component.css']
})
export class CompleteFormationComponent implements OnInit {

  selectedParticipantAdd: string = '';
  selectedIndex = 0;
  isPublished: boolean = false;
  isRapport: boolean = false;
  isPlanning: boolean = false;
  isConvocation: boolean = false;
  isSession: boolean = false;
  isParticipant: boolean = false;
  isPv: boolean = false;
  comment: string = "";
  commentPlanning: string = "";

  convocationFiles: any[] = [];
  tdrFiles: any[] = [];
  participantsFiles: any[] = [];
  participantsBisFiles: any[] = [];

  pjCandidatsRetenus: any[] = [];
  pjDossierParticipants: any[] = [];
  pjTypeFormationDiplomante: any[] = [];
  pjConvocation: any[] = [];
  pjSession: any[] = [];
  pjPlanningFormation: any[] = [];
  pjRapportFormation: any[] = [];
  pjPVExamen: any[] = [];
  fileListConvocation: any[] = [
    
  ];

  listSession: any[] = [
    
  ];

  ListFiles: any[] = [
    
  ];

  ListFilesSession: any[] = [
    
  ];
 
  
  rapportFiles: any[] = [];
  othersFiles: File[] = [];
  planiForm!: FormGroup;
  rappForm!: FormGroup;

  planificationForm = this._formBuilder.group({});
  convocationForm = this._formBuilder.group({});
  participantForm = this._formBuilder.group({});
  rapportForm = this._formBuilder.group({});

  autocompleteParticipants: string[] = [];
  autocompleteFormateurs: string[] = [];
  selectedParticipants: string[] = [];
  selectedParticipantsIds: number[] = [];
  selectedFormateurs: string[] = [];
  participants: any[] = [];
  participantsData: any[] = [];
  formateurs: Formateur[] = [
    { matricule: 'MAT001', prenom: 'Lamine', nom: 'Dieme' },
    { matricule: 'MAT002', prenom: 'Dieumbe', nom: 'Thiam' },
    { matricule: 'MAT003', prenom: 'Libasse', nom: 'Yade' },
    { matricule: 'MAT004', prenom: 'Aissatou', nom: 'Ndiaye' },
    { matricule: 'MAT005', prenom: 'Ousmane', nom: 'Fall' }
  ];

  FormationId: string="";
  formation: any;
  dateDebut: string="";
      dateFin: string="";
      intitule: string="";
      typeFormation: string="";
      cout: string="";
      description: string="";
      theme: string="";
      duree: string="";
      prestataires: string="";

  stepperOrientation: Observable<StepperOrientation>;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private location: Location,
    breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private formationService: FormationService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  initPlaniForm() {
    this.planiForm = this.fb.group({
      dateDebut: [''],
      dateFin: [''],
      intitule: [''],
      typeFormation: [''],
      cout: [''],
      description: [''],
      prestataires: [''],
    });
  }

  initRapportForm() {
    this.rappForm = this.fb.group({
      commentaire: ['']
    });
  }

  ngOnInit(): void {
    
    this.getConvocation();
    this.initPlaniForm();
    this.initRapportForm();
    this.route.params.subscribe(params => {
      this.FormationId = params['dataId'];
      console.log(this.FormationId);
    });
    
    this.getCentralUsers();
    this.getConvocation();
    this.getParticipant();
    this.getRapport();
    this.getPlanning();
    this.getSession();
    this.getPvExamen();
    //this.autocompleteFormateurs = this.formateurs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
    this.getFormation(this.FormationId);
  }


  readExcel(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Supprime la première ligne (les titres des colonnes)
      if (data.length > 0) {
        data = data.slice(1);
      }

      this.participantsData = data;

      console.log(this.participantsData);
    };
  }


  downloadFile(filename: string): void {
    this.http.get(environment.apiUrl + "files/download?filename=" + filename, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${localStorage.getItem("Token")}`
      },
      responseType: 'blob' // traiter la réponse comme un blob
    }).subscribe(
      (response: Blob) => {
        // Créer une URL pour le contenu blob afin de pouvoir l'ouvrir dans une nouvelle fenêtre ou le télécharger
        const blobUrl = URL.createObjectURL(response);

        // Créer un élément d'ancrage invisible dans le document
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        document.body.appendChild(anchor);

        // Définir l'URL de l'ancrage sur l'URL blob et déclencher un clic
        anchor.href = blobUrl;
        anchor.download = filename; // Nom de fichier par défaut lors du téléchargement
        anchor.click();

        // Supprimer l'ancrage du document
        document.body.removeChild(anchor);

        // Libérer l'URL blob pour libérer la mémoire
        URL.revokeObjectURL(blobUrl);
      },
      (error) => console.log(error)
    );
  }

  getCentralUsers(){
    this.http.get(environment.apiUrl+"utilisateur/central/list", {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);

        this.participants=response.data.content;
        console.log(this.participants);
        this.autocompleteParticipants = this.participants.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
        //this.selectedFormateurs=this.form
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
        //console.log(this.getThemeFormation(response[0].themeFormationId));
        //console.log(this.getThemeFormation(response[0].themeFormationId));
 
      },
      (error) => console.log(error)
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
       this.dateDebut=this.formation.dateDebut;
       this.dateFin=this.formation.dateFin;
       this.cout=this.formation.cout;
       this.description=this.formation.description;
       this.intitule=this.formation.intitule;
       this.typeFormation=this.formation.typeFormation.libelle;
       if(this.formation.typeFormation.libelle==="Continue"){
        this.theme=this.formation.themeFormation.libelle;
       }
       this.duree=this.formation.duree;
       this.prestataires=this.formation.prestataires;
       this.pjTypeFormationDiplomante.push(this.formation.cahierCharge);
       //this.selectedFormateurs=this.form
       console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
       
       this.planiForm.patchValue({
        intitule: this.intitule,
        dateDebut: this.dateDebut,
        dateFin: this.dateFin,
        description: this.description,
        cout: this.cout,
        typeFormation: this.typeFormation,
        prestataires: this.prestataires
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

 getConvocation(){

  this.formationService.getConvocationFormation(this.FormationId).subscribe((response)=>{
    console.log(response);
    console.log(response.success);
    console.log(response.data);
    if(response.success==true){
      this.isConvocation=response.success;
      console.log(this.isConvocation);
      console.log(response.data[0].nom);
      console.log(response.data[0].nom);
      console.log(response.data.tdr);

      // this.participantsFiles.push(response.data.participants);
      // this.tdrFiles.push(response.data.tdr);
      // this.convocationFiles.push(response.data.convocation);
      for(var i=0; i<response.data.length; i++){
        this.fileListConvocation.push({
          fileName: response.data[i].nom,
          fileSize: response.data[i].tdr.fileSize,
          fileNameComplet: response.data[i].tdr.originalName
        });
      }

      console.log(this.fileListConvocation);
      
    }else {

    }
      
  }, 
  (error) => {
    console.log(error);
    console.log(error.status);
    
  }
);

  // this.http.get(environment.apiUrl+"api/convocations/"+this.FormationId, {headers: {
  //   'content-type': 'application/json',
  //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
  // }}).subscribe(
  //   (response:any) => {
  //     console.log(response.success);
  //     console.log(response.data);
  //     if(response.success==true){
  //       this.isConvocation=response.success;
  //       console.log(this.isConvocation);
  //       console.log(response.data[0].nom);
  //       console.log(response.data[0].nom);
  //       console.log(response.data.tdr);

  //       // this.participantsFiles.push(response.data.participants);
  //       // this.tdrFiles.push(response.data.tdr);
  //       // this.convocationFiles.push(response.data.convocation);
  //       for(var i=0; i<response.data.length; i++){
  //         this.fileListConvocation.push({
  //           fileName: response.data[i].nom,
  //           fileSize: response.data[i].tdr.fileSize,
  //           fileNameComplet: response.data[i].tdr.originalName
  //         });
  //       }

  //       console.log(this.fileListConvocation);
        
  //     }else {

  //     }
  //   },
  //   (error) => {
  //     console.log(error);
  //     console.log(error.status);
      
  //   }
  // )
 }

 getSession(){

  this.formationService.getSessionByFormation(this.FormationId).subscribe((response)=>{
    console.log(response.success);
      console.log(response.data);
      console.log(response);
      if(response.success==true){
        this.isSession=response.success;
        console.log(this.isSession);
        
        for(var i=0; i<response.data.length; i++){
          this.listSession.push({
            fileName: response.data[i]?.file?.originalName,
            commentaire: response.data[i]?.commentaire,
            dateDebut: response.data[i]?.dateDebut,
            dateFin: response.data[i]?.dateFin,
            generatedName: response.data[i]?.file?.generatedName
          });
        }
        
      }else {

      }
      
  }, 
  (error) => {
    console.log(error);
    console.log(error.status);
    
  }
);
  // this.http.get(environment.apiUrl+"api/sessions/"+this.FormationId, {headers: {
  //   'content-type': 'application/json',
  //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
  // }}).subscribe(
  //   (response:any) => {
  //     console.log(response.success);
  //     console.log(response.data);
  //     console.log(response);
  //     if(response.success==true){
  //       this.isSession=response.success;
  //       console.log(this.isSession);
        
  //       for(var i=0; i<response.data.length; i++){
  //         this.listSession.push({
  //           fileName: response.data[i]?.file?.originalName,
  //           commentaire: response.data[i]?.commentaire,
  //           dateDebut: response.data[i]?.dateDebut,
  //           dateFin: response.data[i]?.dateFin,
  //           generatedName: response.data[i]?.file?.generatedName
  //         });
  //       }
        
  //     }else {

  //     }
  //   },
  //   (error) => {
  //     console.log(error);
  //     console.log(error.status);
  //   }
  // )
 }

 getPvExamen(){
  
  this.formationService.getPvExamenByFormation(this.FormationId).subscribe((response)=>{
    console.log(response.success);
    console.log(response.success);
      console.log(response.data);
      console.log(response);
      if(response.success==true){
        this.isPv=response.success;
        this.pjPVExamen=response.data;
        
        
      }else {

      }
      
  }, 
  (error) => {
    console.log(error);
    console.log(error.status);
    
  }
);

  // this.http.get(environment.apiUrl+"api/pvexamens/"+this.FormationId, {headers: {
  //   'content-type': 'application/json',
  //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
  // }}).subscribe(
  //   (response:any) => {
  //     console.log(response.success);
  //     console.log(response.data);
  //     console.log(response);
  //     if(response.success==true){
  //       this.isPv=response.success;
  //       this.pjPVExamen=response.data;
        
        
  //     }else {

  //     }
  //   },
  //   (error) => {
  //     console.log(error);
  //     console.log(error.status);
  //   }
  //)
 }

 getParticipant(){

  this.formationService.getParticipantByFormation(this.FormationId).subscribe((response:any)=>{
    console.log(response);
      console.log(response.fileParticipant);
      this.participantsBisFiles.push(response.fileParticipant);
      if(response.fileParticipant){
        this.isParticipant=true;
      }
      
  }, 
  (error) => {
    console.log(error);
    console.log(error.status);
    
  }
);

  // this.http.get(environment.apiUrl+"api/participants/formation/"+this.FormationId, {headers: {
  //   'content-type': 'application/json',
  //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
  // }}).subscribe(
  //   (response:any) => {
  //     console.log(response);
  //     console.log(response.fileParticipant);
  //     this.participantsBisFiles.push(response.fileParticipant);
  //     if(response.fileParticipant){
  //       this.isParticipant=true;
  //     }
  //   },
  //   (error) => {
  //     console.log(error);
  //     console.log(error.status);
      
  //   }
  // )
 }


 getPlanning(){

  this.formationService.getPlanningByFormation(this.FormationId).subscribe((response:any)=>{
    console.log(response);
      console.log(response[0].commentaire);
      if(response[0].files || (response[0].commentaire!=null)){
        this.isPlanning=true;
      }
      //console.log(response.data);
      this.commentPlanning=response[0].commentaire;
      this.pjPlanningFormation=response[0].files;
      
  }, 
  (error) => {
    console.log(error);
    console.log(error.status);
    if(error.status=404){
      console.log("wooooooy 404");
      this.isPlanning=false;
    }
  }
);

  // this.http.get(environment.apiUrl+"api/planningformation/by-formation/"+this.FormationId, {headers: {
  //   'content-type': 'application/json',
  //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
  // }}).subscribe(
  //   (response:any) => {
  //     console.log(response);
  //     console.log(response[0].commentaire);
  //     if(response[0].files || (response[0].commentaire!=null)){
  //       this.isPlanning=true;
  //     }
  //     //console.log(response.data);
  //     this.commentPlanning=response[0].commentaire;
  //     this.pjPlanningFormation=response[0].files;
  //   },
  //   (error) => {
  //     console.log(error);
  //     console.log(error.status);
  //     if(error.status=404){
  //       console.log("wooooooy 404");
  //       this.isPlanning=false;
  //     }
  //   }
  // )
 }

 getRapport(){
  
  this.formationService.getRapportByFormation(this.FormationId).subscribe((response:any)=>{
    console.log(response);
      //console.log(response.status);
      if(response.files){
        this.isRapport=true;
      }
      //console.log(response.data);
      this.comment=response.commentaire;
      this.rapportFiles=response.files;
      
  }, 
  (error) => {
    console.log(error);
    console.log(error.status);
    if(error.status=404){
      console.log("wooooooy 404");
      this.isRapport=false;
    }
  }
);

  // this.http.get(environment.apiUrl+"api/rapports/by-formation/"+this.FormationId, {headers: {
  //   'content-type': 'application/json',
  //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
  // }}).subscribe(
  //   (response:any) => {
  //     console.log(response);
  //     //console.log(response.status);
  //     if(response.files){
  //       this.isRapport=true;
  //     }
  //     //console.log(response.data);
  //     this.comment=response.commentaire;
  //     this.rapportFiles=response.files;
  //   },
  //   (error) => {
  //     console.log(error);
  //     console.log(error.status);
  //     if(error.status=404){
  //       console.log("wooooooy 404");
  //       this.isRapport=false;
  //     }
  //   }
  // )
 }

 

 addConvocation(){

  if(this.isConvocation){
    this.stepper.next();
  }else{

  // let formParams = new FormData();

  //         const randomNumber = Math.floor(Math.random() * 90000) + 10000;

  //         const httpOptions = {
  //           headers: new HttpHeaders({
  //               'Authorization': `Bearer ${localStorage.getItem("Token")}`
  //           })
  //       };

  //       //formParams.append("participants", this.participantsFiles[0]);
        
  //       //formParams.append("convocation", this.convocationFiles[0]);
  //       formParams.append("formationId", this.FormationId)

  //         for (let i = 0; i < this.ListFiles.length; i++) {

  //           formParams.append("tdr", this.ListFiles[i]);
            
  //          // Effectuez la requête HTTP
  //         this.http.post(environment.apiUrl + "api/convocations/add", formParams, httpOptions)
  //         .subscribe(
  //             (response: any) => {

  //                 console.log(response);
  //                 //this.stepper.next();
                 
  //             },
  //             (error) => {
  //                // console.log(error);
  //                // console.log(error["error"]["errors"]);
  //                 Swal.fire({
  //                     title: error["error"]["errors"],
  //                     icon: 'warning',
  //                     showCancelButton: true,
  //                     confirmButtonColor: 'rgba(29, 74, 123, 1)',
  //                     cancelButtonColor: '#FF4D4F',
  //                     confirmButtonText: 'Oui',
  //                     cancelButtonText: 'Non'
  //                 }).then((result) => {
  //                     if (result.isConfirmed) {



  //                     }
  //                 })
  //             }
  //         );

  //         }

            const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem("Token")}`
            })
        };

  let requests = [];

for (let i = 0; i < this.ListFiles.length; i++) {
    let formParams = new FormData();
    formParams.append("formationId", this.FormationId);
    formParams.append("tdr", this.ListFiles[i]);
    formParams.append("nom", this.fileListConvocation[i].fileName);
    // Stockez chaque observable dans le tableau
    requests.push(this.http.post(environment.apiUrl + "api/convocations/add", formParams, httpOptions));
}

// Utilisez forkJoin pour attendre que toutes les requêtes se terminent
forkJoin(requests).subscribe(
    (responses: any[]) => {
        console.log("Toutes les convocations ont été enregistrées :", responses);
        // Passez à l'étape suivante après l'enregistrement de toutes les convocations
        this.stepper.next();
    },
    (error) => {
        // Gérer les erreurs
        console.error("Erreur lors de l'enregistrement des convocations :", error);
        Swal.fire({
            title: error["error"]["errors"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgba(29, 74, 123, 1)',
            cancelButtonColor: '#FF4D4F',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non'
        }).then((result) => {
            if (result.isConfirmed) {
                // Réagir à la confirmation
            }
        });
    }
);
      
                }
}


addSession(){

  if(this.isSession && this.isPv){
    Swal.fire({
      icon: 'success',
      html: 'La formation a été complétée avec succès.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.location.back();
    });
  }else{

           if(this.isPv==false){
            this.addPv();
           }

            if(this.isSession==false){

              const httpOptions = {
                headers: new HttpHeaders({
                    'Authorization': `Bearer ${localStorage.getItem("Token")}`
                })
            };
    
      let requests = [];
    
    for (let i = 0; i < this.ListFilesSession.length; i++) {
        console.log(this.listSession[i].dateFin);
        let formParams = new FormData();
        formParams.append("formationId", this.FormationId);
        formParams.append("commentaire", this.listSession[i].commentaire);
        formParams.append("dateFin", new Date(this.listSession[i].dateFin).toString());
        formParams.append("dateDebut", new Date(this.listSession[i].dateDebut).toString());
        formParams.append("file", this.ListFilesSession[i]);
        // Stockez chaque observable dans le tableau
        requests.push(this.http.post(environment.apiUrl + "api/sessions/add", formParams, httpOptions));
    }
    
    // Utilisez forkJoin pour attendre que toutes les requêtes se terminent
    forkJoin(requests).subscribe(
        (responses: any[]) => {
            console.log("Toutes les sessions ont été enregistrées :", responses);
            // Passez à l'étape suivante après l'enregistrement de toutes les convocations
            Swal.fire({
              icon: 'success',
              html: 'La formation a été complétée avec succès.',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.location.back();
            });
        },
        (error) => {
            // Gérer les erreurs
            console.error("Erreur lors de l'enregistrement des sessions :", error);
            Swal.fire({
                title: error["error"]["errors"],
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgba(29, 74, 123, 1)',
                cancelButtonColor: '#FF4D4F',
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Réagir à la confirmation
                }
            });
        }
    );

            }
        

         

          

        

                }
}


updateSelectedParticipants(selectedFormateurs: any[]) {
  this.selectedFormateurs = selectedFormateurs;

  // Réinitialiser la liste des IDs des formateurs sélectionnés
  this.selectedParticipantsIds = [];

  selectedFormateurs.forEach(nomFormateur => {
    // Trouver l'objet formateur correspondant dans votre liste de formateurs
    const formateur = this.participants.find(f => `${f.matricule} ${f.prenom} ${f.nom}` === nomFormateur.value);
    // Si le formateur est trouvé, ajouter son ID à la variable selectedFormateursIds
    if (formateur) {
      this.selectedParticipantsIds.push(formateur.id); // Convertir l'ID en nombre entier
    }
  });
}

addRapport(){
  console.log(this.isRapport);

  if(this.planiForm.get('typeFormation')?.value === 'Diplômante'){
   this.addSession();
  }else{


    let formParams = new FormData();

  const randomNumber = Math.floor(Math.random() * 90000) + 10000;

  console.log(this.rapportFiles);
  
  for (let i = 0; i < this.rapportFiles.length; i++) {
      formParams.append('pieces', this.rapportFiles[i]);
  }

  for (let i = 0; i < this.pjPVExamen.length; i++) {
    formParams.append('pv', this.pjPVExamen[i]);
  }

  var commentElement = document.getElementById("comment") as HTMLInputElement | null;

  const rapportDTO = {
      formation: {"id":this.FormationId},
      commentaire: commentElement?.value
  };

  const planFormationDTOString = JSON.stringify(rapportDTO);

  formParams.append('rapportDTO', planFormationDTOString);

  // Définissez les en-têtes de la requête
  const httpOptions = {
      headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
      })
  };

  if(this.isRapport){
    Swal.fire({
      icon: 'success',
      html: 'La formation a été complétée avec succès.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.location.back();
    })
  }else{

  // Effectuez la requête HTTP
  this.http.post(environment.apiUrl + "api/rapports/add", formParams, httpOptions)
      .subscribe(
          (response: any) => {
             // console.log(response.success);
              //console.log(response);
             // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
             Swal.fire({
              icon: 'success',
              html: 'La formation a été complétée avec succès.',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.location.back();
            })
          },
          (error) => {
             // console.log(error);
             // console.log(error["error"]["errors"]);
              Swal.fire({
                  title: error["error"]["errors"],
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: 'rgba(29, 74, 123, 1)',
                  cancelButtonColor: '#FF4D4F',
                  confirmButtonText: 'Oui',
                  cancelButtonText: 'Non'
              }).then((result) => {
                  if (result.isConfirmed) {



                  }
              })
          }
      );
        }
  }
  
}


addPv(){

  let formParams = new FormData();

// Ensuite, vous pouvez utiliser cette liste d'ID dans votre requête HTTP ou pour toute autre action nécessaire

             
        formParams.append("file", this.pjPVExamen[0]);
        formParams.append("formationId", this.FormationId);

       

      //const participantDTOString = JSON.stringify(participantDTO);

      //formParams.append('participantDTO', participantDTOString);

          const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization': `Bearer ${localStorage.getItem("Token")}`
              })
          };

          // Effectuez la requête HTTP
          this.http.post(environment.apiUrl + "api/pvexamens/add", formParams, httpOptions)
              .subscribe(
                  (response: any) => {

                      console.log(response);
                      // this.stepper.next();
                      Swal.fire({
                        icon: 'success',
                        html: 'La formation a été complétée avec succès.',
                        showConfirmButton: false,
                        timer: 3000
                      }).then(() => {
                        this.location.back();
                      });
                     
                  },
                  (error) => {
                     // console.log(error);
                     // console.log(error["error"]["errors"]);
                      Swal.fire({
                          title: error["error"]["errors"],
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: 'rgba(29, 74, 123, 1)',
                          cancelButtonColor: '#FF4D4F',
                          confirmButtonText: 'Oui',
                          cancelButtonText: 'Non'
                      }).then((result) => {
                          if (result.isConfirmed) {



                          }
                      })
                  }
              );
}

addParticipant(){
  if(this.isParticipant){
    this.stepper.next();
  }else{

  let formParams = new FormData();

console.log(this.selectedParticipants);
console.log(this.selectedParticipantsIds);

// Ensuite, vous pouvez utiliser cette liste d'ID dans votre requête HTTP ou pour toute autre action nécessaire

          const randomNumber = Math.floor(Math.random() * 90000) + 10000;
             
        formParams.append("file", this.participantsBisFiles[0]);

        const participantDTO = {
          formation: {id: this.FormationId}
      };

      const participantDTOString = JSON.stringify(participantDTO);

      formParams.append('participantDTO', participantDTOString);

          const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization': `Bearer ${localStorage.getItem("Token")}`
              })
          };

          // Effectuez la requête HTTP
          this.http.post(environment.apiUrl + "api/participants/add", formParams, httpOptions)
              .subscribe(
                  (response: any) => {

                      console.log(response);
                      // this.stepper.next();

                      this.http.put(environment.apiUrl + "api/formations/"+this.FormationId+"/update-status?newStatutFormationCode=NONDEMARREER", httpOptions)
              .subscribe(
                  (response: any) => {

                      console.log(response);
                      this.stepper.next();

                      //Ajouter les participants à la table ParticipantDefinitif

                      for(var i =0; i<this.participantsData.length; i++){
                       
                        const httpOptions = {
                          headers: new HttpHeaders({
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("Token")}`
                          })
                        };
                
                        this.http.post(environment.apiUrl + "api/participant-definitif/add",
                
                          {
                            "numeroDemande": this.participantsData[i][0],
                            "nom": this.participantsData[i][3],
                            "matricule": this.participantsData[i][2],
                            "direction": this.participantsData[i][4],
                            "division": this.participantsData[i][5],
                            "formationId": this.FormationId,
                            "assidu": false,
                            "admis": false,
                            "competences": false,
                            "commentaire": ""
                          }
                          , httpOptions)
                          .subscribe(
                            (response: any) => {
                              console.log(response);
                              //console.log(response);
                              // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
                              Swal.fire({ 
                                html: 'Tableau de suivi enregistré',
                                icon: 'success',
                                timer: 1500,
                                showCancelButton: false,
                                showConfirmButton: false
                              })
                              //this.router.navigate(['formations/plan-formation']);
                            },
                            (error) => {
                              // console.log(error);
                              // console.log(error["error"]["errors"]);
                              Swal.fire({
                                title: error["error"]["errors"],
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: 'rgba(29, 74, 123, 1)',
                                cancelButtonColor: '#FF4D4F',
                                confirmButtonText: 'Oui',
                                cancelButtonText: 'Non'
                              }).then((result) => {
                                if (result.isConfirmed) {
                
                
                                }
                              })
                            }
                          );

                      }
                       


                     
                  },
                  (error) => {
                     // console.log(error);
                     // console.log(error["error"]["errors"]);
                      Swal.fire({
                          title: error["error"]["errors"],
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: 'rgba(29, 74, 123, 1)',
                          cancelButtonColor: '#FF4D4F',
                          confirmButtonText: 'Oui',
                          cancelButtonText: 'Non'
                      }).then((result) => {
                          if (result.isConfirmed) {



                          }
                      })
                  }
              );
                     
                  },
                  (error) => {
                     // console.log(error);
                     // console.log(error["error"]["errors"]);
                      Swal.fire({
                          title: error["error"]["errors"],
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: 'rgba(29, 74, 123, 1)',
                          cancelButtonColor: '#FF4D4F',
                          confirmButtonText: 'Oui',
                          cancelButtonText: 'Non'
                      }).then((result) => {
                          if (result.isConfirmed) {



                          }
                      })
                  }
              );
                }
}

       addPlanning(){
        

        if(this.isPlanning){
          Swal.fire({
            icon: 'success',
            html: 'La formation a été complétée avec succès.',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.stepper.next();
          })
        }else{

          let formParams = new FormData();
      
        console.log(this.pjPlanningFormation);
        
        for (let i = 0; i < this.pjPlanningFormation.length; i++) {
            formParams.append('files', this.pjPlanningFormation[i]);
        }
      
        var commentElement = document.getElementById("commentPlanning") as HTMLInputElement | null;
      
        const rapportDTO = {
            formation: {"id":this.FormationId},
            commentaire: commentElement?.value
        };
      
        const planFormationDTOString = JSON.stringify(rapportDTO);
      
        formParams.append('planningDTO', planFormationDTOString);
      
        // Définissez les en-têtes de la requête
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem("Token")}`
            })
        };

        this.http.post(environment.apiUrl + "api/planningformation/add", formParams, httpOptions)
      .subscribe(
          (response: any) => {
             // console.log(response.success);
              //console.log(response);
             // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
             Swal.fire({
              icon: 'success',
              html: 'La planning a été complétée avec succès.',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.stepper.next();
            })
          },
          (error) => {
             // console.log(error);
             // console.log(error["error"]["errors"]);
              Swal.fire({
                  title: error["error"]["errors"],
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: 'rgba(29, 74, 123, 1)',
                  cancelButtonColor: '#FF4D4F',
                  confirmButtonText: 'Oui',
                  cancelButtonText: 'Non'
              }).then((result) => {
                  if (result.isConfirmed) {



                  }
              })
          }
      );
        }
  
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
    this.readExcel(filesArray[0]);
  }

  onSelectFilesSession(event: { addedFiles: any; }, filesArray: File[]) {
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


  onAddSession() {

    this.ListFilesSession.push(this.pjSession[0]);
   
    this.listSession.push({
      dateDebut: document.querySelector<HTMLInputElement>('#debut-session')?.value,
      dateFin: document.querySelector<HTMLInputElement>('#fin-session')?.value,
      commentaire: document.querySelector<HTMLInputElement>('#comment-rapport-session')?.value,
      fileName: this.pjSession[0].name,
    });

    this.onRemoveFile(this.pjSession[0], this.pjSession);

    const inputElementDebut = document.querySelector<HTMLInputElement>('#debut-session');
    const inputElementFin = document.querySelector<HTMLInputElement>('#fin-session');
    const inputElementComment = document.querySelector<HTMLInputElement>('#comment-rapport-session');

// Vérification si l'élément a été trouvé
if (inputElementDebut) {
    // Effacer le contenu de l'input en définissant sa valeur sur une chaîne vide
    inputElementDebut.value = '';

    // Optionnel : mettre le focus sur l'input après l'effacement
    inputElementDebut.focus();
} else {
    console.error('L\'élément input n\'a pas été trouvé.');
}

// Vérification si l'élément a été trouvé
if (inputElementFin) {
  // Effacer le contenu de l'input en définissant sa valeur sur une chaîne vide
  inputElementFin.value = '';

  // Optionnel : mettre le focus sur l'input après l'effacement
  inputElementFin.focus();
} else {
  console.error('L\'élément input n\'a pas été trouvé.');
}

// Vérification si l'élément a été trouvé
if (inputElementComment) {
  // Effacer le contenu de l'input en définissant sa valeur sur une chaîne vide
  inputElementComment.value = '';

  // Optionnel : mettre le focus sur l'input après l'effacement
  inputElementComment.focus();
} else {
  console.error('L\'élément input n\'a pas été trouvé.');
}
    
     Swal.fire({
      icon: "success",
      html: "Session ajouté avec succès.",
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

  onDeleteSession(index: number) {
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
          this.listSession.splice(index, 1)
        })
      }
    });
  }

}