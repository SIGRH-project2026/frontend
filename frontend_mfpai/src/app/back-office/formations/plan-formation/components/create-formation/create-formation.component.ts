import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';

import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReferencesService } from 'src/app/services/references.service';

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
  selector: 'app-create-formation',
  templateUrl: './create-formation.component.html',
  styleUrls: ['./create-formation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateFormationComponent implements OnInit {

  selectedParticipantAdd: string = '';

  selectedIndex = 0;
  isPublished: boolean = false;
  @Input() typeForm: "CreatedFormation" | "CompletedFormation" | "CreatedFormationDiplomante"= "CreatedFormation";

  convocationFiles: File[] = [];
  tdrFiles: File[] = [];
  participantsFiles: File[] = [];
  participantsBisFiles: File[] = [];
  rapportFiles: File[] = [];
  othersFiles: File[] = [];

  //allFormateurs: any[] = [];
  debut: string="";
  fin: string="";
  reception: string="";

  planificationForm!: FormGroup;
  convocationForm!: FormGroup;
  participantForm!: FormGroup;
  rapportForm!: FormGroup;

  specialite: any;
  etablissements: any;
  

  autocompleteParticipants: string[] = [];
  autocompleteFormateurs: string[] = [];
  selectedParticipants: string[] = [];
  selectedFormateurs: string[] = [];
  selectedFormateursIds: number[] = [];
  themeId: string = "";
  themeLibelle: string | null = "";
  participants: Participant[] = [
    { matricule: 'MAT001', prenom: 'Lamine', nom: 'Dieme' },
    { matricule: 'MAT002', prenom: 'Dieumbe', nom: 'Thiam' },
    { matricule: 'MAT003', prenom: 'Libasse', nom: 'Yade' },
    { matricule: 'MAT004', prenom: 'Aissatou', nom: 'Ndiaye' },
    { matricule: 'MAT005', prenom: 'Ousmane', nom: 'Fall' }
  ];
  // formateurs: Formateur[] = [
  //   { matricule: 'MAT001', prenom: 'Lamine', nom: 'Dieme' },
  //   { matricule: 'MAT002', prenom: 'Dieumbe', nom: 'Thiam' },
  //   { matricule: 'MAT003', prenom: 'Libasse', nom: 'Yade' },
  //   { matricule: 'MAT004', prenom: 'Aissatou', nom: 'Ndiaye' },
  //   { matricule: 'MAT005', prenom: 'Ousmane', nom: 'Fall' }
  // ];

  piecesJointesFiles: File[] = [];

  stepperOrientation: Observable<StepperOrientation>;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private location: Location,
    breakpointObserver: BreakpointObserver,
    private referenceService: ReferencesService,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    //this.getFormateurs();
    this.referenceService.listEtablissementByTypeETA("EFF").subscribe(response => {
      console.log(response);
      if(response.success)
        this.etablissements = response.data;
    });

    this.themeLibelle=localStorage.getItem("themeLibelle");

    this.planificationForm = this._formBuilder.group({
      typeFormation: [{ value: '', disabled: true }, Validators.required],
      intitule: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateReception: ['', Validators.required],
      dateFin: ['', Validators.required],
      cout: ['', Validators.required],
      nbrplaces: [''],
      description: ['', Validators.required],
      prestataires: ['', Validators.required],
      specialite: [''],
      etablissement: [''],
    });
    
    // Gere l'affichage du formulaire
    if (this.typeForm === "CreatedFormationDiplomante") {
      this.planificationForm.get('typeFormation')?.setValue("Diplômante");
      //this.themeLibelle="";
    } else {
      this.planificationForm.get('typeFormation')?.setValue("Continue");
    }

    this.route.params.subscribe(params => {
      this.themeId = params['themeId'];
      console.log(this.themeId);
    });

    this.autocompleteParticipants = this.participants.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
    //this.autocompleteFormateurs = this.allFormateurs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);

    // Get action Create or Completed
    const getTypeForm = sessionStorage.getItem("actionClick");
    console.log(getTypeForm);
    if (getTypeForm === "CreatedFormation") {
      this.isPublished = true;
    } else {
      this.isPublished = false;
      // this.selectedIndex = 1;
    }

  }

  getListSpecialite(eff: any): void {
    // console.log(direction)
     this.http.get(environment.apiUrl+"static/eef/speciality/list/"+eff, {headers: {
         'content-type': 'application/json',
         'Authorization': `Bearer ${localStorage.getItem("Token")}`
       }}).subscribe(
         (response:any) => {
           //console.log(response);
          // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
 
           this.specialite=response.data;
 
         },
         (error) => console.log(error)
     );
 
   }

  getListEtab(specialite: any): void {
    // console.log(direction)
     this.http.get(environment.apiUrl+"static/eef/list/"+specialite, {headers: {
         'content-type': 'application/json',
         'Authorization': `Bearer ${localStorage.getItem("Token")}`
       }}).subscribe(
         (response:any) => {
           //console.log(response);
          // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
 
           this.etablissements=response.data;
 
         },
         (error) => console.log(error)
     );
 
   }

  // getFormateurs(){
  //   this.http.get(environment.apiUrl+"utilisateur/profile/Formateurs", {headers: {
  //     'content-type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem("Token")}`
  //   }}).subscribe(
  //     (response:any) => {
  //       console.log(response);
  //       console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
  //       //this.allFormateurs=response;
  //       //this.autocompleteFormateurs = this.allFormateurs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);

  //       //this.collectionSize = response.data.content.length;

  //       // this.plansFormationsList = response.data.content.map((plan: any, i: number) => ({ id: i + 1, ...plan })).slice(
  //       //   (this.page - 1) * this.pageSize,
  //       //   (this.page - 1) * this.pageSize + this.pageSize,
  //       // );;

  //     },
  //     (error) => console.log(error)
  //   )
  // }
  
  onSaveFormation() {
    Swal.fire({
      icon: 'success',
      html: 'La formation a été enregistrée avec succès.',
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

  onPublish() {

    console.log(this.planificationForm.get('typeFormation')?.value);
    console.log(this.planificationForm.value.etablissement);
    console.log(this.planificationForm.value.nbrplaces.toString());
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
      })
  };

  // Effectuez la requête HTTP
  
    
    Swal.fire({
      title: 'Confirmation',
      text: 'Souhaitez-vous publier cette formation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {

        console.log(this.piecesJointesFiles[0]);
        let formParams = new FormData();

        if(this.piecesJointesFiles.length!=0){
          formParams.append('cahierCharge', this.piecesJointesFiles[0]);
          }
                  
        const formation = {
          "typeFormation": {
            "code": "CONTINUE"
          },
          "themeFormation": {
            "id": parseInt(this.themeId)
          },
          "reference": "REF"+randomNumber,
          "intitule": this.planificationForm.value.intitule,
          "dateDebut": this.planificationForm.value.dateDebut,
          "dateReception": new Date(),
          "dateEnvoi": new Date(),
          "dateFin": this.planificationForm.value.dateFin,
          "duree": this.calculateDuration(this.planificationForm.value.dateDebut, this.planificationForm.value.dateFin),
          "cout": this.planificationForm.value.cout,
          "nbrplaces": null,
          "description": this.planificationForm.value.description,
          "statutFormation": {
            "code": "PUBLIEER"
          },
          "prestataires": this.planificationForm.value.prestataires,
          "effCode": this.planificationForm.value.etablissement,
          "specialiteCode": this.planificationForm.value.specialite
        };

        const formationDiplomante = {
          "typeFormation": {
            "code": "DIPLOMANTE"
          },
          "reference": "REF"+randomNumber,
          "intitule": this.planificationForm.value.intitule,
          "dateDebut": this.planificationForm.value.dateDebut,
          "dateFin": this.planificationForm.value.dateFin,
          "dateReception": this.planificationForm.value.dateReception,
          "dateEnvoi": new Date(),
          "duree": this.calculateDuration(this.planificationForm.value.dateDebut, this.planificationForm.value.dateFin),
          "cout": this.planificationForm.value.cout,
          "nombrePlace": this.planificationForm.value.nbrplaces.toString(),
          "description": this.planificationForm.value.description,
          "statutFormation": {
            "code": "PUBLIEER"
          },
          "prestataires": this.planificationForm.value.prestataires,
          "effCode": this.planificationForm.value.etablissement,
          "specialiteCode": this.planificationForm.value.specialite
        };

      const formationDTOString = JSON.stringify(formation);
      const formationDiplomanteDTOString = JSON.stringify(formationDiplomante);

       if(this.planificationForm.get('typeFormation')?.value === 'Continue'){
        formParams.append('formation', formationDTOString);
       }else{
        formParams.append('formation', formationDiplomanteDTOString);
       }
      

        this.http.post(environment.apiUrl + "api/formations/add", formParams, httpOptions)
      .subscribe(
          (response: any) => {
             console.log(response);
              //console.log(response);
             // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
             Swal.fire({
              html: 'La formation '+'<b>N° REF'+'randomNumber</b>' +'a été publiée.',
              icon: 'success',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            }).then(() => {
              this.location.back();
            })
              // this.router.navigate(['formations/plan-formation']);
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
    });
  }


  calculateDuration(startDate: string, endDate: string): string {
    // Calculer la différence entre les dates en millisecondes
    const difference = new Date(endDate).getTime() - new Date(startDate).getTime();
    
    // Convertir la différence en jours
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    // Calculer les années, mois et jours
    const years = Math.floor(daysDifference / 365);
    const months = Math.floor((daysDifference % 365) / 30);
    const days = daysDifference % 30;
    
    // Construire la chaîne de durée
    let duration = '';
    if (years > 0) {
      duration += years + ' an';
      if (years > 1) duration += 's';
      duration += ' ';
    }
    if (months > 0) {
      duration += months + ' mois ';
    }
    if (days > 0) {
      duration += days + ' jour';
      if (days > 1) duration += 's';
    }
    
    return duration.trim();
  }

// updateSelectedFormateurs(selectedForma: any[]) {
//   this.selectedFormateurs = selectedForma;

//   // Réinitialiser la liste des IDs des formateurs sélectionnés
//   this.selectedFormateursIds = [];

//   selectedForma.forEach(nomFormateur => {
//     // Trouver l'objet formateur correspondant dans votre liste de formateurs
//     const formateur = this.allFormateurs.find(f => `${f.matricule} ${f.prenom} ${f.nom}` === nomFormateur.value);
//     // Si le formateur est trouvé, ajouter son ID à la variable selectedFormateursIds
//     if (formateur) {
//       this.selectedFormateursIds.push(formateur.id); // Convertir l'ID en nombre entier
//     }
//   });
// }


  onReset() {
    this.location.back();
  }

   onDisciplineChange(value: string) {
    this.selectedParticipantAdd = value;
   }

  public onSelectedTabChange(tabIndex: number) {
    this.selectedIndex = tabIndex;
    this.stepper.selectedIndex = tabIndex;
    console.log(tabIndex);
  }
  
}
