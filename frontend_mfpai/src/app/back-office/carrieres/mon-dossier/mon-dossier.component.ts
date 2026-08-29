import { Component, OnInit } from '@angular/core';
import { DossierAgentService } from '../services/dossier-agent/dossier-agent.service';
import { DossierAgent } from '../models/dossier-agent/dossier-agent';
import { Diplome } from '../models/dossier-agent/diplome';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EtatCivil } from '../models/dossier-agent/etatCivil';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from "../../../services/credentials.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mon-dossier',
  templateUrl: './mon-dossier.component.html',
  styleUrls: ['./mon-dossier.component.css']
})
export class MonDossierComponent implements OnInit {

  headersSituation!: string[];
  headersDiplome!: string[];
  headersEtatCivile: string[] = ["Nom fichier", 'Fichier'];
  page = 1;
  pageSize = 10;
  collectionSize1 = 0;
  collectionSize2 = 0;
  collectionSize3 = 0;
  situationList: any[] = [];
  diplomeList: Diplome[] = [];
  collapsed: boolean = false;
  utilisateur: any;
  matricule!: string;
  dossier: any = null;
  apiUrl: string = environment.apiUrl;
  searchTextDiplome: any;
  searchTextAvancement: any;
  EtatCivilList: EtatCivil[] = [];
  idDossier: any;
  idDossierUser: any = null;
  userInfos: any;

  hasDossier = false;
  canCreateDossier = false;
  message = '';
  error = false;
  isLoading = true;

   // Nouvelle propriété pour savoir si c'est le dossier personnel ou un autre
  isPersonalDossier = true;  // true = "Mon dossier", false = "Dossier d'un autre agent"
  viewedAgentName = '';
  previewUrl: string | null = null;
  previewSafeUrl: SafeResourceUrl | null = null;
  previewName = '';
  previewType = '';

  constructor(
    private dossierAgentService: DossierAgentService,
    private _httpClient: HttpClient,
    private credentialsService: CredentialsService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.headersSituation = ["Numéro Acte", "Date acte", "Type acte", "acte", "Pièce jointes"];
    this.headersDiplome = ["Date d'obtention", "Nom diplôme", "Pièces jointes"];
    this.refreshData();
    
  //   // Récupérer l'ID depuis queryParams
  //   this.route.queryParams.subscribe(params => {
  //     const dossierId = params['id'];
  //     console.log("ID récupéré depuis queryParams:", dossierId);
  //     if (dossierId) {
  //       this.idDossierUser = dossierId;
  //     }
  //     this.loadDossier();
  //   });
  // }

  // Vérifier si un paramètre idDossier est présent dans l'URL
    this.route.params.subscribe(params => {
      const dossierId = params['idDossier'];
      console.log("Paramètre idDossier:", dossierId);
      
      if (dossierId) {
        // C'est la consultation du dossier d'un autre agent
        this.isPersonalDossier = false;
        this.loadOtherUserDossier(dossierId);
      } else {
        // C'est le dossier personnel de l'utilisateur connecté
        this.isPersonalDossier = true;
        this.loadPersonalDossier();
      }
    });
  }

  // loadDossier() {
  //   this.spinner.show();
  //   this.isLoading = true;
    
  //   // Si un ID de dossier est passé en paramètre
  //   if (this.idDossierUser) {
  //     console.log("📁 Chargement du dossier spécifique avec ID:", this.idDossierUser);
      
  //     this.dossierAgentService.get(this.idDossierUser).subscribe({
  //       next: (response: any) => {
  //         console.log("✅ Réponse du serveur (dossier spécifique):", response);
          
  //         if (response && response.payload) {
  //           this.hasDossier = true;
  //           this.canCreateDossier = false;
  //           this.dossier = response.payload;
  //           this.utilisateur = response.payload.utilisateur;
  //           this.situationList = response.payload.situationAdministrative || [];
  //           this.matricule = response.payload.utilisateur?.matricule;
  //           this.EtatCivilList = response.payload.etatCivil || [];
  //           this.diplomeList = response.payload.diplomes || [];
            
