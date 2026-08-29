import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {ReferencesService} from "../../../../../services/references.service";
import {ResponseApi} from "../../../../../models/response-api";
import {CentralLevelDTO, Profil} from "../../../../../models/utilisateur";
import {NgxSpinnerService} from "ngx-spinner";
import {
    matriculeContractuelValidator,
    matriculeFonctionnaireValidator,
    thirteenOrFourteenDigitsValidator
} from "../../../../../shared/commons/validators";

@Component({
  selector: 'app-edit-utilisateur',
  templateUrl: './edit-utilisateur.component.html',
  styleUrls: ['./edit-utilisateur.component.css']
})
export class EditUtilisateurComponent implements  OnInit{
    centralForm!: FormGroup;
    centralRegionForm!: FormGroup;
    service!: any;
    division: any;
    corpsGrade: any;
    bureau: any;
    fonction: any;
    direction: any;
    profils: any
    validEmailLogin = false;
    isLoading = false;
    userId: any;
    profile!: Profil ;
     centralLevel!: CentralLevelDTO;
     grade: any;
    region: any;
    speciality: any;
    typePoste: any;
    diplomeACA: any;
    diplomePED: any;
    diplomePROF: any;
    typeMatricule: any;

    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    validationResult: string = '';

  constructor(
      private router: Router,
      private location: Location,
      private formBuilder: FormBuilder,
      private userService: UtilisateurService,
      private referenceService: ReferencesService,
      private activatedRoute: ActivatedRoute,
      private spinner: NgxSpinnerService,
  ) {
      this.userId = this.activatedRoute.snapshot.paramMap.get('userId')
  }

    ngOnInit(): void {

      this.initForm();
      this.getCentralUser();

    }


    initForm() {
        this.centralRegionForm = this.formBuilder.group({
            region:  new FormGroup({
                code: new FormControl('',  [ Validators.required])
            }),


            division: new FormGroup({
                code: new FormControl('')
            }),
            bureau: new FormGroup({
                code: new FormControl('')
            }),
            direction: new FormGroup({
                code: new FormControl('',  [ Validators.required])
            }),

        });


        this.centralForm = this.formBuilder.group({
            nom: ['', Validators.required], // Assurez-vous que 'login' est correct
            prenom: ['', Validators.required] ,// Assurez-vous que 'password' est correct
            email:  ['', Validators.required],
            telephone:  ['', Validators.required],
            adresse:  [''],
           // matricule:  ['', Validators.required],
           // dateDEntree:  ['', Validators.required],
            sexe:  [''],
            situationMatrimoniale:  [''],
            profils:  new FormGroup({
                code: new FormControl('',  [ Validators.required])
            }),
            corpsGrade:  new FormGroup({
                code: new FormControl('',  [ Validators.required])
            }),
            grade:  new FormGroup({
                code: new FormControl('',  [ Validators.required])
            }),


            fonction:  new FormGroup({
                code: new FormControl('',  [ Validators.required])
            }),
            services:  new FormGroup({
                code: new FormControl('')
            }),

            speciality:   new FormGroup({
                code: new FormControl('', [Validators.required])
            }),

            lieuDeNaissance: ['', Validators.required],
            dateNaissance: ['', Validators.required],
            cni: ['', [Validators.required, thirteenOrFourteenDigitsValidator]],
            dateCorp: ['', Validators.required],
            dateDEntreeFonctionPub: [''],
            dateEntreEnseignement: [''],
            dateEntreService: [''],
            //  dateEntreEtablissement: ['', Validators.required],
            diplomeACA:  new FormGroup({
                code: new FormControl('')
            }),
            diplomePED:  new FormGroup({
                code: new FormControl('')
            }),
            diplomePROF: new FormGroup({
                code: new FormControl('')
            }),
            matriculeContratuel: ['', matriculeContractuelValidator],
            matriculeFonctionnaire: ['', matriculeFonctionnaireValidator],
            matriculeVacataire: ['', matriculeContractuelValidator],
            matriculeDecisionnaire: ['', matriculeFonctionnaireValidator],
            nationalite: ['', Validators.required],
            nombreEnfants: [''],
            typeMatricule:  new FormGroup({
                code: new FormControl('')
            }),
            typePoste:  new FormGroup({
                code: new FormControl('',  [ Validators.required])
            }),
        });

        // this.listProfiles();

        /*   this.referenceService.listProfilesCEN().subscribe(response => {

               if(response.success)
                   this.profils = response.data;

           });*/

        this.referenceService.listRegion().subscribe(response => {
            if(response.success)
                this.region = response.data;
        });

        this.referenceService.listService().subscribe(response => {
            if(response.success)
                this.service = response.data;
        });

        this.referenceService.listDivisions().subscribe(response => {
            if(response.success)
                this.division = response.data;
        });

      /*  this.referenceService.listButreaus().subscribe(response => {
            if(response.success)
                this.bureau = response.data;
        });

       */

        this.referenceService.listFonction().subscribe(response => {
            if(response.success)
                this.fonction = response.data;
        });

        this.referenceService.listcorpsGrade().subscribe(response => {
            if(response.success)
                this.corpsGrade = response.data;
        });

    /*    this.referenceService.listProfilesCEN().subscribe(response => {

            if(response.success)
                this.profils = response.data;
        });*/

        this.referenceService.listSpeciality().subscribe(response => {
            if(response.success)
                this.speciality = response.data;
        });

        this.referenceService.listDirections().subscribe(response => {
            if(response.success)
                this.direction = response.data;
        });


        /**
         * NEW ADD
         */

        this.referenceService.listTypePoste().subscribe(response => {
            if(response.success)
                this.typePoste = response.data;

        });

        this.referenceService.listDiplomeACA().subscribe(response => {
            if(response.success)
                this.diplomeACA = response.data;
        });
        this.referenceService.listDiplomePED().subscribe(response => {
            if(response.success)
                this.diplomePED = response.data;
        });
        this.referenceService.listDiplomePROF().subscribe(response => {
            if(response.success)
                this.diplomePROF = response.data;
        });

        this.referenceService.listTypeMatricule().subscribe(response => {
            if(response.success)
                this.typeMatricule = response.data;
        });



    }

