import { Location } from '@angular/common';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import { Grade, ParametreCorpsGrade } from 'src/app/models/utilisateur';
import { ReferencesService } from 'src/app/services/references.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ResponseApi } from 'src/app/models/response-api';
declare var $: any;

@Component({
  selector: 'app-edit-corps-grade',
  templateUrl: './edit-corps-grade.component.html',
  styleUrls: ['./edit-corps-grade.component.css']
})
export class EditCorpsGradeComponent implements OnInit, AfterViewInit {


  selectedGrade: string[] = [];
  typeMatricule: any;
  speciality: any[] = [];
  gradeList: Grade[] = [];
  grades: any;

  paramData!: ParametreCorpsGrade

  typeMatriculeDB: any;

  autocompleteListGrade: string[] = [];

  form!: FormGroup;

  paramId: any;


  ngAfterViewInit(): void {
   // this.getListMatricule();
  }

  ngOnInit(): void {
    this.initForm();
    this.getListMatricule();

  }

  constructor(
      private router: Router,
      private location: Location,
      private referenceService: ReferencesService,
      private spinner: NgxSpinnerService,
      private formBuilder: FormBuilder,
      private cdr: ChangeDetectorRef,
      private utilisateurService : UtilisateurService,
      private activatedRoute: ActivatedRoute,
  ) {
    this.paramId = this.activatedRoute.snapshot.paramMap.get('dataId')
  }



  initForm(): void {


    this.getParam(this.paramId)


    this.referenceService.listSpeciality().subscribe(response => {
      if (response.success) {
        this.speciality = response.data;
      }
    });


    this.referenceService.listGradeFilter().subscribe(response => {
      if (response.success) {
        this.gradeList = response.data;

        this.grades = this.paramData?.grades;

        this.autocompleteListGrade =  this.gradeList.map(role =>  `${role.label}`);
      }
    });


    this.referenceService.listTypeMatricule().subscribe(response => {
      if(response.success) {
        this.typeMatricule = response.data;

      }

    });


    this.form =  this.formBuilder.group({
      grades: [[], Validators.required],
      typeMatricules: [null, Validators.required],
      corpsGrade: [null, Validators.required],
     // speciality: [null, Validators.required]

    });



  }


  getParam(id: number) {

    this.spinner.show();
    this.utilisateurService.getParam(id).subscribe({
      next: (response: ResponseApi) => {
        if (response.success) {
           this.paramData = response.data;
          this.form.patchValue({
            grades: this.paramData?.grades.map(role =>  `${role.code}`),
            typeMatricules: this.paramData?.typeMatricules?.code,
            corpsGrade: this.paramData?.corpsGrade?.label,
           // speciality: this.paramData.speciality?.code,

          });


          this.selectedGrade = this.paramData?.grades?.map(role =>  `${role.label}`);

          this.spinner.hide();
        }
      },
    });



  }

  getListMatricule() {




  }
  onSaveGrade() {
    let gradesList: any[] =[];


    //console.log(this.selectedGrade)
   // grades.push(  this.selectedGrade?.map(role =>  `${role.label}`))

    /*this.selectedGrade.forEach((value: any) => {
      grades.push({code: value});
    })*/

   // console.log( this.form.controls['grades'].value)

    this.form.controls['grades'].value.forEach((value: any) => {
     // console.log(value);
      if(value.diplay === undefined) {
          if(typeof value === 'string') {
            gradesList.push({code: value});
          }
      }




      if(value.value !== undefined)
          gradesList.push({code: value.value});


    });


    let formData = {
      corpsGrade:  {label: this.form.controls['corpsGrade'].value },
      grades: gradesList,
      typeMatricules: {code: this.form.controls['typeMatricules'].value},
   //   speciality: {code: this.form.controls['speciality'].value},
    }

   // console.log(formData  )

    console.log(formData)
    this.utilisateurService.updateParam(this.paramId, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `Corps <strong> LIBELLE CORPS </strong> a été modifié avec succès.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
         // this.router.navigate(['utilisateurs/parametrage']);
          this.location.back();
        })

      },
      complete: () => {},
      error: (error) => {

        this.utilisateurService.showSwal('error', error?.error?.message);
      }
    })


    /*
    Swal.fire({
      icon: 'success',
      html: 'Corps <strong> LIBELLE CORPS </strong> a été modifié avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.router.navigate(['utilisateurs/parametrage']);
    })
    */

  }

  onReset() {
    this.location.back();
  }


  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectPickerMatricule').selectpicker();

    this.cdr.detectChanges();
  }


  updateSelectTextButton(): void {
    const selectAll = document.querySelectorAll('.bs-select-all');
    selectAll.forEach(e => e.textContent! = "Tout")

    const deselectAll = document.querySelectorAll('.bs-deselect-all');
    deselectAll.forEach(e => e.textContent! = "Aucun")
  }

}

