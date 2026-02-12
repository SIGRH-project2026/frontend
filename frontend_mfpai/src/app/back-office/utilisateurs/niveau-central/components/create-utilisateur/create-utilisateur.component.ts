import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  Bureau,
  CentralLevel,
  CentralLevelDTO,
  CorpsGrade, Direction, Division,
  Fonction,
  Profil,
  Service
} from "../../../../../models/utilisateur";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {ReferencesService} from "../../../../../services/references.service";
import {ResponseApi} from "../../../../../models/response-api";
import {NgxSpinnerService} from "ngx-spinner";
import {
  matriculeContractuelValidator,
  matriculeFonctionnaireValidator,
  thirteenOrFourteenDigitsValidator
} from "../../../../../shared/commons/validators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-create-utilisateur',
  templateUrl: './create-utilisateur.component.html',
  styleUrls: ['./create-utilisateur.component.css']
})
export class CreateUtilisateurComponent implements OnInit{
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
   region: any;
  grade: any;
   typePoste: any;
   diplomeACA: any;
   diplomePED: any;
   diplomePROF: any;
   typeMatricule: any;
  speciality: any;
   lettreMatricule: any;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  validationResult: string = '';
 
  constructor(
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UtilisateurService,
    private referenceService: ReferencesService,
  ){}