    getCentralUser() {
        this.spinner.show();
        this.userService.getUser(this.userId)

            .subscribe({
                next : (response : ResponseApi) => {
                    if(response.success){

                        this.centralLevel = response.data;

                      //  console.log(this.centralLevel);
                        this.profile = this.centralLevel.profils?.[0];

                        if (this.centralLevel?.corpsGrade?.code) {
                            this.getGradeFromCorps(this.centralLevel.corpsGrade.code);
                        }
                       // this.getListBureau(this.centralLevel?.division?.code);

                      /*  if(this.centralLevel?.division?.code){

                            this.getProfileDivision(this.centralLevel?.division?.code);
                        }*/
                      //  this.getGradeFromCorps(this.centralLevel?.corpsGrade?.code)


                        if(!this.centralLevel?.division?.code && this.centralLevel?.direction?.code) {
                            this.getProfileDirection(this.centralLevel?.direction?.code);
                        }

                     /*   if(this.centralLevel?.division?.code ) {
                            this.getProfileDivision(this.centralLevel?.division?.code);
                            //this.getProfileBureau(this.centralLevel?.bureau?.code);
                        }

                      */

                        //console.log(this.centralLevel);
                        if(this.centralLevel?.bureau?.code && this.centralLevel?.division?.code){
                            this.getListBureau(this.centralLevel?.bureau?.code);
                            this.getProfileBureauWithOutCD(this.centralLevel?.division?.code)

                        }if(!this.centralLevel?.bureau?.code && this.centralLevel?.division?.code) {

                            this.getProfileDivision(this.centralLevel?.division?.code);
                        }

                        if(this.centralLevel?.division?.code) {
                            this.getListBureau(this.centralLevel?.division?.code);
                        }




                        this.centralForm.patchValue({
                            nom: this.centralLevel?.nom, // Assurez-vous que 'login' est correct
                            prenom:  this.centralLevel?.prenom,// Assurez-vous que 'password' est correct
                            email:   this.centralLevel?.email,
                            telephone:  this.centralLevel?.telephone,
                            adresse:  this.centralLevel?.adresse,
                            matricule: this.centralLevel?.matricule,
                           // dateDEntree: this.centralLevel?.dateDEntree,
                            sexe:  this.centralLevel?.sexe,
                            situationMatrimoniale:  this.centralLevel?.situationMatrimoniale,
                            profils:   this.centralForm.controls['profils'].patchValue({
                                code: this.profile?.code
                            }),
                            corpsGrade:   this.centralForm.controls['corpsGrade'].patchValue({
                                code: this.centralLevel?.corpsGrade?.code
                            }),
                            grade:   this.centralForm.controls['grade'].patchValue({
                                code: this.centralLevel?.grade?.code
                            }),

                            fonction:   this.centralForm.controls['fonction'].patchValue({
                                code: this.centralLevel?.fonction?.code
                            }),
                            services:   this.centralForm.controls['services'].patchValue({
                                code: this.centralLevel?.service?.code
                            }),

                            speciality:    this.centralForm.controls['speciality'].patchValue({
                                code: this.centralLevel?.speciality?.code
                            }),
                            lieuDeNaissance: this.centralLevel?.lieuDeNaissance,
                            dateNaissance: this.centralLevel?.dateNaissance,
                            cni:  this.centralLevel?.cni,
                            dateCorp:  this.centralLevel?.dateCorp,
                            dateDEntreeFonctionPub:  this.centralLevel?.dateDEntreeFonctionPub,
                            dateEntreEnseignement:  this.centralLevel?.dateEntreEnseignement,
                            dateEntreService:  this.centralLevel?.dateEntreService,
                            //  dateEntreEtablissement: ['', Validators.required],
                            diplomeACA:  this.centralForm.controls['diplomeACA'].patchValue({
                                code: this.centralLevel?.diplomeACA?.code
                            }),
                            diplomePED:   this.centralForm.controls['diplomePED'].patchValue({
                                code: this.centralLevel?.diplomePED?.code
                            }),
                            diplomePROF:   this.centralForm.controls['diplomePROF'].patchValue({
                                code: this.centralLevel?.diplomePROF?.code
                            }),

                            //matriculeContratuel:  this.centralLevel?.matriculeContratuel !== undefined ? this.centralLevel?.matriculeContratuel.split("/")[0] :   this.centralLevel?.matriculeContratuel,
                            matriculeContratuel:  this.splitValueMatricule( this.centralLevel?.matriculeContratuel), // this.centralLevel?.matriculeContratuel !== undefined ? this.centralLevel?.matriculeContratuel.split("/")[0] :   this.centralLevel?.matriculeContratuel,
                            //matriculeFonctionnaire: this.centralLevel?.matriculeFonctionnaire !== undefined ? this.centralLevel?.matriculeFonctionnaire.split("/")[0] : this.centralLevel?.matriculeFonctionnaire,
                            matriculeFonctionnaire: this.splitValueMatricule( this.centralLevel?.matriculeFonctionnaire), //this.centralLevel?.matriculeFonctionnaire !== undefined ? this.centralLevel?.matriculeFonctionnaire.split("/")[0] : this.centralLevel?.matriculeFonctionnaire,
                            matriculeVacataire: this.splitValueMatricule( this.centralLevel?.matriculeVacataire),//  this.centralLevel?.matriculeVacataire !== undefined ? this.centralLevel?.matriculeVacataire.split("/")[0] : this.centralLevel?.matriculeVacataire,
                          //  matriculeVacataire:  this.centralLevel?.matriculeVacataire !== undefined ? this.centralLevel?.matriculeVacataire.split("/")[0] : this.centralLevel?.matriculeVacataire,
                           // matriculeDecisionnaire: this.centralLevel?.matriculeDecisionnaire !== undefined ? this.centralLevel?.matriculeDecisionnaire.split("/")[0] : this.centralLevel?.matriculeDecisionnaire,
                            matriculeDecisionnaire: this.splitValueMatricule( this.centralLevel?.matriculeDecisionnaire), //this.centralLevel?.matriculeDecisionnaire !== undefined ? this.centralLevel?.matriculeDecisionnaire.split("/")[0] : this.centralLevel?.matriculeDecisionnaire,

                            nationalite: this.centralLevel?.nationalite,
                            nombreEnfants: this.centralLevel?.nombreEnfants,
                            typeMatricule:   this.centralForm.controls['typeMatricule'].patchValue({
                                code: this.centralLevel?.typeMatricule?.code
                            }),
                            typePoste:    this.centralForm.controls['typePoste'].patchValue({
                                code: this.centralLevel?.typePoste?.code
                            }),




                            //Region form
                            region:   this.centralRegionForm.controls['region'].patchValue({
                                code: this.centralLevel?.region?.code
                            }),

                            division:   this.centralRegionForm.controls['division'].patchValue({
                                code: this.centralLevel?.division?.code
                            }),
                            bureau:   this.centralRegionForm.controls['bureau'].patchValue({
                                code: this.centralLevel?.bureau?.code
                            }),
                            direction:  this.centralRegionForm.controls['direction'].patchValue({
                                code: this.centralLevel?.direction?.code
                            }),


                        });

                        if( this.centralLevel?.matriculeContratuel) {
                            this.validationResult =  this.centralLevel?.matriculeContratuel.split("/")[1];
                        }else if( this.centralLevel?.matriculeFonctionnaire) {
                            this.validationResult =  this.centralLevel?.matriculeFonctionnaire.split("/")[1];
                        }else if( this.centralLevel?.matriculeVacataire) {
                            this.validationResult =     this.centralLevel?.matriculeVacataire.split("/")[1];
                        }else if (this.centralLevel?.matriculeDecisionnaire) {
                            this.validationResult = this.centralLevel.matriculeDecisionnaire.split("/")[1] || '';
                        } else {
                            this.validationResult = this.centralLevel?.matricule?.split("/")[1] || '';
                        }

                        if (this.centralLevel?.typeMatricule?.code) {
                            this.onTypeMatriculeChange(this.centralLevel.typeMatricule.code);
                        }



                            this.spinner.hide()


                    }
                }
            })
    }