  //           this.collectionSize2 = this.diplomeList.length;
  //           this.collectionSize1 = this.situationList.length;
  //           this.collectionSize3 = this.EtatCivilList.length;
            
  //           this.message = 'Dossier chargé avec succès';
  //         } else {
  //           this.hasDossier = false;
  //           this.message = 'Dossier non trouvé';
  //         }
          
  //         this.isLoading = false;
  //         this.spinner.hide();
  //       },
  //       error: (err) => {
  //         console.error("❌ Erreur:", err);
  //         this.isLoading = false;
  //         this.spinner.hide();
  //         this.error = true;
  //         this.hasDossier = false;
  //         this.message = err?.error?.message || 'Erreur lors du chargement du dossier';
  //         this.dossierAgentService.showSwal('error', this.message);
  //       }
  //     });
  //   } else {
  //     // Sinon charger le dossier de l'utilisateur connecté
  //     console.log("👤 Chargement du dossier de l'utilisateur connecté");
      
  //     this.dossierAgentService.getDossierCurrentUser().subscribe({
  //       next: (response: any) => {
  //         console.log("✅ Réponse (dossier courant):", response);
  //         const data = response.data;
          
  //         this.hasDossier = data?.hasDossier || false;
  //         this.canCreateDossier = data?.canCreateDossier || false;
  //         this.message = response.message || '';
          
  //         if (this.hasDossier && data) {
  //           this.dossier = data;
  //           this.utilisateur = data.utilisateur;
  //           this.situationList = data.situationAdministrative || [];
  //           this.matricule = data.utilisateur?.matricule;
  //           this.EtatCivilList = data.etatCivil || [];
  //           this.diplomeList = data.diplomes || [];
            
  //           this.collectionSize2 = this.diplomeList.length;
  //           this.collectionSize1 = this.situationList.length;
  //           this.collectionSize3 = this.EtatCivilList.length;
  //         }
          
  //         this.isLoading = false;
  //         this.spinner.hide();
  //       },
  //       error: (err) => {
  //         console.error("❌ Erreur:", err);
  //         this.isLoading = false;
  //         this.spinner.hide();
  //         this.error = true;
  //         this.message = err?.error?.message || 'Erreur lors du chargement de votre dossier';
  //         this.dossierAgentService.showSwal('error', this.message);
  //       }
  //     });
  //   }
  // }

  // Charger le dossier personnel de l'utilisateur connecté
  loadPersonalDossier() {
    this.spinner.show();
    this.isLoading = true;
    
    console.log("👤 Chargement du dossier personnel");
    
    this.dossierAgentService.getDossierCurrentUser().subscribe({
      next: (response: any) => {
        console.log("✅ Réponse dossier personnel:", response);
        const data = response.data;
        
        this.hasDossier = Boolean(data?.id && data.id !== 0);
        this.canCreateDossier = !this.hasDossier;
        this.message = response.message || '';
        
        if (this.hasDossier && data) {
          this.dossier = data;
          this.utilisateur = data.utilisateur;
          this.situationList = data.situationAdministrative || [];
          this.matricule = data.utilisateur?.matricule;
          this.EtatCivilList = data.etatCivil || [];
          this.diplomeList = data.diplomes || [];
          
          this.collectionSize2 = this.diplomeList.length;
          this.collectionSize1 = this.situationList.length;
          this.collectionSize3 = this.EtatCivilList.length;
        }
        
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error("❌ Erreur:", err);
        this.isLoading = false;
        this.spinner.hide();
        this.error = true;
        this.message = err?.error?.message || 'Erreur lors du chargement de votre dossier';
        this.dossierAgentService.showSwal('error', this.message);
      }
    });
  }