  ngOnInit(): void {

    this.centralRegionForm = this.formBuilder.group({
      region:  ['', Validators.required],
      division:  [''],
      bureau:  [''],
      direction:  ['', Validators.required],
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
      profils:  ['', Validators.required] ,
      corpsGrade:  ['', Validators.required],
      grade:  ['', Validators.required],
      fonction:  ['', Validators.required],
     // region:  ['', Validators.required],
      services:  [''],
    //  division:  [''],
     // bureau:  [''],
    //  direction:  ['', Validators.required],

      speciality:  ['', Validators.required],

      lieuDeNaissance: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cni: ['', [Validators.required, thirteenOrFourteenDigitsValidator]],
      dateCorp: ['', Validators.required],
      dateDEntreeFonctionPub: [''],
      dateEntreService: [''],
      dateEntreEnseignement: ['', Validators.required],
    //  dateEntreEtablissement: ['', Validators.required],
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


    this.referenceService.listFonction().subscribe(response => {
      if(response.success)
        this.fonction = response.data;
    });

   this.referenceService.listcorpsGrade().subscribe(response => {
      if(response.success)
        this.corpsGrade = response.data;
    });


    this.referenceService.listSpeciality().subscribe(response => {
      if(response.success)
        this.speciality = response.data;
    });


    this.referenceService.listDirections().subscribe(response => {
      if(response.success)
        this.direction = response.data;
    });


       this.referenceService.listButreaus().subscribe(response => {
      if(response.success) {
         this.bureau = response.data;
          

          this.bureau = this.bureau.filter((b: { division: string; }) => b.division == null)
      }
       

        
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

  selectDivision(code: string) : void {
    this.getListBureau(code)
  }



  getListBureau(code: any): void {
    console.log(code)
   if(code){
     this.referenceService.listBureauByCode(code)
         .subscribe(response => {
           if (response.success) {
             this.bureau = response.data;
           }
         });
   }
  }

  getProfileDivision(code: any): void {
    if(code){
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
  }
  getProfileDirection(code: any): void {
   if(code){
     this.referenceService.getProfileDirection(code)
         .subscribe(response => {
           if (response.success) {
             this.profils = response.data;
           }
         });
   }
  }

  getProfileBureauWithOutCD(code: any): void {

   
    
       
    if(code){
      switch (code) {
        case "DFC":
        case  "DGCAA":
        case  "DGPEEC":
        case  "DAS":
          this.referenceService.lisTypeProfileWithOutCD(code)
              .subscribe(response => {
                if (response.success) {
                  this.profils = response.data;
                }
              });
      }
    }
  }


  getCorpsByMatricule(code: any): void {
    if(code) {
      switch (code) {
         case "MATFONC":
         case "MATDEE":
           code = "FD";
           break;
        case "MATCON":
          code = "VCC";
          break;
        case "MATVAC":
          code = "VCV";
          break;
      }


      this.referenceService.listCorpsByMatricule(code)
          .subscribe(response => {
            if (response.success) {
              this.corpsGrade = response.data;
            }
          });

    }
  }


  getProfileBureau(code: any): void {

        this.referenceService.listProfils()
              .subscribe(response => {
                if (response.success) {
                  this.profils = response.data;

                 // console.log("test")

                 

                  console.log('bureau', this.profils.filter((b: { typeProfileBureau: string; }) => b.typeProfileBureau == "BSDV"));
                   this.profils = this.profils.filter((b: { typeProfileBureau: string; }) => b.typeProfileBureau == "BSDV");

                     console.log('bureau', this.profils.filter((b: { typeProfileBureau: string; }) => b.typeProfileBureau == "BSDV"));

                }
              });

  /* if(code){
    switch (code) {
      case "BSEE":
     
    
        this.referenceService.listProfileBureau(code)
            .subscribe(response => {
              if (response.success) {
                this.profils = response.data;
              }
            });
    }
  }*/


  if(code){
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

  }


  getGradeFromCorps(code: any) {
   if(code){
     this.referenceService.listGradeByCode(code)
         .subscribe(response => {
           if (response.success) {
             this.grade = response.data;
           }
         });
   }
  }



  centralLevelForm(): CentralLevelDTO {

    if(this.centralForm.controls['typeMatricule'].value === 'MATFONC') {
      this.centralForm.patchValue({
        matriculeContratuel:  ""

      })
    }else  if(this.centralForm.controls['typeMatricule'].value === 'MATCON') {
      this.centralForm.patchValue({
        matriculeFonctionnaire:  ""

      })
    }

   return <CentralLevelDTO><unknown>{
     ...new CentralLevelDTO(),

     region: {code: this.centralRegionForm.controls['region'].value},
     direction: {code: this.centralRegionForm.controls['direction'].value},
     bureau: this.centralRegionForm.controls['bureau'] !== null ? {code: this.centralRegionForm.controls['bureau'].value} : null,
     division: this.centralRegionForm.controls['division'] !== null ? {code: this.centralRegionForm.controls['division'].value} : null,


     adresse: this.centralForm.controls['adresse'].value,
     corpsGrade: {code: this.centralForm.controls['corpsGrade'].value},
     grade: {code: this.centralForm.controls['grade'].value},
     email: this.centralForm.controls['email'].value,
     fonction: {code: this.centralForm.controls['fonction'].value},
       // matricule: this.centralForm.controls['matricule'].value,
    // dateDEntree: this.centralForm.controls['dateDEntree'].value,
     speciality:  {code: this.centralForm.controls['speciality'].value},
     nom: this.centralForm.controls['nom'].value,
     prenom: this.centralForm.controls['prenom'].value,
     profils: [{code: this.centralForm.controls['profils'].value}],
     service: this.centralForm.controls['services'] !== null ? {code: this.centralForm.controls['services'].value} : null,
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
     diplomeACA: this.centralForm.controls['diplomeACA'].value !== '' ? {code:  this.centralForm.controls['diplomeACA'].value} : null,
     diplomePED: this.centralForm.controls['diplomePED'].value !== '' ? {code: this.centralForm.controls['diplomePED'].value} : null,
     diplomePROF: this.centralForm.controls['diplomePROF'].value !== '' ? {code: this.centralForm.controls['diplomePROF'].value} : null,

     matriculeContratuel: this.centralForm.controls['typeMatricule'].value === 'MATCON'  ? this.centralForm.controls['matriculeContratuel'].value + "/" + this.validationResult : null,
     matriculeFonctionnaire:  this.centralForm.controls['typeMatricule'].value === 'MATFONC'  ? this.centralForm.controls['matriculeFonctionnaire'].value + "/" + this.validationResult : null,
     matriculeVacataire: this.centralForm.controls['typeMatricule'].value === 'MATVAC'  ? this.centralForm.controls['matriculeVacataire'].value + "/" + this.validationResult : null,
     matriculeDecisionnaire: this.centralForm.controls['typeMatricule'].value === 'MATDEE'  ? this.centralForm.controls['matriculeDecisionnaire'].value + "/" + this.validationResult : null,

     nationalite: this.centralForm.controls['nationalite'].value,
     nombreEnfants: this.centralForm.controls['nombreEnfants'].value,
     typeMatricule: {code: this.centralForm.controls['typeMatricule'].value},
     typePoste: {code: this.centralForm.controls['typePoste'].value},
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
  emailValidationLogin(e: any): void {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.validEmailLogin = re.test(String(e).toLowerCase());
  }


  onSaveUser(){
   // console.log(this.centralLevelForm())
    if (!this.centralForm!.valid) {
      this.checkConstraintsValidation();
    }else {
      // console.log('value', this.centralLevelForm())
      const dto = this.centralLevelForm()

     //console.log(dto)
      this.userService.addUserCentral(dto).subscribe({
        next: (response: ResponseApi) => {
          Swal.fire({
            icon: 'success',
            // title: 'Création de compte',
            html: 'L\'utilisateur  a été crée avec succès.',
            showConfirmButton: false,
            timer: 2000
          })
            .then(() => {
            // this.router.navigate(['utilisateurs/niveau-central']);
              this.centralForm.reset();
           })

        },
        complete: () => {
          // Called when the request is completed (optional)
        },
        error: (error) => {
          // Error occurred, handle the error here
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


  get matricule(): FormControl {
    const errors  =  this.centralForm.get('matricule')?.errors
    return errors?.['matricule'];
  }


  getLetterMatricule(intMatricule : number){
    let sum1 = 0;
    let sum2 = 0;
    let evenOrOdd = false;

    for (let i = 100000; i>=1; i = Math.floor(i / 10))
    {
      let figure = Math.floor(intMatricule / i);
      if(evenOrOdd)
        sum1 += figure;
      else
        sum2 += figure;

      intMatricule = intMatricule % i;
      evenOrOdd = !evenOrOdd;
    }


    let asciiCode = 64 + Math.abs(sum1 - sum2);
    if (asciiCode >= 65 && asciiCode < 90)
      this.lettreMatricule.next(String.fromCharCode(asciiCode));
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
      /*  if (num % 2 === 0) {
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
