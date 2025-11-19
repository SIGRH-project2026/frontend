import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-plan-formation',
  templateUrl: './edit-plan-formation.component.html',
  styleUrls: ['./edit-plan-formation.component.css']
})
export class EditPlanFormationComponent {
 

  loginForm!: FormGroup;
  planFormation: any[] = [];
  titre ="";
  commentaire ="";
  dateDebut="";
  dateFin="";
  statut="";
  files: any[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private fb: FormBuilder,
  ){}

  initLoginForm() {
    this.loginForm = this.fb.group({
      titre: ['', Validators.required],
      dateDebut: [''],
      dateFin: [''],
      commentaire: ['']
    });
  }


  ngOnInit(): void {
    this.initLoginForm();

    console.log(localStorage.getItem("idPlan"));

    this.http.get(environment.apiUrl+"plan-formation/"+localStorage.getItem("idPlan"), {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        this.planFormation= response["data"];

        console.log(this.planFormation);
        this.titre = response["data"]["titre"];
        this.dateDebut=response["data"]["dateDebut"];
        this.dateFin=response["data"]["dateFin"];
        this.commentaire=response["data"]["commentaire"];
        this.statut=response["data"]["statutPlanFormation"]["libelle"];
        this.files=response["data"]["files"];

        this.loginForm.patchValue({
          titre: this.titre,
          dateDebut: this.dateDebut,
          dateFin: this.dateFin,
          commentaire: this.commentaire
        });

        console.log(response["data"]["files"]);
        
      },
      (error) => console.log(error)
    )
   
  }

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
   onUpdatePlan(): void {
    Swal.fire({
      title: "Voulez-vous modifier ce plan de formation",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.put(environment.apiUrl+"plan-formation/"+localStorage.getItem("idPlan")+"/modify", 
        
        {
          "titre": this.loginForm.value.titre,
          "commentaire": this.loginForm.value.commentaire,
          "dateDebut": this.loginForm.value.dateDebut,
          "dateFin": this.loginForm.value.dateFin,
          "fichiersAAjouter": [
          ],
          "fichiersASupprimer": [
          ]
        }, 
        
        {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {
            console.log(response);
            console.log("hhhhhhhhhhhhhhhhhhhhhhhh");

            Swal.fire({
              icon: 'success',
              html: `Le plan de formation a été modifié avec succès.`,
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.router.navigate(['formations/plan-formation']);
            })

            
          },
          (error) => console.log(error)
        )


       
      }
    })
  }

  onReset() {
    this.location.back();
  }
}