  // Charger le dossier d'un autre agent par son ID
  loadOtherUserDossier(dossierId: number) {
    this.spinner.show();
    this.isLoading = true;
    
    console.log("📁 Chargement du dossier spécifique ID:", dossierId);
    
    this.dossierAgentService.get(dossierId).subscribe({
      next: (response: any) => {
        console.log("✅ Réponse dossier spécifique:", response);
        
        if (response && response.payload) {
          this.hasDossier = true;
          this.canCreateDossier = false; // Ne pas permettre la modification du dossier d'un autre
          this.dossier = response.payload;
          this.utilisateur = response.payload.utilisateur;
          this.situationList = response.payload.situationAdministrative || [];
          this.matricule = response.payload.utilisateur?.matricule;
          this.EtatCivilList = response.payload.etatCivil || [];
          this.diplomeList = response.payload.diplomes || [];
          
          // Nom de l'agent pour l'affichage
          this.viewedAgentName = `${this.utilisateur?.prenom} ${this.utilisateur?.nom}`;
          
          this.collectionSize2 = this.diplomeList.length;
          this.collectionSize1 = this.situationList.length;
          this.collectionSize3 = this.EtatCivilList.length;
          
          this.message = 'Dossier chargé avec succès';
        } else {
          this.hasDossier = false;
          this.message = 'Dossier non trouvé';
        }
        
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error("❌ Erreur:", err);
        this.isLoading = false;
        this.spinner.hide();
        this.error = true;
        this.hasDossier = false;
        this.message = err?.error?.message || 'Erreur lors du chargement du dossier';
        this.dossierAgentService.showSwal('error', this.message);
      }
    });
  }

  getDiplomes() {
    if (this.matricule) {
      this.dossierAgentService.getDiplomes(this.matricule, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.diplomeList = res.data[0];
          this.collectionSize2 = res.data[0].length;
        }
      });
    }
  }

  Telecharger(filename: string) {
    if (!filename) return;
    
    this._httpClient.get(`${this.apiUrl}file/download/${filename}`, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${localStorage.getItem("Token")}`
      },
      responseType: 'blob'
    }).subscribe(
      (response: Blob) => {
        const blobUrl = URL.createObjectURL(response);
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.href = blobUrl;
        anchor.download = filename;
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      },
      (error) => console.error(error)
    );
  }

  visualiser(pieceJointe: any): void {
    const filename = pieceJointe?.generatedName;
    if (!filename) {
      return;
    }

    this.closePreview();
    this._httpClient.get(`${this.apiUrl}file/download/${filename}`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${localStorage.getItem('Token')}`
      },
      responseType: 'blob'
    }).subscribe({
      next: (response: Blob) => {
        this.previewUrl = URL.createObjectURL(response);
        this.previewSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
        this.previewName = pieceJointe.originalName || filename;
        this.previewType = response.type || pieceJointe.fileType || '';
      },
      error: (err) => {
        console.error(err);
        this.dossierAgentService.showSwal('error', 'Impossible d’ouvrir ce document.');
      }
    });
  }

  closePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.previewSafeUrl = null;
    this.previewName = '';
    this.previewType = '';
  }

  isImagePreview(): boolean {
    return this.previewType.startsWith('image/');
  }

  isPreviewSupported(): boolean {
    return this.isImagePreview()
      || this.previewType === 'application/pdf'
      || this.previewType.startsWith('text/');
  }

  getFileExtension(pieceJointe: any): string {
    const name = pieceJointe?.originalName || pieceJointe?.generatedName || '';
    const extension = name.includes('.') ? name.split('.').pop() : 'DOC';
    return (extension || 'DOC').toUpperCase();
  }

  formatFileSize(size?: number | null): string {
    if (!size) return '';
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
    return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  }

  retourListeDossiers(): void {
    this.router.navigate(['/carrieres/dossier-agents']);
  }

  refreshData() {
    this.situationList = [];
    this.diplomeList = [];
    this.EtatCivilList = [];
  }
}