    /*
    getProfileDivision(code: any): void {

        this.referenceService.listProfileDivision(code)
            .subscribe(response => {

                if (response.success) {
                    this.profils = response.data;
                }else {
                    this.referenceService.listProfilesCEN().subscribe(response => {

                        if(response.success)
                            this.profils = response.data;

                    });
                }
            });
    }
    getProfileDirection(code: any): void {
        this.referenceService.getProfileDirection(code)
            .subscribe(response => {

                if (response.success) {
                    this.profils = response.data;

                }
            });
    }
    getProfileBureau(code: any): void {

       // console.log(code)
        switch (code) {
            case "BUAS":
            case  "ASDD":
            case  "BUGE":
            case  "BUPA":
            case  "BUSE":
            case   "BUCO" :
                this.referenceService.listProfileBureau(code)
                    .subscribe(response => {

                        if (response.success) {

                            this.profils = response.data;
                        }
                    });
        }

    }
    getListBureau(code: any): void {


        this.referenceService.listBureauByCode(code)
            .subscribe(response => {

                if (response.success) {

                    this.bureau = response.data;
                }
            });
    }
    getGradeFromCorps(code: any) {
        this.referenceService.listGradeByCode(code)
            .subscribe(response => {

                if (response.success) {
                    this.grade = response.data;
                }
            });
    }
*/

