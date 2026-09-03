import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ImputationOuBulletinService } from '../../../services/ImputationOuBulletin/ImputationOuBulletin.service';
import { ResponseApi } from 'src/app/models/response-api';
import { ReferencesService } from 'src/app/services/references.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Imputation } from '../../../models/dossier-agent/imputation';
import { NgxSpinnerService } from 'ngx-spinner';
import { CredentialsService } from 'src/app/services/credentials.service';


@Component({
  selector: 'app-liste-des-imputations-bulletin',
  templateUrl: './liste-des-imputations-bulletin.component.html',
  styleUrls: ['./liste-des-imputations-bulletin.component.css']
})
export class ListeDesImputationsBulletinComponent implements OnInit {
  headers!: string[];
  page = 1;
  pageSize = 10;
  collectionSize !:number;
  userList!: any[];
  collapsed:boolean = false;
  text = '';
  closeResult = '';
  Imputations !: any[]
  rechercheForm!: FormGroup;
  typeFilterForm !: FormGroup
  filtreImputationForm !: FormGroup;


  apiUrl: string = environment.apiUrl;
  imputationOuBulletin !: Imputation

  searchText = '';

  Direction : any[]=[]
  userInfos : any
  profilConnecte : any
  profile : any
  isDRH: boolean =false;
  hasGlobalAccess: boolean = false;
  canViewActions: boolean = false;

  typeDemande !: string
  fromDashboard : boolean = false
  hideButton: boolean = false

