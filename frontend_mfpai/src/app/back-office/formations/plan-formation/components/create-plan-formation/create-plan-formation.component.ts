import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { CredentialsService } from 'src/app/services/credentials.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
//import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-create-plan-formation',
  templateUrl: './create-plan-formation.component.html',
  styleUrls: ['./create-plan-formation.component.css']
})
export class CreatePlanFormationComponent implements OnInit{

    minEndDate: string = '';
    maxEndDate: string = '';
    userInfos: any;

  constructor(
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly _credentialService: CredentialsService,
  ) {

    this.userInfos = this._credentialService.getUserInfos();
    if(this.userInfos)
      this.userInfos.id
   }

  files: File[] = [];
  loginForm!: FormGroup;
  iduser: number = 0;

  ngOnInit(): void {

    

    this.loginForm = this.formBuilder.group({
      titre: ['', Validators.required],
      commentaire: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });

    const token = localStorage.getItem('Token');

    if(token !=null){
      const parts = token?.split('.');
      const decodedPayload = atob(parts[1]);
      const decodedToken = JSON.parse(decodedPayload);
      console.log(decodedToken);

      this.iduser=decodedToken.infos.id;
    }


      this.loginForm.get('dateDebut')?.valueChanges.subscribe((dateDebut: string) => {
          const startDate = new Date(dateDebut);
          startDate.setFullYear(startDate.getFullYear() + 3); // Ajout de trois ans
          this.minEndDate = dateDebut;
          this.maxEndDate = startDate.toISOString().split('T')[0]; // Format ISO pour le sélecteur de date
      });

  }


    addPlanFormation(){

        Swal.fire({
            title: "Souhaitez-vous confirmer la création du plan de formation ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgba(29, 74, 123, 1)',
            cancelButtonColor: '#FF4D4F',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non'
        }).then((result) => {
            if (result.isConfirmed) {

                let formParams = new FormData();

                const randomNumber = Math.floor(Math.random() * 90000) + 10000;

                for (let i = 0; i < this.files.length; i++) {
                    formParams.append('files', this.files[i]);
                }

                const planFormationDTO = {
                    reference: "REF"+randomNumber,
                    titre: this.loginForm.value.titre,
                    commentaire: this.loginForm.value.commentaire,
                    dateDebut: this.loginForm.value.dateDebut,
                    dateFin: this.loginForm.value.dateFin,
                    datePublication: null,
                    createdByUserId: parseInt(this.userInfos.id),
                    statutPlanFormationId: 100
                };

                const planFormationDTOString = JSON.stringify(planFormationDTO);

                formParams.append('planFormationDTOString', planFormationDTOString);

                // Définissez les en-têtes de la requête
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Authorization': `Bearer ${localStorage.getItem("Token")}`
                    })
                };

                // Effectuez la requête HTTP
                this.http.post(environment.apiUrl + "plan-formation/add", formParams, httpOptions)
                    .subscribe(
                        (response: any) => {
                           // console.log(response.success);
                            //console.log(response);
                           // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
                            Swal.fire({
                                html: `Plan de formation <b>${this.loginForm.value.titre}<b/> a été créé avec succès.`,
                                icon: 'success',
                                timer: 1500,
                                showCancelButton: false,
                                showConfirmButton: false
                            })
                            this.router.navigate(['formations/plan-formation']);
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
        })

    }

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSavePlan() {
    Swal.fire({
      icon: 'success',
      html: 'L\'enregistrement du <b>Titre + periode(Annee debut - Annee Fin)</b> avec <b>le numéro de référence 10192</b> a été effectué avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.router.navigate(['formations/plan-formation']);
    })
  }

  onReset() {
    this.location.back();
  }

}
