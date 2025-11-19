import { Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import Swal from 'sweetalert2';
import {Bureau, Division} from "../../../../../models/utilisateur";
import {ReferencesService} from "../../../../../services/references.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ParametreService} from "../../../../../services/parametre.service";
import {NgxSpinnerService} from "ngx-spinner";



declare var $: any;

@Component({
  selector: 'app-create-indicateur',
  templateUrl: './create-indicateur.component.html',
  styleUrls: ['./create-indicateur.component.css']
})
export class CreateIndicateurComponent implements OnInit, AfterViewInit {

  divisionImpliques: Division[] = [];
  bureauImpliques: Bureau[] = [];
  form!: FormGroup;




  constructor(
    private location: Location,
    private cdr: ChangeDetectorRef,
    private referenceService: ReferencesService,
    private fb: FormBuilder,
    private paranetreService: ParametreService,
    private spinner: NgxSpinnerService
  ) { }


  ngAfterViewInit(): void {
    this.getListDivisions()
    this.getListBureaux()
  }


  ngOnInit(): void {
    this.initForm();
    this.getListDivisions()
    this.getListBureaux()
  }

  initForm(){
    this.form = this.fb.group({
      divisionsImpliquees: [[], Validators.required],
      bureauxImpliques: [[], Validators.required],
      libelle: ['', Validators.required],
      responsableActivite: ['DRH', Validators.required],

    });
  }




  onSave() {
    this.spinner.show()
    if (this.form.valid) {
      // Process the form data (e.g., submit to backend)
      const formData = this.form.value;
      let indicateur = {
        libelle: formData.libelle,
        divisionCodes: formData.divisionsImpliquees,
        bureauCodes: formData.bureauxImpliques
      }

      this.paranetreService.saveParametre(indicateur).subscribe((res)=>{
        if (res.status === 'OK'){
          this.spinner.hide()
          // Display success message
          Swal.fire({
            icon: 'success',
            html: 'Indicateur enregistré avec succès.',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.location.back();
          })
        }else{
          this.spinner.hide()
        }
      })


    } else {
      this.spinner.hide()
      // Display error message if form is invalid
      Swal.fire({
        icon: 'error',
        title: 'Veuilez renseigner tous les champs svp.',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectDivisionImplique').selectpicker('refresh');
    $('#selectBureauImplique').selectpicker('refresh');
   // this.cdr.detectChanges()
  }


  getListDivisions(){

    this.divisionImpliques = []
    this.referenceService.listDivisions().subscribe((res)=>{
      let listDivision = res.data
      $('#selectDivisionImplique').selectpicker('refresh');
      listDivision.forEach((value: Division) => {
        this.divisionImpliques.push(value)
      })
    })
  }

  getListBureaux(){
    this.bureauImpliques = []
    this.referenceService.listButreaus().subscribe((res)=>{
      let listBureaux = res.data
      $('#selectBureauImplique').selectpicker('refresh');
      listBureaux.forEach((value: Bureau) => {
        this.bureauImpliques.push(value)
      })
    })
  }


  onSave_() {

    Swal.fire({
      icon: 'success',
      html: 'Indicateur enregistré avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.location.back();
    })
  }

  onReset() {
    this.location.back();
  }

  onDivisionSelectionChange_(target: EventTarget | null) {
  }
}