    getListBureau(code: any): void {
        this.spinner.show();

       // console.log("burea ", code)
       if(code){
           this.referenceService.listBureauByCode(code)
               .subscribe(response => {
                   if (response.success) {
                       this.bureau = response.data;
                       this.spinner.hide()
                   }
               });
       }else {
           this.spinner.hide()
       }
    }

    getProfileDivision(code: any): void {
        //console.log("===>", code)
       if(code) {
           this.spinner.show()
           this.referenceService.listProfileDivision(code)
               .subscribe(response => {
                   if (response.success) {
                       this.profils = response.data;
                       this.spinner.hide()
                   }else {
                       this.referenceService.listProfilesCEN().subscribe(response => {
                           if(response.success)
                               this.profils = response.data;
                           this.spinner.hide()
                       });
                   }
               });
           this.spinner.hide()
       }
    }
    getProfileDirection(code: any): void {
       if(code) {
           this.spinner.show()
           this.referenceService.getProfileDirection(code)
               .subscribe(response => {
                   if (response.success) {
                       this.profils = response.data;
                       this.spinner.hide()
                   }
               });
       }
    }


    getProfileBureauWithOutCD(code: any): void {
        //console.log("ICI ", this.centralRegionForm.controls['bureau'].value)
        if(code){
            this.spinner.show()
            switch (code) {
                case "DFC":
                case  "DGCAA":
                case  "DGPEEC":
                case  "DAS":
                    this.referenceService.lisTypeProfileWithOutCD(code)
                        .subscribe(response => {
                            if (response.success) {
                                this.profils = response.data;
                                this.spinner.hide()
                            }
                        });
            }

            this.spinner.hide()
        }

    }


