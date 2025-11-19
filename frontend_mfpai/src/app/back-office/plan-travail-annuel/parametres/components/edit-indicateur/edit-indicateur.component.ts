import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {Bureau, Division} from "../../../../../models/utilisateur";
import {ParametreService} from "../../../../../services/parametre.service";
import {ParametreResponse} from "../../../../../models/parametre-response.interface";
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

declare var $: any;

@Component({
  selector: 'app-edit-indicateur',
  templateUrl: './edit-indicateur.component.html',
  styleUrls: ['./edit-indicateur.component.css']
})
export class EditIndicateurComponent implements OnInit, AfterViewInit {

  divisionImpliques: Division[] = [];
  bureauImpliques: Bureau[] = [];
  form!: FormGroup;
  id!: string | null;
  indicateur!: ParametreResponse;




  constructor(
      private location: Location,
      private cdr: ChangeDetectorRef,
      private referenceService: ReferencesService,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private parametreService: ParametreService,
      private spinner: NgxSpinnerService
  ) { }


  ngAfterViewInit(): void {
    this.getListBureaux()
    this.getListDivisions()

  }

  listDiv: string[] = []
  listBu: string[] = []

  /**
   * rechercher indicateur
   */
  findIndicateur(){
    this.spinner.show()
    this.indicateur =  JSON.parse(sessionStorage.getItem('indicateur') ?? '');
        this.indicateur.divisions.forEach(value => {
          this.listDiv.push(value.code)
        })

        this.indicateur.bureaux.forEach(value => {
          this.listBu.push(value.code)
        })
        // sdfsd
        this.form = this.fb.group({
          divisionsImpliquees: [this.listDiv, Validators.required],
          bureauxImpliques: [this.listBu, Validators.required],
          libelle: [this.indicateur.libelle, Validators.required],
          responsableActivite: ['DRH', Validators.required],
        });

        this.spinner.hide()

  }


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('dataId')
    this.findIndicateur()
    this.getListDivisions()
    this.getListBureaux()


  }





  /**
   * enregistree indicateur
   */
  onSave() {
    if (this.form.valid) {
      const formData = this.form.value;
      let indicateur = {
        libelle: formData.libelle,
        divisionCodes: formData.divisionsImpliquees,
        bureauCodes: formData.bureauxImpliques
      }

      this.parametreService.editParametre(indicateur, this.id!).subscribe((res)=>{
        if (res.status === 'OK'){
          // Display success message
          Swal.fire({
            icon: 'success',
            html: 'Indicateur modifié avec succès.',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.location.back();
          })
        }
      })


    } else {
      // Display error message if form is invalid
      Swal.fire({
        icon: 'error',
        title: 'Veuilez renseigner tous les champs svp.',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }


  /**
   * liste des divisions
   */
  getListDivisions(){
    this.divisionImpliques = []
    this.referenceService.listDivisions().subscribe((res)=>{
      let listDivision: Division[] = []
      listDivision = res.data
      $('#selectDivisionImplique').selectpicker('refresh');
      listDivision.forEach((value: Division) => {
        this.divisionImpliques.push(value)
      })
    })
  }

  /**
   * liste des bureaux
   */
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

  /**
   * reinitialiser les champs
   */
  onReset() {
    this.location.back();
  }
}


