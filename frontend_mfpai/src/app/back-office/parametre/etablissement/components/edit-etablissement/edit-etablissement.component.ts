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
  structure: any;
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
    console.log(this.etabtId);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    // Chargement des listes
    this.referenceService.listRegion().subscribe(response => {
      if (response.success) {
        this.region = response.data;
        // Après chargement des régions, charger l'établissement
        this.getEtablissement(this.etabtId);
      }
    });

    this.referenceService.lisStructure().subscribe(response => {
      if(response.success) {
        this.structure = response.data;
      }
    });

    this.referenceService.lisTypeEtablissement().subscribe(response => {
      if(response.success) {
        this.typeEtablissement = response.data;
      }
    });

    // CORRECTION : Formulaire avec des contrôles simples au lieu de FormGroup imbriqués
    this.etablissementForm = this.formBuilder.group({
      structure: ['', Validators.required],
      region: [''],
      ia: [''],
      typeEtablissement: [''],
      ief: [''],
      code: ['', Validators.required],
      label: ['', Validators.required],
    });
  }

  getEtablissement(id: any) {
    if(!id) return;
    
    this.spinner.show();
    this.parametreService.getEtablissment(id).subscribe(response => {
      if (response.success) {
        this.etablissementData = response.data;
        console.log('Données chargées:', this.etablissementData);

        // CORRECTION : Patch des valeurs dans le formulaire
        this.etablissementForm.patchValue({
          structure: this.etablissementData?.structure?.code || '',
          region: this.etablissementData?.region?.code || '',
          ia: this.etablissementData?.ia?.code || '',
          typeEtablissement: this.etablissementData?.typeEtablissement?.code || '',
          ief: this.etablissementData?.ief?.code || '',
          code: this.etablissementData?.code || '',
          label: this.etablissementData?.label || ''
        });

        // Charger les listes dépendantes APRÈS le patch
        if(this.etablissementData?.structure?.code === 'IA') {
          // Charger les IA si région existe
          if(this.etablissementData?.region?.code) {
            this.getListIA(this.etablissementData.region.code);
          }
          
          // Charger les IEF si IA existe
          if(this.etablissementData?.ia?.code) {
            this.getListEF(this.etablissementData.ia.code);
          }
          
          // Charger la liste des établissements si nécessaire
          if(this.etablissementData?.ia?.code) {
            this.getStruct(this.etablissementData.structure.code);
            this.getListEtabByIA(this.etablissementData.ia.code);
          }
        } else if(this.etablissementData?.structure?.code === 'MIN') {
          this.getStruct(this.etablissementData.structure.code);
        }
        
        this.spinner.hide();
      } else {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          html: 'Impossible de charger les données de l\'établissement',
          showConfirmButton: true,
        });
      }
    }, error => {
      this.spinner.hide();
      console.error('Erreur chargement:', error);
      Swal.fire({
        icon: 'error',
        html: 'Erreur lors du chargement des données',
        showConfirmButton: true,
      });
    });
  }

  getStruct(code: any) {
    if(code) {
      this.spinner.show();
      this.referenceService.listEtablissementByEFFCode(code)
          .subscribe(response => {
            if (response.success) {
              this.etablissement = response.data;
            }
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          });
    }
  }

  getListIA(code: any): void {
    if(code) {
      this.spinner.show();
      this.referenceService.listIAByCode(code)
          .subscribe(response => {
            if (response.success) {
              this.iA = response.data;
            }
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          });
    }
  }

  getListEF(code: any): void {
    console.log('getListEF appelé avec code:', code);
    if(code) {
      this.codeIA = code;
      this.referenceService.listIEFByCode(code)
          .subscribe(response => {
            if (response.success) {
              this.iEF = response.data;
              console.log('IEF chargés:', this.iEF);
            }
          });
    }
  }

  getListEtabByIA(code: any): void {
    if(code) {
      this.spinner.show();
      this.referenceService.listEtablissementByIACode(code)
          .subscribe(response => {
            if (response.success) {
              this.etablissement = response.data;
            }
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          });
    }
  }

  // CORRECTION : Méthode pour gérer le changement de structure
  onStructureChange(code: string) {
    if(code === 'IA') {
      // Réinitialiser certains champs si nécessaire
      this.etablissementForm.patchValue({
        region: '',
        ia: '',
        typeEtablissement: '',
        ief: ''
      });
    } else if(code === 'MIN') {
      this.etablissementForm.patchValue({
        region: '',
        ia: '',
        typeEtablissement: '',
        ief: ''
      });
    }
  }

  // CORRECTION : Méthode pour gérer le changement de région
  onRegionChange(code: string) {
    if(code) {
      this.getListIA(code);
      // Réinitialiser IA et IEF
      this.etablissementForm.patchValue({
        ia: '',
        ief: ''
      });
      this.iEF = [];
    }
  }

  // CORRECTION : Méthode pour gérer le changement d'IA
  onIaChange(code: string) {
    if(code) {
      this.getListEF(code);
      this.getListEtabByIA(code);
      // Réinitialiser IEF
      this.etablissementForm.patchValue({
        ief: ''
      });
    }
  }

  // CORRECTION : Méthode pour la modification (UPDATE)
  onSave() {
    // Vérifier si c'est une modification ou un ajout
    if(this.etabtId) {
      this.updateEtablissement();
    } else {
      this.createEtablissement();
    }
  }

  createEtablissement() {
    let formData = {
      structure: this.etablissementForm.value.structure ? {code: this.etablissementForm.value.structure} : null,
      region: this.etablissementForm.value.region ? {code: this.etablissementForm.value.region} : null,
      ia: this.etablissementForm.value.ia ? {code: this.etablissementForm.value.ia} : null,
      typeEtablissement: this.etablissementForm.value.typeEtablissement ? {code: this.etablissementForm.value.typeEtablissement} : null,
      ief: this.etablissementForm.value.ief ? {code: this.etablissementForm.value.ief} : null,
      label: this.etablissementForm.value.label,
      code: this.etablissementForm.value.code
    };

    console.log('Données à créer:', formData);

    this.parametreService.addEtablissement(formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: 'Établissement enregistré avec succès.',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.location.back();
        });
      },
      error: (error) => {
        this.parametreService.showSwal('error', error?.error?.message);
      }
    });
  }

  // CORRECTION : Méthode séparée pour la modification
  updateEtablissement() {
    let formData = {
      id: this.etabtId, // Ajouter l'ID pour la modification
      structure: this.etablissementForm.value.structure ? {code: this.etablissementForm.value.structure} : null,
      region: this.etablissementForm.value.region ? {code: this.etablissementForm.value.region} : null,
      ia: this.etablissementForm.value.ia ? {code: this.etablissementForm.value.ia} : null,
      typeEtablissement: this.etablissementForm.value.typeEtablissement ? {code: this.etablissementForm.value.typeEtablissement} : null,
      ief: this.etablissementForm.value.ief ? {code: this.etablissementForm.value.ief} : null,
      label: this.etablissementForm.value.label,
      code: this.etablissementForm.value.code
    };

    console.log('Données à modifier:', formData);

    // Utiliser la méthode de modification au lieu d'addEtablissement
    this.parametreService.updateEtablissement(this.etabtId, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: 'Établissement modifié avec succès.',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.location.back();
        });
      },
      error: (error) => {
        this.parametreService.showSwal('error', error?.error?.message);
      }
    });
  }

  // Méthode pour annuler
  onCancel() {
    this.location.back();
  }
}
