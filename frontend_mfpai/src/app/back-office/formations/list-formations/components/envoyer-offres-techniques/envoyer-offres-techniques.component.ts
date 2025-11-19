import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { CredentialsService } from 'src/app/services/credentials.service';


@Component({
  selector: 'app-envoyer-offres-techniques',
  templateUrl: './envoyer-offres-techniques.component.html',
  styleUrls: ['./envoyer-offres-techniques.component.css']
})
export class EnvoyerOffresTechniquesComponent implements OnInit {
  
  piecesJointesFiles: File[] = [];
  FormationId: string="";
  formId: any;
  userInfos: any;
  formation: any;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private location: Location,
    private readonly _credentialService: CredentialsService,
  ) { 

    this.userInfos = this._credentialService.getUserInfos();
    if(this.userInfos)
      this.userInfos.id
    
  }
  
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.FormationId = params['dataId'];
      console.log(this.FormationId);
    });
    this.getFormation(this.FormationId);
    console.log(this.userInfos.id);
   }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  getFormation(ref:string){
    this.http.get(environment.apiUrl+"api/formations/reference/"+ref, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        this.formation=response;
        this.formId=response.id;
        
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
        //console.log(this.getThemeFormation(response[0].themeFormationId));
        //console.log(this.getThemeFormation(response[0].themeFormationId));
      },
      (error) => console.log(error)
    )
  }

  addOffre(){
   // console.log(this.piecesJointesFiles);
  
    let formParams = new FormData();
  
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  
    //console.log(this.rapportFiles);
    
    for (let i = 0; i < this.piecesJointesFiles.length; i++) {
        formParams.append('pieces', this.piecesJointesFiles[i]);
    }
  
    var commentElement = document.getElementById("comment") as HTMLInputElement | null;
  
    const rapportDTO = {
        formation: {"id":this.formId},
        commentaire: commentElement?.value,
        chefeff: {"id":this.userInfos.id},
        statutOffreTechnique: {"code":"SOUMISE"}
    };
  
    const planFormationDTOString = JSON.stringify(rapportDTO);
  
    formParams.append('offreDTO', planFormationDTOString);
  
    // Définissez les en-têtes de la requête
    const httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem("Token")}`
        })
    };
  
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous confirmer l\'envoie de l\'offre technique et financière ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.http.post(environment.apiUrl + "api/offreTechniqueFinanciere/add", formParams, httpOptions)
        .subscribe(
            (response: any) => {
               // console.log(response.success);
                //console.log(response);
               // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

               
               Swal.fire({
                icon: 'success',
                html: 'Les offres techniques et financières ont été complétées avec succès.',
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
    });
    
  
    // Effectuez la requête HTTP
    
  }

   onSaveDemande() {
    Swal.fire({
      icon: "success",
      html: "La demande a été envoyée avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.router.navigate(["formations/liste-des-formations"]);
    });
  }
  onReset() {
    this.router.navigate(["formations/liste-des-formations"]);
  }
}
