import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { DeconectedDTO } from 'src/app/models/utilisateur';
import { CredentialsService } from 'src/app/services/credentials.service';
import { ReferencesService } from 'src/app/services/references.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-list-personnel',
  templateUrl: './list-personnel.component.html',
  styleUrls: ['./list-personnel.component.css']
})
export class ListPersonnelComponent implements OnInit {

  headers: string[] = ['Matricule', 'Prénom', 'Nom', 'Corps', 'Grade', 'Spécialité', 'Action'];
  page = 1;
  pageSize = 10;

  userList: DeconectedDTO[] = [];
  collectionSize = 0;
  
  selectedOption: string = '';
  isSearchUser = false;
   structure: any;
   region: any;
   ief: any;
   ia: any;
   etablissement: any;
   regionCode = ""
   iaCode = ""
   iefCode = ""
   structureCode = ""
   etabCode = ""
   alertService: any;
   profilConnecte :any
   profile : any
  advancedSearchForm!: FormGroup;
  userInfos : any
  user !: UserDTOs;
  isDGPEEC = false;
  name = 'listePersonnels.xlsx';
  searchQuery = ""

   // Données pour les selects du niveau central
  directionsCentrales: any[] = [];
  servicesCentral: any[] = [];
  divisionsCentral: any[] = [];
  bureausCentral: any[] = [];

  // Codes sélectionnés pour le niveau central
  directionCentraleCode = "";
  serviceCode = "";
  divisionCode = "";
  bureauCode = "";

  // Flag pour savoir si on est en mode recherche niveau central
  isNiveauCentral = false;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UtilisateurService,
    private spinner: NgxSpinnerService,
    private referenceService: ReferencesService,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService
  ) {
    this.userInfos = this.credentialsService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profile = this.profilConnecte[0].code
 
   }

  ngOnInit(): void {
    this.getUserDetail()
    this.listPersonnel()
    this.lookingSearchForm();

     // Ajoutez "Niveau central" à la liste des structures si nécessaire
    this.referenceService.lisStructure().subscribe(response => {
      if(response.success) {
        this.structure = response.data;
        // Vérifiez si "Niveau central" existe déjà, sinon ajoutez-le
        const hasNiveauCentral = this.structure.some((s: any) => s.code === 'NIVEAU_CENTRAL');
        if (!hasNiveauCentral) {
          this.structure.push({ code: 'NIVEAU_CENTRAL', label: 'Niveau central' });
        }
      }
    });
    
    this.referenceService.listRegion().subscribe(response => {
      if(response.success)
          this.region = response.data;
     });

    this.referenceService.lisStructure().subscribe(response => {
        if(response.success)
            this.structure = response.data;

    });
  }

  lookingSearchForm(){
    this.advancedSearchForm = this.formBuilder.group({
        region:  [''],
        ia:  [''],
        ief:  [''],
        etablissement:  [''],
        specialite:  [''],
        matricule:  [''],
        structure:  [''],
      // ⬇️⬇️⬇️ NOUVEAUX CHAMPS ⬇️⬇️⬇️
        direction: [''],
        service: [''],
        division: [''],
        bureau: ['']

    });
}

