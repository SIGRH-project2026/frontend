import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ReferencesService} from "../../../../../services/references.service";
import {CentralLevel, CentralLevelDTO, DeconectedDTO, Profil} from "../../../../../models/utilisateur";
import {NgxSpinnerService} from "ngx-spinner";
import {ResponseApi} from "../../../../../models/response-api";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  thirteenOrFourteenDigitsValidator
} from "../../../../../shared/commons/validators";
import Swal from "sweetalert2";
import {Location} from "@angular/common";

@Component({
  selector: 'app-change-profil',
  templateUrl: './change-profil.component.html',
  styleUrls: ['./change-profil.component.css']
})
export class ChangeProfilComponent  implements OnInit {

  structure: any
  etablissement: any
  codeIA: any
  corpsGrade: any;
  ia: any
  ief: any
  userId: any
  user: any
  quantum: any

  service!: any;
  division: any;
  bureau: any;
  fonction: any;
  direction: any;

  profils!: Profil[] ;
  profilDecs!: Profil[] ;

  grade: any;
  region: any;

  centralForm!: FormGroup;
  centralRegionForm!: FormGroup;
  deconectedRegionForm!: FormGroup;
  deconectedForm!: FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private referenceService: ReferencesService,
              private spinner: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private utilisateurService: UtilisateurService) {
    this.userId = this.route.snapshot.paramMap.get('userId');


  }
  ngOnInit(): void {

this.initForm();

  this.getCentralLevelUser()

    this.referenceService.listDirections().subscribe(response => {
      if(response.success)
        this.direction = response.data;
    });


    this.referenceService.listcorpsGrade().subscribe(response => {
      if(response.success)
        this.corpsGrade = response.data;
    });


    this.referenceService.listDivisions().subscribe(response => {
      if(response.success)
        this.division = response.data;
    });




    this.referenceService.lisStructure().subscribe(response => {
      if(response.success)
        this.structure = response.data;
    });



    this.referenceService.listProfilesDEC().subscribe(response => {

      if(response.success)
        this.profilDecs = response.data;
    });

    this.referenceService.listRegion().subscribe(response => {
      if(response.success)
        this.region = response.data;
    });

    this.referenceService.listProfilesDEC().subscribe(response => {
      if(response.success)
        this.profilDecs = response.data;
    });

    this.referenceService.lisStructure().subscribe(response => {
      if(response.success)
        this.structure = response.data;
    });

  }


  initForm(){
    this.centralForm = this.formBuilder.group({
      division: [''],
      bureau: [''],
      direction: [Validators.required],
      region:  [''],
      nom: [''], // Assurez-vous que 'login' est correct
      prenom: [''] ,// Assurez-vous que 'password' est correct
      email:  [''],
      telephone:  [''],
      profils: [Validators.required] ,
      cni: [''],
    });


    this.deconectedForm = this.formBuilder.group({

      region:  [''],
      ia:   [''],
      etablissement:   [''],
      ief:  [''],

      structure:   [Validators.required],

      quantumHoraire:   [''],


      nom: [''], // Assurez-vous que 'login' est correct
      prenom: [''] ,// Assurez-vous que 'password' est correct
      email:  [''],
      telephone:  [''],
      profilDecs:  [Validators.required] ,
      cni: [''],

    });

  }

  getCentralLevelUser(){
    this.spinner.show();
    this.utilisateurService.getUser(this.userId)

        .subscribe({
          next : (response : ResponseApi) => {


            if(response.success){

              this.user = response.data



              // Check if user is DEC => CEN
              if(this.user?.typeUser === 'DEC'){
                this.centralForm.patchValue({
                  nom: this.user.nom,
                  prenom: this.user.prenom,
                  email:  this.user.email,
                  telephone: this.user.telephone,
                  cni: this.user.cni
                })
              }
              // Check if user is CEN => DEC
              else {
                this.deconectedForm.patchValue({
                  nom: this.user.nom,
                  prenom: this.user.prenom,
                  email:  this.user.email,
                  telephone: this.user.telephone,
                  cni: this.user.cni
                })
              }

              this.spinner.hide();
            }
          }
        })
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

  getListBureau(code: any): void {
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

    console.log(qtum);
    console.log(this.quantum);


  }



  getProfileBureau(code: any): void {

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

    return <DeconectedDTO>{
      ...new DeconectedDTO(),

      email: this.deconectedForm.controls['email'].value,

      nom: this.deconectedForm.controls['nom'].value,
      prenom: this.deconectedForm.controls['prenom'].value,
      profils: [{code: this.deconectedForm.controls['profilDecs'].value}],
      telephone: this.deconectedForm.controls['telephone'].value,
      region:  this.deconectedForm.controls['region'].value !== '' ? {code: this.deconectedForm.controls['region'].value} : null,

      structure:   {code: this.deconectedForm.controls['structure'].value},

      ief: this.deconectedForm.controls['ief'].value !== '' ? {code: this.deconectedForm.controls['ief'].value} : null,
      ia: this.deconectedForm.controls['ia'].value !== '' ? {code: this.deconectedForm.controls['ia'].value} : null,
      etablissement: this.deconectedForm.controls['etablissement'].value !== '' ? {code: this.deconectedForm.controls['etablissement'].value} : null,
      cni: this.deconectedForm.controls['cni'].value,

    }

  }


  centralLevelForm(): CentralLevelDTO {

    return <CentralLevelDTO><unknown>{
      ...new CentralLevelDTO(),
      region:  this.centralForm.controls['region'].value !== '' ? {code: this.centralForm.controls['region'].value} : null,

      direction: {code: this.centralForm.controls['direction'].value},
      bureau: this.centralForm.controls['bureau'] !== null ? {code: this.centralForm.controls['bureau'].value} : null,
      division: this.centralForm.controls['division'] !== null ? {code: this.centralForm.controls['division'].value} : null,

      email: this.centralForm.controls['email'].value,
      nom: this.centralForm.controls['nom'].value,
      prenom: this.centralForm.controls['prenom'].value,
      profils: [{code: this.centralForm.controls['profils'].value}],

      cni: this.centralForm.controls['cni'].value,
    }

  }




  saveChangeUser(): void {
    let dto: any
    if(this.user?.typeUser === 'DEC'){

      const dtoCen = this.centralLevelForm();
      dto = this.centralLevelForm();

      console.log(dto)

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
        this.utilisateurService.switchUserType(this.userId ,dtoCen).subscribe({
          next: (response: ResponseApi) => {

            if (result.isConfirmed) {

              this.spinner.hide();
              Swal.fire({
                icon: 'success',
                // title: 'Modification de compte',
                html: 'L\'utilisateur  a été modifié(e) avec succès.',
                showConfirmButton: false,
                timer: 2000
              }).then(() => {

             //   console.log(response)
               // this.router.navigate([`utilisateurs/filter-user?filter=${filter}`]);
                this.location.back();

              })
            }


          },
          complete: () => {},
          error: (error) => {
            this.spinner.hide()
          //  this.isLoading = false;
            this.utilisateurService.showSwal('error', error?.error?.message);
          }
        })
      })

    }else {
      const dtoDec = this.deconnectedLevelForm();

      dto = this.deconnectedLevelForm();

      console.log(dto)

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
        this.utilisateurService.switchUserType(this.userId ,dtoDec).subscribe({
          next: (response: ResponseApi) => {

            if (result.isConfirmed) {

              this.spinner.hide();
              Swal.fire({
                icon: 'success',
                // title: 'Modification de compte',
                html: 'L\'utilisateur  a été modifié(e) avec succès.',
                showConfirmButton: false,
                timer: 2000
              }).then(() => {
                this.location.back();
               // console.log(response)
                // this.router.navigate([`utilisateurs/filter-user?filter=${filter}`]);

              })
            }


          },
          complete: () => {},
          error: (error) => {
            this.spinner.hide()
            //  this.isLoading = false;
            this.utilisateurService.showSwal('error', error?.error?.message);
          }
        })
      })

    }

  }




  onChangeProfil() {
  this.router.navigate(['change-profil'], { relativeTo: this.route });
}
}
