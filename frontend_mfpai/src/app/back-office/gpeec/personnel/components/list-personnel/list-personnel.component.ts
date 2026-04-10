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

    this.checkAvailableData(); // Temporaire
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

//  exportToExcel(): void {
//       console.log("ici")
//   // Cloner le tableau original
//   let element = document.getElementById('dataTables');
//      console.log("element", element);
//   if(element)
//    { element = element.cloneNode(true) as HTMLElement;
//     // Sélectionner toutes les colonnes de "Action" : la derniére colonne
//     let actionColumns = element.querySelectorAll('td:last-child, th:last-child');
    
//     // Supprimer toutes les colonnes de "Action"
//     actionColumns.forEach(col => col.remove());

//     // Convertir le tableau filtré en feuille Excel
//     const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

//     const book: XLSX.WorkBook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

//     XLSX.writeFile(book, this.name);
//   }
// }


/**
 * Retourne la liste des en-têtes pour l'export Excel
 */
getExportHeaders(): string[] {
  return [
    'MATRICULE',
    'PRÉNOM', 
    'NOM',
    'SEXE',
    'TÉLÉPHONE',
    'EMAIL',
    'DATE NAISSANCE',
    'LIEU NAISSANCE',
    'CNI',
    'SITUATION MATRIMONIALE',
    'NATIONALITÉ',
    'ADRESSE',
    'CORPS',
    'GRADE',
    'DATE CORPS',
    'DIPLÔME ACA',
    'DIPLÔME PROFESSIONNEL',
    'DIPLÔME PÉDAGOGIQUE',
    'FONCTION',
    'SPÉCIALITÉ',
    'TYPE POSTE',
    'NOMBRE ENFANTS',
    'DATE ENTREE FONCTION PUBLIQUE',
    'DATE ENTREE ENSEIGNEMENT',
    'RÉGION',
    'DIRECTION',
    'DIVISION',
    'BUREAU',
    'SERVICE',
    'IA',
    'IEF',
    'ÉTABLISSEMENT'
  ];
}

/**
 * Construit une ligne de données pour un utilisateur
 */
buildExportRow(user: any): any[] {
  return [
    user?.matricule || '',
    user?.prenom || '',
    user?.nom || '',
    user?.sexe || '',
    user?.telephone || '',
    user?.email || '',
    user?.dateNaissance || '',
    user?.lieuDeNaissance || '',
    user?.cni || '',
    user?.situationMatrimoniale || '',
    user?.nationalite || '',
    user?.adresse || '',
    user?.corpsGrade?.label || '',
    user?.grade?.label || '',
    user?.dateCorp || '',
    user?.diplomeACA?.label || '',
    user?.diplomePROF?.label || '',
    user?.diplomePED?.label || '',
    user?.fonction?.label || '',
    user?.speciality?.label || '',
    user?.typePoste?.label || '',
    user?.nombreEnfants || '',
    user?.dateDEntreeFonctionPub || '',
    user?.dateEntreEnseignement || '',
    user?.region?.label || '',
    user?.direction?.label || '',
    user?.division?.label || '',
    user?.bureau?.label || '',
    user?.service?.label || '',
    user?.ia?.label || '',
    user?.ief?.label || '',
    user?.etablissement?.label || ''
  ];
}

/**
 * Retourne la date actuelle au format YYYY-MM-DD
 */
getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

exportToExcel(): void {
  // 1. Filtrer les utilisateurs selon la recherche
  const filteredUsers = this.userList.filter(user => this.matchSearchQuery(user));
  
  // 2. Vérifier qu'il y a des données
  if (filteredUsers.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  // 3. Construire les données ligne par ligne
  const exportRows = [];
  
  // 4. Ajouter l'en-tête (1ère ligne)
  const headers = this.getExportHeaders();
  exportRows.push(headers);
  
  // 5. Ajouter les données (chaque utilisateur = 1 ligne)
  for (const user of filteredUsers) {
    const row = this.buildExportRow(user);
    exportRows.push(row);
  }
  
  // 6. Créer la feuille Excel
  const worksheet = XLSX.utils.aoa_to_sheet(exportRows);
  
  // 7. Ajuster la largeur des colonnes
  worksheet['!cols'] = headers.map(() => ({ wch: 22 }));
  
  // 8. Créer et sauvegarder le fichier
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Liste_Personnel');
  
  const fileName = `Liste_Personnel_${this.getCurrentDate()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  // 9. Confirmation
  console.log(`✅ Export réussi : ${filteredUsers.length} agents exportés`);
}

matchSearchQuery(personnel: DeconectedDTO): boolean {
  const searchValue = this.searchQuery.toLowerCase();  
  return( Object.values(personnel).some(value =>
      value != null && value.toString().toLowerCase().includes(searchValue)
  ) )
}
// Méthode de diagnostic - À supprimer après vérification
checkAvailableData() {
  if (this.userList.length > 0) {
    const sampleUser = this.userList[0];
    console.log('📊 Données disponibles pour l\'export :');
    console.log('- Matricule:', sampleUser.matricule);
    console.log('- Prénom/Nom:', sampleUser.prenom, sampleUser.nom);
    console.log('- Corps/Grade:', sampleUser.corpsGrade?.label, sampleUser.grade?.label);
    console.log('- Spécialité:', sampleUser.speciality?.label);
    console.log('- Téléphone:', sampleUser.telephone);
    console.log('- Email:', sampleUser.email);
    console.log('- Région:', sampleUser.region?.label);
    console.log('- IA:', sampleUser.ia?.label);
    console.log('- IEF:', sampleUser.ief?.label);
    console.log('- Établissement:', sampleUser.etablissement?.label);
    // console.log('- Direction:', sampleUser.direction?.label);
    console.log('- Objet complet:', sampleUser);
  } else {
    console.log('Aucune donnée à exporter');
  }
}





}


