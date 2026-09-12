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
  profilConnecte: any
  profile: any
  advancedSearchForm!: FormGroup;
  userInfos: any
  user!: UserDTOs;
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
    this.lookingSearchForm();

    // Ajoutez "Niveau central" à la liste des structures si nécessaire
    this.referenceService.lisStructure().subscribe(response => {
      if (response.success) {
        this.structure = response.data;
        // Vérifiez si "Niveau central" existe déjà, sinon ajoutez-le
        const hasNiveauCentral = this.structure.some((s: any) => s.code === 'NIVEAU_CENTRAL');
        if (!hasNiveauCentral) {
          this.structure.push({ code: 'NIVEAU_CENTRAL', label: 'Niveau central' });
        }
      }
    });
    
    this.referenceService.listRegion().subscribe(response => {
      if (response.success)
        this.region = response.data;
    });
  }

  lookingSearchForm() {
    this.advancedSearchForm = this.formBuilder.group({
      region: [''],
      ia: [''],
      ief: [''],
      etablissement: [''],
      specialite: [''],
      matricule: [''],
      structure: [''],
      direction: [''],
      service: [''],
      division: [''],
      bureau: ['']
    });
  }

  getUserDetail() {
    this.spinner.show()
    this.userService.getOneUser(this.userInfos.id)
      .subscribe({
        next: (data: any) => {
          this.user = data.data
          this.regionCode = this.user.region.code
          switch (this.profile) {
            case "Chef-EFF":
              this.etabCode = this.user.etablissement.code
              break
            case "Chef-cfp":
              this.etabCode = this.user.etablissement.code
              break
            case "Chef-etablissement":
              this.etabCode = this.user.etablissement.code
              break
            case "Représentant-IEF":
              this.iefCode = this.user.ief.code
              this.getListEtablissement(this.iefCode)
              break
            case "Representant-IA":
              this.iaCode = this.user.ia.code
              this.getListEF(this.iaCode)
              this.getListEtabByIA(this.iaCode)
              break
            default:
              this.isDGPEEC = true
              this.regionCode = ""
              break
          }
          this.spinner.hide()
          this.searchWithCurrentFilters()
        }
      })
  }

  onViewUser(user: any) {
    this.router.navigate([user.id, 'detail-utilisateur'], { relativeTo: this.route.parent })
  }

  onSelectChange(event: any) {
    this.selectedOption = event.target.value;
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
        if (response.status === 'OK') {
          this.directionsCentrales = response.payload;
        }
      },
      error: (error) => {
        console.error('Erreur chargement directions:', error);
      }
    });
  }

  /**
   * Charge les services d'une direction
   */
  loadServicesByDirection(directionCode: string) {
    this.referenceService.getServicesByDirection(directionCode).subscribe({
      next: (response) => {
        if (response.status === 'OK') {
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
        if (response.status === 'OK') {
          this.divisionsCentral = response.payload;
        }
      },
      error: (error) => {
        console.error('Erreur chargement divisions:', error);
      }
    });
  }

  /**
   * Charge les bureaux d'une division
   */
  loadBureausByDivision(divisionCode: string) {
    this.referenceService.getBureausByDivision(divisionCode).subscribe({
      next: (response) => {
        if (response.status === 'OK') {
          this.bureausCentral = response.payload;
        }
      },
      error: (error) => {
        console.error('Erreur chargement bureaux:', error);
      }
    });
  }

  /**
   * Méthode générique pour rechercher avec tous les filtres actuels
   */
  searchWithCurrentFilters(): void {
    this.spinner.show();
    
    // Récupérer les valeurs actuelles des filtres
    const formValues = this.advancedSearchForm.value;
    
    // Déterminer quel type de recherche effectuer
    if (this.isNiveauCentral) {
      // Recherche niveau central
      const params = {
        page: this.page - 1,
        size: this.pageSize,
        direction: formValues.direction || '',
        service: formValues.service || '',
        division: formValues.division || '',
        bureau: formValues.bureau || ''
      };
      
      this.userService.getPersonnelNiveauCentral(params).subscribe({
        next: (response) => {
          if (response?.status === 'OK') {
            this.userList = response?.payload || [];
            this.collectionSize = response?.metadata?.totalElements || 0;
          } else {
            this.userList = [];
            this.collectionSize = 0;
          }
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Erreur recherche:', error);
          this.userList = [];
          this.collectionSize = 0;
          this.spinner.hide();
        }
      });
    } else {
      // Recherche niveau déconcentré
      this.regionCode = formValues.region || '';
      this.iaCode = formValues.ia || '';
      this.iefCode = formValues.ief || '';
      this.structureCode = formValues.structure || '';
      this.etabCode = formValues.etablissement || '';
      
      this.userService.getAllPersonnel(
        this.page - 1,
        this.pageSize,
        this.regionCode,
        this.structureCode,
        this.iaCode,
        this.iefCode,
        this.etabCode
      ).subscribe(data => {
        if (data?.status === 'OK') {
          this.userList = data?.payload;
          this.collectionSize = data.metadata?.totalElements ?? 0;
        } else {
          this.userList = [];
          this.collectionSize = 0;
        }
        this.spinner.hide();
      });
    }
  }

  /**
   * Changement de région
   */
  onRegionChange(code: string): void {
    this.regionCode = code;
    // Réinitialiser les filtres dépendants
    this.advancedSearchForm.patchValue({
      ia: '',
      ief: '',
      etablissement: ''
    });
    this.iaCode = '';
    this.iefCode = '';
    this.etabCode = '';
    
    // Charger les IA de cette région
    if (code) {
      this.referenceService.listIAByCode(code).subscribe(response => {
        if (response.success) {
          this.ia = response.data;
        }
      });
    } else {
      this.ia = [];
      this.ief = [];
      this.etablissement = [];
    }
    
    // Réinitialiser la pagination et rechercher
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Changement de IA
   */
  onIAChange(code: string): void {
    this.iaCode = code;
    // Réinitialiser les filtres dépendants
    this.advancedSearchForm.patchValue({
      ief: '',
      etablissement: ''
    });
    this.iefCode = '';
    this.etabCode = '';
    
    // Charger les IEF de cette IA
    if (code) {
      this.referenceService.listIEFByCode(code).subscribe(response => {
        if (response.success) {
          this.ief = response.data;
        }
      });
      
      // Charger les établissements de cette IA
      this.referenceService.listEtablissementByIACode(code).subscribe(response => {
        if (response.success) {
          this.etablissement = response.data;
        }
      });
    } else {
      this.ief = [];
      this.etablissement = [];
    }
    
    // Réinitialiser la pagination et rechercher
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Changement de IEF
   */
  onIEFChange(code: string): void {
    this.iefCode = code;
    // Réinitialiser le filtre établissement
    this.advancedSearchForm.patchValue({
      etablissement: ''
    });
    this.etabCode = '';
    
    // Charger les établissements de cet IEF
    if (code) {
      this.referenceService.listEtablissementByCode(code).subscribe(response => {
        if (response.success) {
          this.etablissement = response.data;
        }
      });
    } else {
      this.etablissement = [];
    }
    
    // Réinitialiser la pagination et rechercher
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Changement d'établissement
   */
  onEtablissementChange(code: string): void {
    this.etabCode = code;
    // Réinitialiser la pagination et rechercher
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Changement de structure
   */
  getStruct(code: any) {
    if (code) {
      if (code === 'NIVEAU_CENTRAL') {
        // Activer le mode niveau central
        this.isNiveauCentral = true;
        
        // Réinitialiser les filtres déconcentrés
        this.advancedSearchForm.patchValue({
          region: '',
          ia: '',
          ief: '',
          etablissement: ''
        });
        
        // Réinitialiser les variables
        this.regionCode = '';
        this.iaCode = '';
        this.iefCode = '';
        this.etabCode = '';
        this.ia = [];
        this.ief = [];
        this.etablissement = [];
        
        // Charger les directions
        this.loadDirections();
        
        // Réinitialiser les filtres niveau central
        this.directionCentraleCode = '';
        this.serviceCode = '';
        this.divisionCode = '';
        this.bureauCode = '';
        this.servicesCentral = [];
        this.divisionsCentral = [];
        this.bureausCentral = [];
        
        // Réinitialiser la pagination et rechercher
        this.page = 1;
        setTimeout(() => {
          this.searchWithCurrentFilters();
        }, 500);
        
      } else {
        // Mode déconcentré
        this.isNiveauCentral = false;
        
        // Réinitialiser les filtres niveau central
        this.advancedSearchForm.patchValue({
          direction: '',
          service: '',
          division: '',
          bureau: ''
        });
        
        // Réinitialiser les variables niveau central
        this.directionCentraleCode = '';
        this.serviceCode = '';
        this.divisionCode = '';
        this.bureauCode = '';
        this.servicesCentral = [];
        this.divisionsCentral = [];
        this.bureausCentral = [];
        
        this.structureCode = code;

        // Réinitialiser la pagination et rechercher
        this.page = 1;
        this.searchWithCurrentFilters();
      }
    }
  }

  /**
   * Changement de direction (niveau central)
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
    
    // Réinitialiser les valeurs du formulaire
    this.advancedSearchForm.patchValue({
      service: '',
      division: '',
      bureau: ''
    });
    
    if (code) {
      // Charger les services de cette direction
      this.loadServicesByDirection(code);
      // Charger les divisions de cette direction
      this.loadDivisionsByDirection(code);
    }
    
    // Réinitialiser la pagination et rechercher
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Changement de service (niveau central)
   */
  onServiceChange(code: string) {
    this.serviceCode = code;
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Changement de division (niveau central)
   */
  onDivisionChange(code: string) {
    this.divisionCode = code;
    this.bureauCode = '';
    this.bureausCentral = [];
    
    // Réinitialiser la valeur du formulaire
    this.advancedSearchForm.patchValue({
      bureau: ''
    });
    
    if (code) {
      this.loadBureausByDivision(code);
    }
    
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Changement de bureau (niveau central)
   */
  onBureauChange(code: string) {
    this.bureauCode = code;
    this.page = 1;
    this.searchWithCurrentFilters();
  }

  /**
   * Recherche avec bouton Rechercher
   */
  onSearchUser() {
    this.page = 1;
    this.searchWithCurrentFilters();
    this.isSearchUser = !this.isSearchUser;
  }

  /**
   * Annuler les filtres
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
        etablissement: ''
      });
      
      // Réinitialiser les listes déroulantes
      this.ia = [];
      this.ief = [];
      this.etablissement = [];
    }
    
    this.page = 1;
    this.searchWithCurrentFilters();
    this.isSearchUser = !this.isSearchUser;
  }

  /**
   * Pagination
   */
  onPageChange(newPage: number) {
    this.page = newPage;
    this.searchWithCurrentFilters();
  }

  /**
   * Retourne la liste des en-têtes pour l'export Excel
   */
  getExportHeaders(): string[] {
    return [
      'MATRICULE', 'PRÉNOM', 'NOM', 'SEXE', 'TÉLÉPHONE', 'EMAIL',
      'DATE NAISSANCE', 'LIEU NAISSANCE', 'CNI', 'SITUATION MATRIMONIALE',
      'NATIONALITÉ', 'ADRESSE', 'CORPS', 'GRADE', 'DATE CORPS',
      'DIPLÔME ACA', 'DIPLÔME PROFESSIONNEL', 'DIPLÔME PÉDAGOGIQUE',
      'FONCTION', 'SPÉCIALITÉ', 'TYPE POSTE', 'NOMBRE ENFANTS',
      'DATE ENTREE FONCTION PUBLIQUE', 'DATE ENTREE ENSEIGNEMENT',
      'RÉGION', 'DIRECTION', 'DIVISION', 'BUREAU', 'SERVICE', 'IA', 'IEF', 'ÉTABLISSEMENT'
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

  /**
   * Export vers Excel
   */
  exportToExcel(): void {
    const filteredUsers = this.userList.filter(user => this.matchSearchQuery(user));
    
    if (filteredUsers.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    const exportRows = [];
    const headers = this.getExportHeaders();
    exportRows.push(headers);
    
    for (const user of filteredUsers) {
      const row = this.buildExportRow(user);
      exportRows.push(row);
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(exportRows);
    worksheet['!cols'] = headers.map(() => ({ wch: 22 }));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Liste_Personnel');
    
    const fileName = `Liste_Personnel_${this.getCurrentDate()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    console.log(`✅ Export réussi : ${filteredUsers.length} agents exportés`);
  }

  /**
   * Filtre de recherche par texte
   */
  matchSearchQuery(personnel: DeconectedDTO): boolean {
    const searchValue = this.searchQuery.toLowerCase();
    return Object.values(personnel).some(value =>
      value != null && value.toString().toLowerCase().includes(searchValue)
    );
  }
}