    getProfileBureau(code: any): void {
     //   console.log("===" + code)
        if(code) {
            this.spinner.show()
            switch (code) {
                case "BUAS":
                case  "ASDD":
                case  "BUGE":
                case  "BUPA":
                case  "BUSE":
                case   "BUCO" :
                    this.referenceService.listProfileBureau(code)
                        .subscribe(response => {
                            if (response.success) {
                                this.profils = response.data;
                                this.spinner.hide()
                            }
                        });
            }

            this.spinner.hide()
        }

    }
    getGradeFromCorps(code: any) {

      if(code) {
          this.spinner.show()
          this.referenceService.listGradeByCode(code)
              .subscribe(response => {
                  if (response.success) {
                      this.grade = response.data;
                      this.spinner.hide()
                  }
              });
      }
    }



    onReset() {
    this.location.back();
  }

    centralLevelForm(): CentralLevelDTO {

        return <CentralLevelDTO>{
            ...new CentralLevelDTO(),
            region:  this.centralRegionForm.controls['region'].value,
            direction: this.centralRegionForm.controls['direction'].value,
            division:  this.centralRegionForm.controls['division'] !== null ?  this.centralRegionForm.controls['division'].value : null,
          //  region: {code: this.centralRegionForm.controls['region'].value},
           // direction: {code: this.centralRegionForm.controls['direction'].value},
           // bureau: this.centralRegionForm.controls['bureau'] !== null ? {code: this.centralRegionForm.controls['bureau'].value} : null,
            bureau: this.centralRegionForm.controls['bureau'] !== null ? this.centralRegionForm.controls['bureau'].value : null,
         //   division: this.centralRegionForm.controls['division'] !== null ? {code: this.centralRegionForm.controls['division'].value} : null,
            adresse: this.centralForm.controls['adresse'].value,
            corpsGrade:  this.centralForm.controls['corpsGrade'].value,
            grade:  this.centralForm.controls['grade'].value,
            email: this.centralForm.controls['email'].value,
            fonction:  this.centralForm.controls['fonction'].value,
            speciality:   this.centralForm.controls['speciality'].value,
          //  matricule: this.centralForm.controls['matricule'].value,
            // dateDEntree: this.centralForm.controls['dateDEntree'].value,
            nom: this.centralForm.controls['nom'].value,
            prenom: this.centralForm.controls['prenom'].value,
            profils: [ this.centralForm.controls['profils'].value],
            service:  this.centralForm.controls['services'] !== null ?  this.centralForm.controls['services'].value : null,
            sexe: this.centralForm.controls['sexe'].value,
            situationMatrimoniale: this.centralForm.controls['situationMatrimoniale'].value,
            telephone: this.centralForm.controls['telephone'].value,

            lieuDeNaissance: this.centralForm.controls['lieuDeNaissance'].value,
            dateNaissance: this.centralForm.controls['dateNaissance'].value,
            cni: this.centralForm.controls['cni'].value,
            dateCorp: this.centralForm.controls['dateCorp'].value,
            dateDEntreeFonctionPub: this.centralForm.controls['dateDEntreeFonctionPub'].value,
            dateEntreService: this.centralForm.controls['dateEntreService'].value,
            dateEntreEnseignement: this.centralForm.controls['dateEntreEnseignement'].value,
            //  dateEntreEtablissement: ['', Validators.required],
            diplomeACA: this.centralForm.controls['diplomeACA'] !== null ?   this.centralForm.controls['diplomeACA'].value :    null,
            diplomePED: this.centralForm.controls['diplomePED'] !== null ?  this.centralForm.controls['diplomePED'].value :   null,
            diplomePROF: this.centralForm.controls['diplomePROF'] !== null ?  this.centralForm.controls['diplomePROF'].value :   null,




          //  matriculeContratuel: this.centralForm.controls['matriculeContratuel'].value !== ''  ? this.centralForm.controls['matriculeContratuel'].value + "/" + this.validationResult : '',
            matriculeContratuel: this.addValueMatricule(this.centralForm.controls['matriculeContratuel'].value, this.validationResult),
            // matriculeFonctionnaire:  this.centralForm.controls['matriculeFonctionnaire'].value !== ''  ? this.centralForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : '',
            matriculeFonctionnaire: this.addValueMatricule(this.centralForm.controls['matriculeFonctionnaire'].value, this.validationResult) , //this.centralForm.controls['matriculeFonctionnaire'].value !== ''  ? this.centralForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : '',
          //  matriculeVacataire: this.centralForm.controls['matriculeVacataire'].value !== ''  ? this.centralForm.controls['matriculeVacataire'].value + "/" + this.validationResult : '',
            matriculeVacataire: this.addValueMatricule(this.centralForm.controls['matriculeVacataire'].value, this.validationResult) , //this.centralForm.controls['matriculeFonctionnaire'].value !== ''  ? this.centralForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : '',
           // matriculeDecisionnaire: this.centralForm.controls['matriculeDecisionnaire'].value !== ''  ? this.centralForm.controls['matriculeDecisionnaire'].value + "/" + this.validationResult : '',
            matriculeDecisionnaire:this.addValueMatricule(this.centralForm.controls['matriculeDecisionnaire'].value, this.validationResult) , //this.centralForm.controls['matriculeFonctionnaire'].value !== ''  ? this.centralForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : '',



            nationalite: this.centralForm.controls['nationalite'].value,
            nombreEnfants: this.centralForm.controls['nombreEnfants'].value,
            typeMatricule:  this.centralForm.controls['typeMatricule'].value,
            typePoste:  this.centralForm.controls['typePoste'].value,
        }

    }


