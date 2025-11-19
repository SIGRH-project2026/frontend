import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReferencesService } from 'src/app/services/references.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-theme-formation',
  templateUrl: './create-theme-formation.component.html',
  styleUrls: ['./create-theme-formation.component.css']
})
export class CreateThemeFormationComponent implements OnInit {
  ciblesListLavel: any[] = [];
  themeFormationForm!: FormGroup;
  ciblesList: any[] = [];
  planFormation: any[] = [];
  titre ="";
  dateDebut="";
  dateFin="";
  statut="";
  direction: any;
  fonction: any;
  users: any;
  autocompleteFormateurs: string[] = [];
  autocompleteProfils: string[] = [];
  selectedFormateurs: string[] = [];
  selectedFormateursIds: number[] = [];

  constructor(
      private router: Router,
      private fb: FormBuilder,
      private http: HttpClient,
      private location: Location,
      private referenceService: ReferencesService,
  ) { }


  ngOnInit(): void {

    this.referenceService.listDirections().subscribe(response => {
      if(response.success)
        this.direction = response.data;
    });

    this.referenceService.listFonction().subscribe(response => {
      if(response.success)
        this.fonction = response.data;
        //console.log(this.fonction);
        this.autocompleteFormateurs = this.fonction.map((f: { label: any; }) => `${f.label}`);

    });

    //console.log(this.fonction);

    this.http.get(environment.apiUrl+"plan-formation/"+localStorage.getItem("idPlan"), {headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("Token")}`
      }}).subscribe(
        (response:any) => {
        /*  console.log(response);
          console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

         */
          this.planFormation= response["data"];

     //     console.log(this.planFormation);
          this.titre = response["data"]["titre"];
          this.dateDebut=response["data"]["dateDebut"];
          this.dateFin=response["data"]["dateFin"];
          this.statut=response["data"]["statutPlanFormation"]["libelle"];

       //   console.log(response["data"]["files"]);

        },
        (error) => console.log(error)
    )

    this.initForm();
  }

  updateSelectedFormateurs(selectedForma: any[]) {

    this.selectedFormateurs = selectedForma;

    this.selectedFormateursIds = [];

  selectedForma.forEach(nomFormateur => {
    // Trouver l'objet formateur correspondant dans votre liste de formateurs
    const formateur = this.fonction.find((f: { label: any; }) => `${f.label}` === nomFormateur.value);
    // Si le formateur est trouvé, ajouter son ID à la variable selectedFormateursIds
    if (formateur) {
      this.selectedFormateursIds.push(formateur.id); // Convertir l'ID en nombre entier
    }
  });
  
  }


  getListUser(direction: any): void {
   // console.log(direction)
    this.http.get(environment.apiUrl+"utilisateur/by-direction/"+direction, {headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("Token")}`
      }}).subscribe(
        (response:any) => {
          //console.log(response);
         // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

          this.users=response;

        },
        (error) => console.log(error)
    );

    this.referenceService.listProfils().subscribe(response => {
      if(response.success)
        this.fonction = response.data;
        //console.log(this.fonction);
        this.autocompleteProfils = this.fonction.map((f: { label: any;}) => `${f.label}`);

    });

  }

  getListProfils(direction: any): void {
    
    
 
   }

  getLabelForCible(cibleId: number): string {
    const cible = this.fonction.find((fonc: { id: number; }) => fonc.id === cibleId);
    return cible ? cible.label : '';
  }


  addCible() {
    const formValue = this.themeFormationForm.value;
    const selectedCible = formValue.cibles; // Récupérer la valeur sélectionnée dans la liste déroulante
    if (selectedCible) {
      const cible = this.fonction.find((c: { id: any; }) => c.id === selectedCible); // Trouver l'objet cible correspondant à l'ID sélectionné
      if (cible) {
        this.ciblesList.push(cible); // Ajouter l'objet entier à la liste ciblesList
        console.log(this.ciblesList);
      }
    }
  }


  /*addCible() {
    const formValue = this.themeFormationForm.value;
    const selectedCible = this.fonction.find((fonc: { id: any; }) => fonc.id === formValue.cibles);
    if (selectedCible) {
      this.ciblesList.push(selectedCible);

      console.log(this.ciblesList)
    }
    // Réinitialiser le formulaire après l'ajout
    this.themeFormationForm.get('cibles')?.reset(); // Réinitialise le select
  }*/

  removeCible(index:number){
    this.ciblesList.splice(index, 1)
  }

  initForm() {
    this.themeFormationForm = this.fb.group({
      theme: [null], // Initialisé à null
      budget: [null],
      bailleur: [null],
      operateur: [null],
      modalites: [null],
      duree: [null],
      direction: [0],
      responsable: [0],
      cibles: [null], // Initialisé à un tableau vide
      // add others input
    });
  }

  onReset() {
    this.location.back();
  }

  onSaveThemeFormation() {
    console.log(this.themeFormationForm.value);
    console.log(this.selectedFormateursIds);

    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("Token")}`
      })
    };

    var cibleJson = [];

    for(var i=0; i<this.selectedFormateursIds.length; i++){
      cibleJson.push({
        "id":  this.selectedFormateursIds[i]
      })
    }

    console.log(cibleJson);
    console.log(this.themeFormationForm.value.direction);
    console.log(this.themeFormationForm.value.responsable);
    console.log(localStorage.getItem("idPlan"));

    let formParams = {
      "libelle": this.themeFormationForm.value.theme,
      "duree": this.themeFormationForm.value.duree,
      "modalites": this.themeFormationForm.value.modalites,
      "operateur": this.themeFormationForm.value.modalites,
      "bailleur": this.themeFormationForm.value.bailleur,
      "budget": this.themeFormationForm.value.budget,
      "direction": {
        "code": this.themeFormationForm.value.direction
      },
      "responsableSuiviId":  this.themeFormationForm.value.responsable,
      "planFormationId":  localStorage.getItem("idPlan"),
      "profils": cibleJson
    };

    console.log(formParams);

    this.http.post(environment.apiUrl + "themeformations/add", formParams, httpOptions)
        .subscribe(
            (response: any) => {
              console.log(response.success);
              console.log(response);
              console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
              Swal.fire({
                html: `Theme de formation <b>${this.themeFormationForm.value.theme}<b/> a été créé avec succès.`,
                icon: 'success',
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false
              })
              this.router.navigate(['formations/plan-formation']);
            },
            (error) => console.log(error)
        );

  }
}