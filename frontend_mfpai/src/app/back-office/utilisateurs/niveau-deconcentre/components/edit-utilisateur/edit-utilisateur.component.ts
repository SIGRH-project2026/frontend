import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DeconectedDTO, Profil} from "../../../../../models/utilisateur";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {ReferencesService} from "../../../../../services/references.service";
import {ResponseApi} from "../../../../../models/response-api";
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
export class EditUtilisateurComponent implements OnInit{

    deconectedForm!: FormGroup;
    deconectedRegionForm!: FormGroup;
    etablissement!: any;
    ia: any;
    corpsGrade: any;
    bureau: any;
    fonction: any;
    direction: any;
    profils: any
    validEmailLogin = false;
    isLoading = false;
    speciality: any;
    ief: any;
    region: any;
    cfp: any;
    structureMfpaa: any;
     deconectedDTO!: DeconectedDTO;

    userId: any;
    profile!: Profil ;
    iaDB: any;
    grade: any;
     quantum: any   ;
     diplomePROF: any;
     typeMatricule: any;
     typePoste: any;
     diplomeACA: any;
     diplomePED: any;
     codeIA: any;
     structure: any;
     eeministere: any;

    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    validationResult: string = '';

    constructor(
        private router: Router,
        private location: Location,
        private formBuilder: FormBuilder,
        private userService: UtilisateurService,
        private referenceService: ReferencesService,
        private activatedRoute: ActivatedRoute,
        private  spinner : NgxSpinnerService,

    ){
        this.userId = this.activatedRoute.snapshot.paramMap.get('userId')
    }


    ngOnInit(): void {


    this.initForm()


    }


    initForm(){
        this.deconectedRegionForm = this.formBuilder.group({
            region:   new FormGroup({
                code: new FormControl('')
            }),
            ia:   new FormGroup({
                code: new FormControl('')
            }),
            etablissement:  new FormGroup({
                code: new FormControl('')
            }),
            ief:  new FormGroup({
                code: new FormControl('')
            }),

            structure:   new FormGroup({
                code: new FormControl('', [Validators.required])
            }),

          /*  eefMinistere:   new FormGroup({
                code: new FormControl('')
            }),

           */
        })
        this.deconectedForm = this.formBuilder.group({
            nom: ['', Validators.required], // Assurez-vous que 'login' est correct
            prenom: ['', Validators.required] ,// Assurez-vous que 'password' est correct
            email:  ['', Validators.required],
            telephone:  ['', Validators.required],
            adresse:  [''],
            //  matricule:  ['', Validators.required],
            // dateDEntree:  ['', Validators.required],
            sexe:  [''],
            quantumHoraire:  [''],
            situationMatrimoniale:  [''],
            profils:  new FormGroup({
                code: new FormControl('', [Validators.required])
            }),
            corpsGrade:  new FormGroup({
                code: new FormControl('', [Validators.required])
            }),
            grade:   new FormGroup({
                code: new FormControl('', [Validators.required])
            }),
            fonction:   new FormGroup({
                code: new FormControl('', [Validators.required])
            }),
            // region:  ['', Validators.required],
            speciality:   new FormGroup({
                code: new FormControl('', [Validators.required])
            }),

            lieuDeNaissance: ['', Validators.required],
            dateNaissance: ['', Validators.required],
            cni: ['', [Validators.required, thirteenOrFourteenDigitsValidator]],
            dateCorp: ['', Validators.required],
            dateDEntreeFonctionPub: [''],
            dateEntreEnseignement: ['', Validators.required],
            dateEntreEtablissement: ['', Validators.required],
            dateEntreService: [''],
            diplomeACA:  new FormGroup({
                code: new FormControl('')
            }),
            diplomePED:  new FormGroup({
                code: new FormControl('')
            }),
            diplomePROF:  new FormGroup({
                code: new FormControl('')
            }),
            matriculeContratuel: ['', matriculeContractuelValidator],
            matriculeFonctionnaire: ['', matriculeFonctionnaireValidator],
            matriculeVacataire: ['', matriculeContractuelValidator],
            matriculeDecisionnaire: ['', matriculeFonctionnaireValidator],
            nationalite: ['', Validators.required],
            nombreEnfants: [''],
            typeMatricule:  new FormGroup({
                code: new FormControl('', [Validators.required])
            }),
            typePoste:  new FormGroup({
                code: new FormControl('', [Validators.required])
            }),
        });

        // this.listProfiles();

        this.referenceService.listProfilesDEC().subscribe(response => {

            if(response.success)
                this.profils = response.data;
        });

        this.referenceService.listRegion().subscribe(response => {
            if(response.success)
                this.region = response.data;
        });


        this.referenceService.listSpeciality().subscribe(response => {
            if(response.success)
                this.speciality = response.data;
        });

        this.referenceService.listFonction().subscribe(response => {
            if(response.success)
                this.fonction = response.data;
        });

        this.referenceService.listcorpsGrade().subscribe(response => {
            if(response.success)
                this.corpsGrade = response.data;
        });

        this.referenceService.listProfilesDEC().subscribe(response => {

            if(response.success)
                this.profils = response.data;
        });


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

        this.referenceService.lisStructure().subscribe(response => {
            if(response.success)
                this.structure = response.data;
        });
       /* this.referenceService.listEEMinistere().subscribe(response => {
            if(response.success)
                this.eeministere = response.data;
        });*/


        this.getUser();


    }