   constructor(
    private router: Router,
     private route: ActivatedRoute,
     private formBuilder: FormBuilder ,
     public modalService: NgbModal = inject(NgbModal),
     private imputationOuBulletinService : ImputationOuBulletinService,
     private _formBuilder: FormBuilder,
     private referenceService : ReferencesService,
     private _httpClient: HttpClient,
     private spinner: NgxSpinnerService,
     private _credentialService: CredentialsService

   ) {
    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil || []
    this.profile = this.profilConnecte[0]?.code
    const globalProfiles = ['ADMIN-DRH', 'Admin-General', 'Directeur-DRH'];
    const actionProfiles = [
      ...globalProfiles,
      'Assistant-DRH',
      'Representant-IA',
      'Agent-bureau-das',
      'Chef-bureau-das',
      'Chef-division-das',
      'Représentant-IEF'
    ];
    this.hasGlobalAccess = this.profilConnecte.some((profil: any) => globalProfiles.includes(profil.code));
    this.canViewActions = this.profilConnecte.some((profil: any) => actionProfiles.includes(profil.code));
    if(this.profile === 'Assistant-DRH' || this.hasGlobalAccess){
      this.isDRH = true
    }
    if(this.router.url?.includes("dash-inputation-bulletin") || !this.isDRH)
      this.hideButton = true
    }

  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['N° Demande','Matricule', 'Date demande','Bénéficiaire','Direction/IA', 'Type de demande','Région','Action'];
    this.refreshData();
    this.InitForm()
    this.rechercheForm = this.formBuilder.group(
        { matricule : ['', Validators.required]}
    )
    this.getStatutFromDashboard()
    this.getAllImputation()
    this.getDirections()

  }

  onChangeValueFilter(){
    this.getAllImputation()
  }

  InitForm(){

    this.filtreImputationForm = this._formBuilder.group({
      nom: new FormControl(''),
      prenom: new FormControl(''),
      matricule:new FormControl(''),
      date:new FormControl(''),
      region:new FormControl(''),
      numeroDemande:new FormControl(0),
    });

    this.typeFilterForm = this._formBuilder.group({
      typeDemande :['']
    });
  }

  getDirections(){
    this.referenceService.listDirections().
    subscribe({
      next : (response:any)=>{
        if(response.success){
          this.Direction = response.data
        }
      }
    })
  }

  getStatutFromDashboard(){
    console.log(" url ", this.router.url);
    
    if(this.router.url?.includes("dash-inputation-bulletin")){
      this.typeDemande = this.route.snapshot.params["type"]
      this.fromDashboard = true
    }
    console.log(this.typeDemande);
    console.log(this.fromDashboard);

  }

  getAllImputation(){
    this.spinner.show()
    //console.log("get all 1");
    let region = this.filtreImputationForm.value.region
    let matricule = this.filtreImputationForm.value.matricule
    let nom = this.filtreImputationForm.value.nom
    let prenom = this.filtreImputationForm.value.prenom
    let date = this.filtreImputationForm.value.date
    let typeDemande=""
    if(this.router.url?.includes("dash-inputation-bulletin")){
      if(this.router.url?.includes("Bulletin")){
        typeDemande = "Bulletin de visite"
      }else{
        typeDemande = "Imputation budgétaire"
      }
      this.imputationOuBulletinService.getAllFromDash(this.page-1, this.pageSize, region, matricule, nom, prenom,date,typeDemande)
        .subscribe({
          next : (data : any)=>{
            this.spinner.hide()
            this.Imputations = data.data.content
            this.collectionSize = data.data.totalElements
          },error : (error : any) => {
            this.spinner.hide()
            console.log(error);
          }
        })

    }else{
      typeDemande = this.typeFilterForm.value.typeDemande
      this.imputationOuBulletinService.getAll(this.page-1, this.pageSize, region, matricule, nom, prenom,date,typeDemande)
        .subscribe({
          next : (data : any)=>{
            this.spinner.hide()
            this.Imputations = data.data.content
            this.collectionSize = data.data.totalElements
          },error : (error : any) => {
            this.spinner.hide()
            console.log(error);
          }
        })
    }
    //console.log("lima diakhal == ", typeDemande)
  }
  

  generate(id:number){
    this.spinner.show()
    let type : string
    this.imputationOuBulletinService.generate(id).subscribe({
      next :(res :any) =>{
        console.log("data generated == ",res);
        if(res.success){
          this.spinner.hide()
          type = res.data.typeDemande
          console.log("filename ",res.data.imputationGeneree);

          this.Telecharger(res.data.imputationGeneree)
          Swal.fire({
            icon: 'success',
            html: '<strong>Imputation /bulletin de visite généré avec succès</strong>',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            // window.location.reload()
          })

        }else{
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            html: '<strong> Error génération Imputation Budgetaire/Bulletin de visite </strong>',
            showConfirmButton: false,
            timer: 2000
          })
        }
      }
    })
  }

  Telecharger(filename:string){
    console.log("entrer dans telechargé");

    this._httpClient.get(`${this.apiUrl}file/download/${filename}`, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${localStorage.getItem("Token")}`
      },
      responseType: 'blob' // traiter la réponse comme un blob
    }).subscribe(
        (response: Blob) => {
          // Créer une URL pour le contenu blob afin de pouvoir l'ouvrir dans une nouvelle fenêtre ou le télécharger
          const blobUrl = URL.createObjectURL(response);

          // Créer un élément d'ancrage invisible dans le document
          const anchor = document.createElement('a');
          anchor.style.display = 'none';
          document.body.appendChild(anchor);

          // Définir l'URL de l'ancrage sur l'URL blob et déclencher un clic
          anchor.href = blobUrl;
          anchor.download = filename; // Nom de fichier par défaut lors du téléchargement
          anchor.click();

          // Supprimer l'ancrage du document
          document.body.removeChild(anchor);

          // Libérer l'URL blob pour libérer la mémoire
          URL.revokeObjectURL(blobUrl);
        },
        (error) => console.log(error)
    );
  }
  openModalSearch(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg', centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.getAllImputation()
          //this.filtreImputationForm.reset()
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

          this.filtreImputationForm.reset()

        },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  refreshData() {
    this.userList = DATA.map((user:any, i:any) => ({ id: i + 1, ...user })).slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  openModalAddAgent(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'l', centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result)
            this.onSearch(result)
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
    );
  }



  onViewAgent(id: any) {
    this.router.navigate(['details-imputation-bulletin',id], { relativeTo: this.route.parent })
  }
  oncCreateImputation() {
    this.router.navigate(['add-imputation-bulletion'], { relativeTo: this.route.parent })
  }

  changeStatus(user: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        if(!user.status){
          this.text = "Activé";
          user.status = true
        }else{
          this.text = "Désactivé";
          user.status = false
        }

        Swal.fire({
          title: this.text,
          text: `L'utilisateur ${user.prenom + ' ' + user.nom} a été ${this.text}.`,
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        })
      }
    })
  }

  onSearch(val:string) {
    this.spinner.show()
    this.imputationOuBulletinService.recherche(val)
        .subscribe({
          next : (data : ResponseApi) =>{
            //  console.log("les données user complète imputation --->",data);
            if(data.success){
              this.spinner.hide()
              this.imputationOuBulletin=data.data;
              if(this.imputationOuBulletin.utilisateur.matricule == val){
                this.router.navigate(['add-imputation-bulletion',this.imputationOuBulletin.utilisateur.matricule], { relativeTo: this.route.parent })
              }
            }
          },
          error : (error)=>{
            this.spinner.hide()
            Swal.fire({
              title: 'Erreur recherche',
              html: " Ce matricule ne correspond à aucun utilisateur ou votre profil ne vou permet pas d'accéder aux informations de cet utilisateur '",
              icon: 'error',
              timer: 2500,
              showCancelButton: false,
              showConfirmButton: false
            })
            this.rechercheForm.reset();
          }
        })
  }

}

const DATA:any[] =  [
  { id:10001,numeroDemande : 'IB0038' ,   matricule:'mat009',prenom: 'Lamine', nom: 'DIEME', direction: "Agent", typeDemande: "Direction",region:'thies' },
  { id:10002,numeroDemande : 'IB0038' ,   matricule:'mat009',prenom: 'Mariama', nom: 'MBAYE', direction: "Agent", typeDemande: "Direction" ,region:'dakar'},
  { id:10003,numeroDemande : 'IB0038' ,   matricule:'mat009',prenom: 'Moussa', nom: 'SECK', direction: "Agent", typeDemande: "Direction" ,region:'dakar'},
  { id:10004,numeroDemande : 'IB0035' ,   matricule:'mat009',prenom: 'Fama', nom: 'LY', direction: "Agent", typeDemande: "Direction",region:'thies' },

]