    get f(): { [p: string]: AbstractControl } {
        return this.centralForm!.controls;
    }

    get f1(): { [p: string]: AbstractControl } {
        return this.centralRegionForm!.controls;
    }

    checkConstraintsValidation(): void {
        Object.keys(this.f).forEach(field => {
            const control = this.centralForm!.get(field);
            control!.markAsTouched({onlySelf: true});
        });

        Object.keys(this.f1).forEach(field => {
            const control = this.centralRegionForm!.get(field);
            control!.markAsTouched({onlySelf: true});
        });




    }

    onUpdateUser(): void {



        if (!this.centralForm!.valid || !this.centralRegionForm!.valid  ) {

            this.checkConstraintsValidation();
            Swal.fire({
                icon: 'warning',
                title: 'Formulaire incomplet',
                html: 'Veuillez renseigner ou corriger les champs obligatoires signalés en rouge.',
                confirmButtonColor: 'rgba(29, 74, 123, 1)'
            }).then(() => {
                const firstInvalidControl = document.querySelector(
                    'form .ng-invalid:not(form)'
                ) as HTMLElement | null;
                firstInvalidControl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidControl?.focus();
            });
        }else {

            const dto = this.centralLevelForm();

             //  matriculeContratuel:  this.centralForm.controls['matriculeContratuel'].value ,
              //  matriculeFonctionnaire:   this.centralForm.controls['matriculeFonctionnaire'].value ,
             //   matriculeVacataire:  this.centralForm.controls['matriculeVacataire'].value,
            //    matriculeDecisionnaire: this.centralForm.controls['matriculeDecisionnaire'].value ,

               // console.log(dto);

      Swal.fire({
                title: "Voulez-vous modifier les informations de l'utilisateur",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgba(29, 74, 123, 1)',
                cancelButtonColor: '#FF4D4F',
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non'
            }).then((result) => {
                if (!result.isConfirmed) {
                    return;
                }
                this.spinner.show()
                this.userService.updateUserCentral(this.userId ,dto).subscribe({
                    next: (response: ResponseApi) => {

                        this.spinner.hide();
                        Swal.fire({
                            icon: 'success',
                            html: 'L\'utilisateur  a été modifié(e) avec succès.',
                            showConfirmButton: false,
                            timer: 2000
                        }).then(() => {
                            this.router.navigate(['utilisateurs/niveau-central']);
                        })


                    },
                    complete: () => {},
                    error: (error) => {
                        this.spinner.hide()
                        this.isLoading = false;
                        this.userService.showSwal('error', this.getBackendErrorMessage(error));
                    }
                })



            })



        }

    }