    getUser() {
        this.spinner.show();
        this.userService.getUser(this.userId)

            .subscribe({
                next : (response : ResponseApi) => {

                    if(response.success){

                        this.deconectedDTO = response.data


                        console.log(this.deconectedDTO)

                        this.profile = this.deconectedDTO.profils[0];
                        this.iaDB = this.deconectedDTO.ia?.code;

                        this.getStruct(this.deconectedDTO?.structure?.code);

                        if(this.deconectedDTO?.structure?.code === 'IA') {
                            //this.getStruct(this.deconectedDTO?.structure?.code);

                            this.getListIA(this.deconectedDTO?.region?.code);


                            if(this.deconectedDTO?.ief){
                                 this.getListEF(this.deconectedDTO?.ia?.code);
                                 this.getListEtablissement(this.deconectedDTO?.ief?.code);
                                //  console.log("1222")
                            } else {
                                //console.log("2222")
                                   this.getListEtablissement(this.deconectedDTO?.ia?.code);
                                   this.getListEF(this.deconectedDTO?.ia?.code);
                            }

                        }

                        this.getGradeFromCorps(this.deconectedDTO?.corpsGrade?.code)

                        if( this.deconectedDTO?.matriculeContratuel) {
                            this.validationResult =  this.deconectedDTO?.matriculeContratuel.split("/")[1];
                        }else if( this.deconectedDTO?.matriculeFonctionnaire) {
                            this.validationResult =  this.deconectedDTO?.matriculeFonctionnaire.split("/")[1];
                        }else if( this.deconectedDTO?.matriculeVacataire) {
                            this.validationResult =   this.deconectedDTO?.matriculeVacataire.split("/")[1];
                        }else {
                            this.validationResult =  this.deconectedDTO?.matriculeDecisionnaire.split("/")[1];
                        }

                        this.deconectedForm.patchValue({
                            nom: this.deconectedDTO.nom,
                            prenom: this.deconectedDTO.prenom,
                            email:  this.deconectedDTO.email,
                            telephone: this.deconectedDTO.telephone,
                            adresse:  this.deconectedDTO.adresse,
                            quantumHoraire:  this.deconectedDTO.quantumHoraire,
                            sexe:  this.deconectedDTO.sexe,
                            situationMatrimoniale:  this.deconectedDTO.situationMatrimoniale,
                            profils: this.deconectedForm.controls['profils'].patchValue({
                                code: this.deconectedDTO.profils[0].code
                            }),
                            corpsGrade: this.deconectedForm.controls['corpsGrade'].patchValue({
                                code: this.deconectedDTO?.corpsGrade?.code
                            }),
                            grade: this.deconectedForm.controls['grade'].patchValue({
                                code: this.deconectedDTO?.grade?.code
                            }),
                            fonction:  this.deconectedForm.controls['fonction'].patchValue({
                                code: this.deconectedDTO?.fonction?.code
                            }),

                            speciality:  this.deconectedForm.controls['speciality'].patchValue({
                                code: this.deconectedDTO?.speciality?.code
                            }),


                            lieuDeNaissance: this.deconectedDTO?.lieuDeNaissance,
                            dateNaissance: this.deconectedDTO?.dateNaissance,
                            cni:  this.deconectedDTO?.cni,
                            dateCorp:  this.deconectedDTO?.dateCorp,
                            dateDEntreeFonctionPub:  this.deconectedDTO?.dateDEntreeFonctionPub,
                            dateEntreEnseignement:  this.deconectedDTO?.dateEntreEnseignement,
                            dateEntreEtablissement: this.deconectedDTO?.dateEntreEtablissement,
                            dateEntreService: this.deconectedDTO?.dateEntreService,
                            diplomeACA:  this.deconectedForm.controls['diplomeACA'].patchValue({
                                code: this.deconectedDTO?.diplomeACA?.code
                            }),
                            diplomePED:   this.deconectedForm.controls['diplomePED'].patchValue({
                                code: this.deconectedDTO?.diplomePED?.code
                            }),
                            diplomePROF:   this.deconectedForm.controls['diplomePROF'].patchValue({
                                code: this.deconectedDTO?.diplomePROF?.code
                            }),

                            matriculeContratuel: this.deconectedDTO?.matriculeContratuel !== undefined ? this.deconectedDTO?.matriculeContratuel.split("/")[0] : this.deconectedDTO?.matriculeContratuel,
                            matriculeFonctionnaire: this.deconectedDTO?.matriculeFonctionnaire !== undefined ?  this.deconectedDTO?.matriculeFonctionnaire.split("/")[0] : this.deconectedDTO?.matriculeFonctionnaire,
                            matriculeVacataire: this.deconectedDTO?.matriculeVacataire !== undefined ? this.deconectedDTO?.matriculeVacataire.split("/")[0] : this.deconectedDTO?.matriculeVacataire,
                            matriculeDecisionnaire: this.deconectedDTO?.matriculeDecisionnaire !== this.deconectedDTO?.matriculeDecisionnaire ? this.deconectedDTO?.matriculeDecisionnaire.split("/")[0] : this.deconectedDTO?.matriculeDecisionnaire,

                            nationalite: this.deconectedDTO?.nationalite,
                            nombreEnfants: this.deconectedDTO?.nombreEnfants,
                            typeMatricule:   this.deconectedForm.controls['typeMatricule'].patchValue({
                                code: this.deconectedDTO?.typeMatricule?.code
                            }),
                            typePoste:    this.deconectedForm.controls['typePoste'].patchValue({
                                code: this.deconectedDTO?.typePoste?.code
                            }),

                            region:   this.deconectedRegionForm.controls['region'].patchValue({
                                code: this.deconectedDTO?.region?.code
                            }),
                            ia:   this.deconectedRegionForm.controls['ia'].patchValue({
                                code:  this.deconectedDTO?.ia?.code
                            }),

                            ief:  this.deconectedRegionForm.controls['ief'].patchValue({
                                code:  this.deconectedDTO?.ief?.code
                            }),

                            etablissement:  this.deconectedRegionForm.controls['etablissement'].patchValue({
                                code:  this.deconectedDTO?.etablissement?.code
                            }),

                            structure:    this.deconectedRegionForm.controls['structure'].patchValue({
                                code: this.deconectedDTO?.structure?.code
                            }),

                        })
                    }
                }
            });


        this.spinner.hide();

    }

