import { Location } from '@angular/common';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Grade } from 'src/app/models/utilisateur';
import { ReferencesService } from 'src/app/services/references.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
declare var $: any;
@Component({
  selector: 'app-add-corps-grade',
  templateUrl: './add-corps-grade.component.html',
  styleUrls: ['./add-corps-grade.component.css']
})
export class AddCorpsGradeComponent implements OnInit,AfterViewInit {
  

  selectedGrade: string[] = [];
  typeMatricule: any;
  speciality: any[] = [];
  gradeList: Grade[] = [];


   typeMatriculeDB: any;

  autocompleteListGrade: string[] = [];

  form!: FormGroup;





  ngAfterViewInit(): void {
    this.initializeSelectpicker();
  }

  ngOnInit(): void {
    this.initForm();

  }

  constructor(
    private router: Router,
    private location: Location,
    private referenceService: ReferencesService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private utilisateurService : UtilisateurService,
  ) { }

  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectPickerMatricule').selectpicker();

    this.cdr.detectChanges();
  }




  initForm(): void {

    this.referenceService.listGradeFilter().subscribe(response => {
      if (response.success) {
        this.gradeList = response.data;
        this.autocompleteListGrade =  this.gradeList.map(role =>  `${role.label}`);
      }
    });

    this.referenceService.listSpeciality().subscribe(response => {
      if (response.success) {
        this.speciality = response.data;
      }
    });


    this.referenceService.listTypeMatricule().subscribe(response => {
      if(response.success) {
        this.typeMatricule = response.data;
      }
    });



    this.form =  this.formBuilder.group({
      grades: [[], Validators.required],
      typeMatricules: ['', Validators.required],
      corpsGrade: ['', Validators.required],
      //speciality: ['', Validators.required]

    })
  }



  onSaveGrade() {

    let grades: any[] =[];


    this.form.controls['grades'].value.forEach((value: any) => {
     grades.push({code: value.value});
    });


    let formData = {
      corpsGrade: {label: this.form.controls['corpsGrade'].value},
      grades: grades,
      typeMatricules: {code: this.form.controls['typeMatricules'].value},
     // speciality: {code: this.form.controls['speciality'].value},
    }



   this.utilisateurService.addParam(formData).subscribe({
      next: response => {
         Swal.fire({
            icon: 'success',
            html: `Corps <strong> LIBELLE CORPS </strong> a été crée avec succès.`,
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



   /* Swal.fire({
      icon: 'success',
      html: 'Corps <strong> LIBELLE CORPS </strong> a été crée avec succès.',
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

  updateSelectTextButton(): void {
    const selectAll = document.querySelectorAll('.bs-select-all');
    selectAll.forEach(e => e.textContent! = "Tout")

    const deselectAll = document.querySelectorAll('.bs-deselect-all');
    deselectAll.forEach(e => e.textContent! = "Aucun")
  }




}
