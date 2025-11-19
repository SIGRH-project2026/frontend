import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import { Location } from "@angular/common";
import {Etablissement, Ia, Ief, Region} from "../../../../../models/utilisateur";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreService} from "../../../services/parametre.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-edit-etablissement",
  templateUrl: "./edit-etablissement.component.html",
  styleUrls: ["./edit-etablissement.component.css"],
})
export class EditEtablissementComponent implements OnInit {

  selectedMinistere: string = '';
  selectedIa: string = '';
  region: Region[] = [];
  iA: Ia[] = [];
  iEF: Ief[] = [];

  etablissementForm!: FormGroup;
  structure:any;
  etablissement: any;
  codeIA: any;
  etabtId: any;
  ief: any;
  typeEtablissement: any;
   etablissementData!: Etablissement;

  constructor(
      private location: Location,
      private referenceService: ReferencesService,
      private parametreService: ParametreService,
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private spinner: NgxSpinnerService,
  ) {
    this.etabtId = this.activatedRoute.snapshot.paramMap.get('dataId');

    console.log(this.etabtId)
  }

  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.referenceService.listRegion().subscribe(response => {
      if (response.success) {
        this.region = response.data;
      }
    });

    this.referenceService.lisStructure().subscribe(response => {
      if(response.success)
        this.structure = response.data;
    });

    this.referenceService.lisTypeEtablissement().subscribe(response => {
      if(response.success)
        this.typeEtablissement = response.data;
    });



    this.etablissementForm = this.formBuilder.group({


      typeEtablissement:   new FormGroup({
        code: new FormControl('')
      }),

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

      code: ['', Validators.required],
      label: ['', Validators.required],


    })

    this. getEtablissement(this.etabtId);

  }


  getEtablissement(id: any) {
    this.spinner.show();
    this.parametreService.getEtablissment( id).subscribe(response => {
      if (response.success) {
        this.etablissementData = response.data;
        console.log(  this.etablissementData)

        this.getStruct(this.etablissementData?.structure?.code)

        if(this.etablissementData?.structure?.code === 'IA') {
          //this.getStruct(this.deconectedDTO?.structure?.code);

          //this.getStruct(this.deconectedDTO?.structure?.code);
          this.getListIA(this.etablissementData?.region?.code);


          if(this.etablissementData?.ief){
            // console.log("ief")
            this.getListEF(this.etablissementData?.ia?.code);
           // this.getListEtablissement(this.etablissementData?.ief?.code);
          }
          else {
            //  console.log("ia")
          //  this.getListEtablissement(this.deconectedDTO?.ia?.code);
            this.getListEF(this.etablissementData?.ia?.code);
          }

        }
        this.spinner.hide();

      }
    })
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

  getListIA(code: any): void {

    if(code) {
      this.spinner.show()
      this.referenceService.listIAByCode(code)
          .subscribe(response => {

            if (response.success) {
              this.iA = response.data;
              this.spinner.hide()
            }
          });
      this.spinner.hide()
    }
  }


  getListEF(code: any): void {
    console.log(code)
    if(code) {
      //this.spinner.show()
      this.codeIA = code;


      this.referenceService.listIEFByCode(code)
          .subscribe(response => {


            if (response.success) {

              this.iEF = response.data;

              // this.spinner.show()
            }
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


  onSave() {

    let formData = {
      structure: {code: this.etablissementForm.controls['structure'].value},
      region: this.etablissementForm.controls['region'].value !== '' ?  {code: this.etablissementForm.controls['region'].value} : null,
      ia: this.etablissementForm.controls['ia'].value !== '' ?  {code: this.etablissementForm.controls['ia'].value} : null,
      typeEtablissement: this.etablissementForm.controls['typeEtablissement'].value !== '' ?  {code: this.etablissementForm.controls['typeEtablissement'].value} : null,
      ief: this.etablissementForm.controls['ief'].value !== '' ? {code: this.etablissementForm.controls['ief'].value} : null,
      label: this.etablissementForm.controls['label'].value,
      code:  this.etablissementForm.controls['code'].value
    }

    console.log(formData)


    this.parametreService.addEtablissement(formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: 'Etablissement enregistrée avec succès.',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.location.back();
        })
      },
      complete: () => {},
      error: (error) => {

        this.parametreService.showSwal('error', error?.error?.message);
      }
    })



  }


  updateSave() {
    Swal.fire({
      icon: "success",
      html: "Etablissement modifiée avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.location.back();
    });
  }
}