    getEEMinistre(code: any): void {
        if(code) {
            this.spinner.show()
            this.referenceService.listEEMinistereByCode(code).subscribe(response => {
                if(response.success)
                    this.eeministere = response.data;
                this.spinner.hide()
            });
        }
    }


    getListEF(code: any): void {

        if(code && code !== " ") {

            this.spinner.show()
            this.codeIA = code;
            this.referenceService.listIEFByCode(code)
                .subscribe(response => {

                    if (response.success) {

                        this.ief = response.data;

                        this.spinner.hide()
                    }
                });
        }

    }


    getListEtabByIA(code: any): void {

        if(code) {
            this.spinner.show()
            this.getListEF(this.deconectedDTO?.ia?.code);
            this.referenceService.listEtablissementByIACode(code)
                .subscribe(response => {

                    if (response.success) {

                        this.etablissement = response.data;
                        this.spinner.hide()
                    }
                });
        }

    }


    getListEtablissement(code: any): void {

        if( !this.deconectedDTO?.ief) {
            this.spinner.show();
          //  console.log(code)
          //  this.getListEF(this.deconectedDTO?.ia?.code);
            this.referenceService.listEtablissementByIACode(this.deconectedDTO?.ia?.code)
                .subscribe(response => {
                    console.log("#1")
                    if (response.success) {
                        this.etablissement = response.data;
                        this.spinner.hide();

                    }
                });
        }



        if(code &&  this.deconectedDTO?.ief) {
            this.spinner.show();
            console.log("test", code)
            this.referenceService.listEtablissementByCode(code)
                .subscribe(response => {

                    if (response.success) {
                        this.etablissement = response.data;
                        console.log("test #1", this.etablissement);
                        this.spinner.hide();
                    }
                });
        }

        /*else if (this.codeIA) {
            console.log("ici #")
            this.spinner.show()
            this.referenceService.listEtablissementByIACode( this.codeIA )
                .subscribe(response => {
                    if (response.success) {
                        this.etablissement = response.data;
                        this.spinner.hide()
                    }
                });
        }*/
        else {
           console.log("#3")
            this.spinner.show()
            this.referenceService.listEtablissementByIACode( this.deconectedDTO?.ia?.code )
                .subscribe(response => {
                    if (response.success) {
                        this.etablissement = response.data;
                        this.spinner.hide()
                    }
                });
        }




    }


