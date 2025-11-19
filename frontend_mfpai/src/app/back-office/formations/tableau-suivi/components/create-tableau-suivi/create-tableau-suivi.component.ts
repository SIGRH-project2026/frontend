import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from 'src/app/services/credentials.service';
import { FormationService } from 'src/app/services/formation.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-tableau-suivi',
  templateUrl: './create-tableau-suivi.component.html',
  styleUrls: ['./create-tableau-suivi.component.css']
})
export class CreateTableauSuiviComponent {

 FormationId: string = "";
 nbrSession: string = "0";
 demandeList!: any;
 
 constructor(
    private location: Location,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private readonly _credentialService: CredentialsService,
    private readonly formationService: FormationService
  ){
    
  }
  

  ngOnInit():void{
    this.getSession();
    this.getFormation(localStorage.getItem("idFormCreateTableauSuivi"));
    this.route.params.subscribe(params => {
      this.FormationId = params['dataId'];
      console.log(this.FormationId);
    });
  }

  getFormation(id:string | null){

    this.formationService.getFormation(id).subscribe((response)=>{
      console.log(response);
        this.demandeList=response;

    });

 
  }

  getSession(){

    this.formationService.getSessionByFormation(localStorage.getItem("idFormCreateTableauSuivi")).subscribe((response)=>{
      console.log(response.success);
        
        if(response.success==true){
          this.nbrSession = response.data.length.toString();
          console.log(response.success);
          console.log(response.data);
        console.log(response);
          
        }else {
          this.nbrSession=="0";
          console.log(this.nbrSession);
        }
        
    }, 
    (error) => {
      console.log(error);
      console.log(error.status);
      this.nbrSession=="0";
      console.log(this.nbrSession);
      
    }
  );
   
   }

  onSave(){
    Swal.fire({
      icon: 'success',
      html: 'Tableau de suivi enregistré avec succès.',
      showConfirmButton: false,
      timer: 2000
    })
  }

  onSaveTS() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous ajouter ce tableau de suivi ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui, je confirme',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        const randomNumber = Math.floor(Math.random() * 90000) + 10000;
        const inputPresence = document.getElementById("presence") as HTMLInputElement;
        const inputAbscence = document.getElementById("abscence") as HTMLInputElement;

        const httpOptions = {
          headers: new HttpHeaders({
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Token")}`
          })
        };

        this.http.post(environment.apiUrl + "api/tableauxsuivi/add",


          {
            "presences": inputPresence.value,
            "abscences": inputAbscence.value,
            "nbrSession": this.nbrSession,
            "formationId": localStorage.getItem("idFormCreateTableauSuivi")
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
    });
  }

  onReset() {
    this.location.back();
  }
}