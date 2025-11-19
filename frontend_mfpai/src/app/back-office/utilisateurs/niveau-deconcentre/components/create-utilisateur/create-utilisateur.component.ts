import { Location } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {ReferencesService} from "../../../../../services/references.service";
import {
    DeconectedDTO
} from "../../../../../models/utilisateur";
import Swal from "sweetalert2";
import {ResponseApi} from "../../../../../models/response-api";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {
    matriculeContractuelValidator,
    matriculeFonctionnaireValidator,
    thirteenOrFourteenDigitsValidator
} from "../../../../../shared/commons/validators";



@Component({
  selector: 'app-create-utilisateur',
  templateUrl: './create-utilisateur.component.html',
  styleUrls: ['./create-utilisateur.component.css']
})
export class CreateUtilisateurComponent implements OnInit{

  deconectedForm!: FormGroup;
  etablissement!: any;
  ia: any;
  corpsGrade: any;
  typePoste: any;
  typeMatricule: any;
  diplomeACA: any;
  diplomePROF: any;
  diplomePED: any;
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
  grade: any;
  quantum: any;
  codeIA: any;
  deconectedRegionForm!: FormGroup;
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
      public modalService: NgbModal = inject(NgbModal),
      private spinner: NgxSpinnerService,

  ){}


  ngOnInit(): void {
   this.initForm()
  }

  initForm(){
      this.deconectedRegionForm = this.formBuilder.group({
          region:  [''],
          etablissement:  [''],
          ia:  [''],
          ief:  [''],
          structure:  ['', Validators.required],
          eefMinistere:  [''],
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
          profils:  ['', Validators.required] ,
          corpsGrade:  ['', Validators.required],
          grade:  ['', Validators.required],
          fonction:  ['', Validators.required],
          // region:  ['', Validators.required],
          speciality:  ['', Validators.required],
          // ia:  ['', Validators.required],
          structureMfpaa:  [''],
          //etablissement:  [''],
          cfp:  [''],
          ief:  [''],
          lieuDeNaissance: ['', Validators.required],
          dateNaissance: ['', Validators.required],
          cni: ['', [Validators.required, thirteenOrFourteenDigitsValidator]],
          dateCorp: ['', Validators.required],
          dateDEntreeFonctionPub: [''],
          dateEntreEnseignement: ['', Validators.required],
          dateEntreEtablissement: ['', Validators.required],
          dateEntreService: [''],
          diplomeACA: [''],
          diplomePED: [''],
          diplomePROF: [''],
          matriculeContratuel: ['', matriculeContractuelValidator],
          matriculeFonctionnaire: ['', matriculeFonctionnaireValidator],
          matriculeVacataire: ['', matriculeContractuelValidator],
          matriculeDecisionnaire: ['', matriculeFonctionnaireValidator],
          nationalite: ['', Validators.required],
          nombreEnfants: [''],
          typeMatricule: ['', Validators.required],
          typePoste: ['', Validators.required],
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
       this.referenceService.listEEMinistere().subscribe(response => {
          if(response.success)
              this.eeministere = response.data;
      });


  }

  getListEF(code: any): void {

      if(code) {
          this.spinner.show()
          this.codeIA = code;


          this.referenceService.listIEFByCode(code)
              .subscribe(response => {

                  if (response.success) {

                      this.ief = response.data;

                      this.spinner.hide()
                  }
              });
          this.spinner.hide()
      }

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


  getListEtabByIA(code: any): void {
     if(code) {

         this.spinner.show()
         this.referenceService.listEtablissementByIACode(code)
             .subscribe(response => {



                 if (response.success) {
                     this.etablissement = response.data;

                     this.spinner.hide()
                 }
             });
         this.spinner.hide()
     }
  }

  getListIA(code: any): void {

   if(code) {
       this.spinner.show()
       this.referenceService.listIAByCode(code)
           .subscribe(response => {

               if (response.success) {
                   this.ia = response.data;
                   this.spinner.hide()
               }
           });
       this.spinner.hide()
   }
  }



  getListCFP(code: any): void {

    this.referenceService.listCFPByCode(code)
        .subscribe(response => {

          if (response.success) {
            this.cfp = response.data;
          }
        });
  }

    getStruct(code: any) {
        if(code) {
            this.spinner.show()

            if(code === 'MIN') {
                this.referenceService.listEtablissementByEFFCode(code)
                    .subscribe(response => {

                        if (response.success) {
                            this.etablissement = response.data;
                            this.spinner.hide()
                        }
                    });

                this.spinner.hide();
            }else
                this.spinner.hide();


        }
    }

  getListEtablissement(code: any): void {

        if(code) {
            this.spinner.show()
            this.referenceService.listEtablissementByCode(code)
                .subscribe(response => {

                    if (response.success) {
                        this.etablissement = response.data;
                        this.spinner.hide()
                    }
                });

            this.spinner.hide()
        }else {
            this.spinner.show()
            this.referenceService.listEtablissementByIACode( this.codeIA )
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


 deconnectedLevelForm(): DeconectedDTO {
     if(this.deconectedForm.controls['typeMatricule'].value === 'MATFONC') {
         this.deconectedForm.patchValue({
             matriculeContratuel:  ""

         })
     }else  if(this.deconectedForm.controls['typeMatricule'].value === 'MATCON') {
         this.deconectedForm.patchValue({
             matriculeFonctionnaire:  ""

         })
     }

    return <DeconectedDTO>{
      ...new DeconectedDTO(),
      adresse: this.deconectedForm.controls['adresse'].value,
      corpsGrade: {code: this.deconectedForm.controls['corpsGrade'].value},
      grade: {code: this.deconectedForm.controls['grade'].value},
      email: this.deconectedForm.controls['email'].value,
     // quantumHoraire: this.deconectedForm.controls['quantumHoraire'].value,
      quantumHoraire:  this.quantum,
      fonction: {code: this.deconectedForm.controls['fonction'].value},
     // matricule: this.deconectedForm.controls['matricule'].value,
     // dateDEntree: this.deconectedForm.controls['dateDEntree'].value,
      nom: this.deconectedForm.controls['nom'].value,
      prenom: this.deconectedForm.controls['prenom'].value,
      profils: [{code: this.deconectedForm.controls['profils'].value}],
      sexe: this.deconectedForm.controls['sexe'].value,
      telephone: this.deconectedForm.controls['telephone'].value,
      situationMatrimoniale: this.deconectedForm.controls['situationMatrimoniale'].value,
      //region:   {code: this.deconectedRegionForm.controls['region'].value},
      region:  this.deconectedRegionForm.controls['region'].value !== '' ? {code: this.deconectedRegionForm.controls['region'].value} : null,
      speciality:  {code: this.deconectedForm.controls['speciality'].value},
        structure:   {code: this.deconectedRegionForm.controls['structure'].value},
      //ia:   {code: this.deconectedRegionForm.controls['ia'].value},
       ief: this.deconectedRegionForm.controls['ief'].value !== '' ? {code: this.deconectedRegionForm.controls['ief'].value} : null,
        ia: this.deconectedRegionForm.controls['ia'].value !== '' ? {code: this.deconectedRegionForm.controls['ia'].value} : null,
        etablissement: this.deconectedRegionForm.controls['etablissement'].value !== '' ? {code: this.deconectedRegionForm.controls['etablissement'].value} : null,
       // eefMinistere:  this.deconectedRegionForm.controls['eefMinistere'].value  !== '' ?  {code: this.deconectedRegionForm.controls['eefMinistere'].value} : null,

        lieuDeNaissance: this.deconectedForm.controls['lieuDeNaissance'].value,
        dateNaissance: this.deconectedForm.controls['dateNaissance'].value,
        cni: this.deconectedForm.controls['cni'].value,
        dateCorp: this.deconectedForm.controls['dateCorp'].value,
        dateDEntreeFonctionPub: this.deconectedForm.controls['dateDEntreeFonctionPub'].value,
        dateEntreEnseignement: this.deconectedForm.controls['dateEntreEnseignement'].value,
        dateEntreEtablissement: this.deconectedForm.controls['dateEntreEtablissement'].value,
        dateEntreService: this.deconectedForm.controls['dateEntreService'].value,
        diplomeACA: this.deconectedForm.controls['diplomeACA'].value !== '' ? {code:  this.deconectedForm.controls['diplomeACA'].value} : null,
        diplomePED: this.deconectedForm.controls['diplomePED'].value !== '' ? {code: this.deconectedForm.controls['diplomePED'].value} : null,
        diplomePROF: this.deconectedForm.controls['diplomePROF'].value !== '' ? {code: this.deconectedForm.controls['diplomePROF'].value} : null,


        matriculeContratuel: this.deconectedForm.controls['typeMatricule'].value === 'MATCON'  ? this.deconectedForm.controls['matriculeContratuel'].value + "/" + this.validationResult : null,
        matriculeFonctionnaire:  this.deconectedForm.controls['typeMatricule'].value === 'MATFONC'  ? this.deconectedForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : null,
        matriculeVacataire: this.deconectedForm.controls['typeMatricule'].value === 'MATVAC'  ? this.deconectedForm.controls['matriculeVacataire'].value + "/" + this.validationResult : null,
        matriculeDecisionnaire: this.deconectedForm.controls['typeMatricule'].value === 'MATDEE'  ? this.deconectedForm.controls['matriculeDecisionnaire'].value + "/" + this.validationResult : null,


        nationalite: this.deconectedForm.controls['nationalite'].value,
        nombreEnfants: this.deconectedForm.controls['nombreEnfants'].value,
        typeMatricule: {code: this.deconectedForm.controls['typeMatricule'].value},
        typePoste: {code: this.deconectedForm.controls['typePoste'].value},

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

  onSaveUser(){

    //  console.log(this.deconectedForm.value);


    if (!this.deconectedForm!.valid || !this.deconectedRegionForm!.valid) {
      this.checkConstraintsValidation();
    }else {
        const dto: DeconectedDTO = this.deconnectedLevelForm();
        this.spinner.show();
        this.userService.addUserDeconected(dto).subscribe({
            next: (response: ResponseApi) => {
               this.spinner.hide();
                Swal.fire({
                    icon: 'success',
                    // title: 'Création de compte',
                    html: 'L\'utilisateur  a été crée avec succès.',
                    showConfirmButton: false,
                    timer: 2000
                })
                   .then(() => {
                    // this.router.navigate(['utilisateurs/niveau-deconcentre']);
                       this.deconectedForm.reset();
                 })


            },
            complete: () => {
                // Called when the request is completed (optional)
                this.spinner.hide();
            },
            error: (error) => {
                // Error occurred, handle the error here
                this.spinner.hide();
                this.isLoading = false;
                // this.centralForm.reset();
                //  console.log(error?.error?.message);
                this.userService.showSwal('error', error?.error?.message);
            }
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
           /* if (num % 2 === 0) {
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
        this.validationResult = this.calculateLetterFromMatricule(newMatricule);
        //  console.log(`La lettre correspondant à la différence des sommes des chiffres impairs et pairs de ${newMatricule} est ${this.validationResult}`);
    }



}