    getListIA(code: any): void {

       if (code) {
           this.spinner.show()
           this.referenceService.listIAByCode(code)
               .subscribe(response => {

                   if (response.success) {
                       this.ia = response.data;
                       this.spinner.hide()
                   }
               });
       }
    }


    getStruct(code: any) {
        if(code) {
            this.spinner.show()
            this.referenceService.listEtablissementByEFFCode(code)
                .subscribe(response => {

                    if (response.success) {
                        this.etablissement = response.data;
                        this.spinner.hide()
                    }
                });

            this.spinner.hide()
        }
    }


    getListStructure(code: any): void {

        this.referenceService.listStructureMfpaaByCode(code)
            .subscribe(response => {
                if (response.success) {
                    this.structureMfpaa = response.data;
                }
            });
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

    checkQuatum(qtum: any) {

        switch (qtum) {
            case 'PES':
            case 'PEPS':
            case 'PEM':
            case 'PEAM':
            case 'PCS':
                this.quantum = 525
                break;
            case "PCEMG":
            case "MEPS":
            case "MEAM":
            case "METP":
            case "PCI":
            case "CCC":
                this.quantum = 625
                break;
            case "VACATAIRE":
                this.quantum = 500
                break;

            default:
                break
        }


    }


    deconnectedLevelForm(): DeconectedDTO {

        return <DeconectedDTO>{
            ...new DeconectedDTO(),
            adresse: this.deconectedForm.controls['adresse'].value,
            corpsGrade:  this.deconectedForm.controls['corpsGrade'].value,
            grade:  this.deconectedForm.controls['grade'].value,
            email: this.deconectedForm.controls['email'].value,
            fonction:  this.deconectedForm.controls['fonction'].value,
          //  matricule: this.deconectedForm.controls['matricule'].value,
          //  dateDEntree: this.deconectedForm.controls['dateDEntree'].value,
            nom: this.deconectedForm.controls['nom'].value,
            prenom: this.deconectedForm.controls['prenom'].value,
            profils: [ this.deconectedForm.controls['profils'].value],
            sexe: this.deconectedForm.controls['sexe'].value,
            situationMatrimoniale: this.deconectedForm.controls['situationMatrimoniale'].value,
            telephone: this.deconectedForm.controls['telephone'].value,
           // region:   this.deconectedRegionForm.controls['region'].value,
            region:  this.deconectedRegionForm.controls['region'].value !== null ?  this.deconectedRegionForm.controls['region'].value : null,
            speciality:   this.deconectedForm.controls['speciality'].value,
            structure:  this.deconectedRegionForm.controls['structure'].value,
            ia:  this.deconectedRegionForm.controls['ia'].value !== null ?  this.deconectedRegionForm.controls['ia'].value : null,
            //ia:  this.deconectedRegionForm.controls['ia'].value,
            ief: this.deconectedRegionForm.controls['ief'].value !== null ?  this.deconectedRegionForm.controls['ief'].value : null,
           // cfp: this.deconectedRegionForm.controls['cfp'].value !== undefined ? {code: this.deconectedRegionForm.controls['cfp'].value}: null,
            etablissement: this.deconectedRegionForm.controls['etablissement'].value !== null ?  this.deconectedRegionForm.controls['etablissement'].value : null,
            //eefMinistere: this.deconectedRegionForm.controls['eefMinistere'].value !== null ?  this.deconectedRegionForm.controls['eefMinistere'].value : null,
           // structureMFPAA:  this.deconectedForm.controls['structureMfpaa'].value  !== undefined ? {code: this.deconectedForm.controls['structureMfpaa'].value} : null,

            lieuDeNaissance: this.deconectedForm.controls['lieuDeNaissance'].value,
            dateNaissance: this.deconectedForm.controls['dateNaissance'].value,
            cni: this.deconectedForm.controls['cni'].value,
            dateCorp: this.deconectedForm.controls['dateCorp'].value,
            dateDEntreeFonctionPub: this.deconectedForm.controls['dateDEntreeFonctionPub'].value,
            dateEntreService: this.deconectedForm.controls['dateEntreService'].value,
            dateEntreEnseignement: this.deconectedForm.controls['dateEntreEnseignement'].value,
            dateEntreEtablissement: this.deconectedForm.controls['dateEntreEtablissement'].value,
            diplomeACA: this.deconectedForm.controls['diplomeACA'] !== null ?   this.deconectedForm.controls['diplomeACA'].value :    null,
            diplomePED: this.deconectedForm.controls['diplomePED'] !== null ?  this.deconectedForm.controls['diplomePED'].value :   null,
            diplomePROF: this.deconectedForm.controls['diplomePROF'] !== null ?  this.deconectedForm.controls['diplomePROF'].value :   null,

            matriculeContratuel: this.deconectedForm.controls['matriculeContratuel'].value !== ''  ? this.deconectedForm.controls['matriculeContratuel'].value + "/" + this.validationResult : '',
            matriculeFonctionnaire:  this.deconectedForm.controls['matriculeFonctionnaire'].value !== ''  ? this.deconectedForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : '',
            matriculeVacataire: this.deconectedForm.controls['matriculeVacataire'].value !== ''  ? this.deconectedForm.controls['matriculeVacataire'].value + "/" + this.validationResult : '',
           // matriculeDecisionnaire: this.deconectedForm.controls['matriculeDecisionnaire'].value !== ''  ? this.deconectedForm.controls['matriculeDecisionnaire'].value + "/" + this.validationResult : '',
             matriculeDecisionnaire: this.addValueMatricule(this.deconectedForm.controls['matriculeDecisionnaire'].value, this.validationResult) , //this.centralForm.controls['matriculeFonctionnaire'].value !== ''  ? this.centralForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : '',


            nationalite: this.deconectedForm.controls['nationalite'].value,
            nombreEnfants: this.deconectedForm.controls['nombreEnfants'].value,
            typeMatricule:  this.deconectedForm.controls['typeMatricule'].value,
            typePoste:  this.deconectedForm.controls['typePoste'].value,
        }

    }

    get f(): { [p: string]: AbstractControl } {
        return this.deconectedForm!.controls;
    }

    get f1(): { [p: string]: AbstractControl } {
        return this.deconectedRegionForm!.controls;
    }

    checkConstraintsValidation(): void {
        Object.keys(this.f).forEach(field => {
            const control = this.deconectedForm!.get(field);
            control!.markAsTouched({onlySelf: true});
        });

        Object.keys(this.f1).forEach(field => {
            const control = this.deconectedRegionForm!.get(field);
            control!.markAsTouched({onlySelf: true});
        });
    }

    splitValueMatricule(matricule: string): string {
        return   matricule !== undefined ? matricule.split("/")[0] :  matricule;
    }


    addValueMatricule(newMatricule: string, validationResult: string): string {
        return  newMatricule !== ''  ? newMatricule + "/" + validationResult : ''  ;
    }
    onUpdateUser(): void {
       // const dto =  this.deconnectedLevelForm();
       // console.log(this.f)

       // console.log(dto)

        if (!this.deconectedForm!.valid || !this.deconectedRegionForm!.valid) {

            this.checkConstraintsValidation();

            console.log(this.deconectedRegionForm)
            console.log(this.deconectedForm)

        }else {
            const dto =  this.deconnectedLevelForm();

          //  console.log(dto)
          //  console.log(dto)

           Swal.fire({
                title: "Voulez-vous modifier les informations de l'utilisateur",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgba(29, 74, 123, 1)',
                cancelButtonColor: '#FF4D4F',
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non'
            }).then((result) => {
                this.spinner.show()
                this.userService.updateUserDeconected(this.userId, dto).subscribe({
                    next: (response: ResponseApi) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                icon: 'success',
                                // title: 'Modification de compte',
                                html: 'L\'utilisateur a été modifié(e) avec succès.',
                                showConfirmButton: false,
                                timer: 2000
                            }).then(() => {
                                this.router.navigate(['utilisateurs/niveau-deconcentre']);
                            }).finally(() => {
                                this.spinner.hide()
                            })
                        }

                    },complete: () => {
                        this.spinner.hide()
                    },
                    error: (error) => {
                        this.userService.showSwal("error", error?.error?.message || error);
                        this.spinner.hide()
                    }
                });

            })

        }



  }

  onReset() {
    this.location.back();
  }

    calculateLetterFromMatricule(matricule: string): string {
        let sommeImpairs = 0;
        let sommePaires = 0;

        for (let i = 0; i < matricule.length; i++) {
            const num = parseInt(matricule[i], 10);
            if (isNaN(num)) {
                return 'Invalid matricule';
            }
            if ((i + 1) % 2 === 0) { // Positions paires (index + 1 est pair)
                sommePaires += num;
            }
            /*if (num % 2 === 0) {
                sommePaires += num;
            }

             */

            else {
                sommeImpairs += num;
            }
        }

        const difference = Math.abs(sommeImpairs - sommePaires);
        if (difference >= 0 && difference <= 26) {
            console.log(`${difference}`);
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

}