getUserDetail(){
  this.spinner.show()
  this.userService.getOneUser(this.userInfos.id)
                   .subscribe({
                    next : (data : any) =>{
                        this.user = data.data
                        this.regionCode = this.user.region.code
                        switch(this.profile){
                         case  "Chef-EFF" :
                                this.etabCode = this.user.etablissement.code
                                break
                          case  "Chef-cfp" :

                                this.etabCode = this.user.etablissement.code

                                break
                          case  "Chef-etablissement" :
                            case  "Chef-etablissement" :
                              case  "Chef-etablissement" :
                              this.etabCode = this.user.etablissement.code
                              break
                          case "Représentant-IEF" :
                            this.iefCode = this.user.ief.code
                            this.getListEtablissement(this.iefCode)
                            break
                          case "Representant-IA" :
                            this.iaCode = this.user.ia.code 
                            this.getListEF(this.iaCode)
                            this.getListEtabByIA(this.iaCode)
                            break
                          default :
                            this.isDGPEEC = true 
                            this.regionCode = ""
                            break
                    
                        }
                        this.spinner.hide()
                        this.listPersonnel()
                    }
                   })
}

  onViewUser(user: any) {
    this.router.navigate([user.id, 'detail-utilisateur'], { relativeTo: this.route.parent })
  }

  onSelectChange(event: any) {
    this.selectedOption = event.target.value;
  }

  listPersonnel(){
    this.userService.getAllPersonnel(this.page-1, this.pageSize, this.regionCode, this.structureCode, this.iaCode, this.iefCode, this.etabCode)
    .subscribe(data => {
    if (data?.status === 'OK') {

      this.userList = data?.payload;
      this.spinner.hide();
      this.collectionSize = data.metadata?.totalElements ?? 0
      this.pageSize = data.metadata?.size ?? 0

      } else {
      this.alertService.showAlert({status: data?.status, message: data?.message, titre: 'personnels'});
      }
      });

    }
  //   getStruct(code: any) {
  //     if(code) {
  //         this.spinner.show()
  //         this.referenceService.listEtablissementByEFFCode(code)
  //             .subscribe(response => {

  //                 if (response.success) {
  //                     this.etablissement = response.data;
  //                     this.spinner.hide()
  //                 }
  //             });

  //         this.spinner.hide()
  //     }
  // }

  /**
   * Méthode appelée quand on change la structure (IA/Ministere/Niveau central)
   */
  getStruct(code: any) {
    if(code) {
      if (code === 'NIVEAU_CENTRAL') {
        // Activer le mode niveau central
        this.isNiveauCentral = true;
        // Charger les directions
        this.loadDirections();
        // Réinitialiser les filtres déconcentrés
        this.advancedSearchForm.patchValue({
          region: '',
          ia: '',
          ief: '',
          etablissement: ''
        });
        // Réinitialiser les variables
        this.directionCentraleCode = '';
        this.serviceCode = '';
        this.divisionCode = '';
        this.bureauCode = '';
      } else {
        // Mode déconcentré
        this.isNiveauCentral = false;
        if(code === 'MIN') {
          this.loadEtablissementsByEFF(code);
        }
      }
    }
  }
  getListEtablissement(code: any): void {

    this.referenceService.listEtablissementByCode(code)
        .subscribe(response => {

            if (response.success) {
                this.etablissement = response.data;
            }
        });
}

getListIA(code: any): void {

  this.referenceService.listIAByCode(code)
      .subscribe(response => {

          if (response.success) {
              this.ia = response.data;
          }
      });
}

getListEF(code: any): void {

  //his.codeIA = code;
  this.referenceService.listIEFByCode(code)
      .subscribe(response => {

          if (response.success) {

              this.ief = response.data;
          }
      });
}


getListEtabByIA(code: any): void {

  this.referenceService.listEtablissementByIACode(code)
      .subscribe(response => {

          if (response.success) {
              this.etablissement = response.data;
          }
      });
}

 /**
   * Charge la liste des directions centrales
   */
  loadDirections() {
    this.referenceService.getDirections().subscribe({
      next: (response) => {
        if(response.status === 'OK') {
          this.directionsCentrales = response.payload;
        }
      },
      error: (error) => {
        console.error('Erreur chargement directions:', error);
      }
    });
  }

loadEtablissementsByEFF(code: any): void {
  this.referenceService.listEtablissementByEFFCode(code)
      .subscribe(response => {

          if (response.success) {
              this.etablissement = response.data;
          }
      });
}