    calculateLetterFromMatricule(matricule: string): string {
        let sommeImpairs = 0;
        let sommePaires = 0;

        for (let i = 0; i < matricule.length; i++) {
            const num = parseInt(matricule[i], 10);
            if (isNaN(num)) {
                return 'Invalid matricule';
            }
            if (num % 2 === 0) {
                sommePaires += num;
            } else {
                sommeImpairs += num;
            }
        }

        const difference = Math.abs(sommeImpairs - sommePaires);
        if (difference >= 0 && difference <= 26) {

            if(difference == 0)
                return this.alphabet[26-1];
            return this.alphabet[difference - 1];
        } else {
            return 'Valeur hors de portée';
        }
    }
    onMatriculeChange(newMatricule: string): void {
        if(newMatricule)
              this.validationResult = this.calculateLetterFromMatricule(newMatricule);
        //  console.log(`La lettre correspondant à la différence des sommes des chiffres impairs et pairs de ${newMatricule} est ${this.validationResult}`);
    }

    private getBackendErrorMessage(error: any): string {
        const details = error?.error?.errors;
        if (typeof details === 'string' && details.trim()) {
            return details;
        }
        if (Array.isArray(details) && details.length) {
            return details.map(item => item?.message || item).join('<br>');
        }
        return error?.error?.message || 'La modification a échoué. Consultez les journaux du backend.';
    }

    onTypeMatriculeChange(typeCode: string): void {
        const controlByType: { [key: string]: string } = {
            MATFONC: 'matriculeFonctionnaire',
            MATCON: 'matriculeContratuel',
            MATVAC: 'matriculeVacataire',
            MATDEE: 'matriculeDecisionnaire'
        };
        const controlName = controlByType[typeCode];
        if (!controlName) {
            return;
        }

        const control = this.centralForm.get(controlName);
        const source = (this.centralLevel as any)?.[controlName]
            || this.centralLevel?.matricule
            || this.centralLevel?.matriculeFonctionnaire
            || this.centralLevel?.matriculeContratuel
            || this.centralLevel?.matriculeVacataire
            || this.centralLevel?.matriculeDecisionnaire;

        if (!control?.value && source) {
            control?.setValue(this.splitValueMatricule(source), { emitEvent: false });
        }

        const completeMatricule = source || control?.value;
        const savedLetter = completeMatricule?.includes('/') ? completeMatricule.split('/')[1] : '';
        this.validationResult = savedLetter || this.calculateLetterFromMatricule(control?.value || '');
    }



    splitValueMatricule(matricule: string | null | undefined): string {
       return matricule ? matricule.split("/")[0] : '';
    }


    addValueMatricule(newMatricule: string | null | undefined, validationResult: string): string {
        return newMatricule ? newMatricule + (validationResult ? "/" + validationResult : '') : '';
    }

}