/**
   * Quand on sélectionne une direction
   */
  onDirectionChange(code: string) {
    this.directionCentraleCode = code;
    this.serviceCode = '';
    this.divisionCode = '';
    this.bureauCode = '';
    
    // Réinitialiser les listes dépendantes
    this.servicesCentral = [];
    this.divisionsCentral = [];
    this.bureausCentral = [];
    
    if(code) {
      // Charger les services de cette direction
      this.loadServicesByDirection(code);
      // Charger les divisions de cette direction
      this.loadDivisionsByDirection(code);
      // Rechercher le personnel
      this.searchCentralLevelPersonnel();
    }
  }

  /**
   * Charge les services d'une direction
   */
  loadServicesByDirection(directionCode: string) {
    this.referenceService.getServicesByDirection(directionCode).subscribe({
      next: (response) => {
        if(response.status === 'OK') {
          this.servicesCentral = response.payload;
        }
      },
      error: (error) => {
        console.error('Erreur chargement services:', error);
      }
    });
  }

  /**
   * Charge les divisions d'une direction
   */
  loadDivisionsByDirection(directionCode: string) {
    this.referenceService.getDivisionsByDirection(directionCode).subscribe({
      next: (response) => {
        if(response.status === 'OK') {
          this.divisionsCentral = response.payload;
        }
      },
      error: (error) => {
        console.error('Erreur chargement divisions:', error);
      }
    });
  }

  /**
   * Quand on sélectionne un service
   */
  onServiceChange(code: string) {
    this.serviceCode = code;
    this.searchCentralLevelPersonnel();
  }

  /**
   * Quand on sélectionne une division
   */
  onDivisionChange(code: string) {
    this.divisionCode = code;
    this.bureauCode = '';
    this.bureausCentral = [];
    
    if(code) {
      this.loadBureausByDivision(code);
      this.searchCentralLevelPersonnel();
    }
  }

  /**
   * Charge les bureaux d'une division
   */
  loadBureausByDivision(divisionCode: string) {
    this.referenceService.getBureausByDivision(divisionCode).subscribe({
      next: (response) => {
        if(response.status === 'OK') {
          this.bureausCentral = response.payload;
        }
      },
      error: (error) => {
        console.error('Erreur chargement bureaux:', error);
      }
    });
  }

  /**
   * Quand on sélectionne un bureau
   */
  onBureauChange(code: string) {
    this.bureauCode = code;
    this.searchCentralLevelPersonnel();
  }

  /**
   * Recherche le personnel du niveau central
   */
  searchCentralLevelPersonnel() {
    this.spinner.show();
    this.page = 1;
    
    const params = {
      page: this.page - 1,
      size: this.pageSize,
      direction: this.directionCentraleCode,
      service: this.serviceCode,
      division: this.divisionCode,
      bureau: this.bureauCode
    };
    
    this.userService.getPersonnelNiveauCentral(params).subscribe({
      next: (response) => {
        if(response?.status === 'OK') {
          this.userList = response?.payload || [];
          this.collectionSize = response?.metadata?.totalElements || 0;
        } else {
          this.userList = [];
          this.collectionSize = 0;
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur recherche niveau central:', error);
        this.userList = [];
        this.collectionSize = 0;
        this.spinner.hide();
      }
    });
  }

  /**
   * Surcharge de onSearchUser
   */
  onSearchUser() {
    if (this.isNiveauCentral) {
      // Récupérer les valeurs du formulaire pour niveau central
      this.directionCentraleCode = this.advancedSearchForm.value['direction'];
      this.serviceCode = this.advancedSearchForm.value['service'];
      this.divisionCode = this.advancedSearchForm.value['division'];
      this.bureauCode = this.advancedSearchForm.value['bureau'];
    } else {
      // Logique existante pour niveau déconcentré
      this.regionCode = this.advancedSearchForm.value['region'];
      this.iaCode = this.advancedSearchForm.value['ia'];
      this.iefCode = this.advancedSearchForm.value['ief'];
      this.structureCode = this.advancedSearchForm.value['structure'];
      this.etabCode = this.advancedSearchForm.value['etablissement'];
    }
    
    this.page = 1;
    this.listPersonnel();
    this.isSearchUser = !this.isSearchUser;
  }

  /**
   * Surcharge de onCancel
   */
  onCancel() {
    if (this.isNiveauCentral) {
      // Réinitialiser les filtres niveau central
      this.directionCentraleCode = '';
      this.serviceCode = '';
      this.divisionCode = '';
      this.bureauCode = '';
      this.servicesCentral = [];
      this.divisionsCentral = [];
      this.bureausCentral = [];
      
      this.advancedSearchForm.patchValue({
        direction: '',
        service: '',
        division: '',
        bureau: ''
      });
    } else {
      // Réinitialiser les filtres niveau déconcentré
      this.regionCode = '';
      this.iaCode = '';
      this.iefCode = '';
      this.structureCode = '';
      this.etabCode = '';
      
      this.advancedSearchForm.patchValue({
        region: '',
        ia: '',
        ief: '',
        struktur: '',
        etablissement: ''
      });
    }
    this.isSearchUser = !this.isSearchUser;
  }

// exportToExcel(): void {
//    let element = document.getElementById('dataTables');

//    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

//    const book: XLSX.WorkBook = XLSX.utils.book_new();
//    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

//    XLSX.writeFile(book, this.name);
//  }


 exportToExcel(): void {
      console.log("ici")
  // Cloner le tableau original
  let element = document.getElementById('dataTables');
     console.log("element", element);
  if(element)
   { element = element.cloneNode(true) as HTMLElement;
    // Sélectionner toutes les colonnes de "Action" : la derniére colonne
    let actionColumns = element.querySelectorAll('td:last-child, th:last-child');
    
    // Supprimer toutes les colonnes de "Action"
    actionColumns.forEach(col => col.remove());

    // Convertir le tableau filtré en feuille Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }
}

matchSearchQuery(personnel: DeconectedDTO): boolean {
  const searchValue = this.searchQuery.toLowerCase();  
  return( Object.values(personnel).some(value =>
      value != null && value.toString().toLowerCase().includes(searchValue)
  ) )
}

}


