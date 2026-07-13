
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MutationService } from '../../../demandes-mutation-permutation-recues/services/mutation.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { CredentialsService } from 'src/app/services/credentials.service';
import { MutationDTO } from '../../../demandes-mutation-permutation-recues/models/mutationDTO';
import { PermutationService } from '../../service/permutation.service';
import { PermutationDTO } from '../../model/Permutation';
import { Utilisateur } from 'src/app/models/utilisateur';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReferencesService } from 'src/app/services/references.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { FileService } from 'src/app/shared/services/files/file.service';
import { log } from 'node:console';
@Component({
  selector: 'app-list-permutation',
  templateUrl: './list-mutation-permutation.component.html',
  styleUrls: ['./list-mutation-permutation.component.css']
})
export class ListMutationPermutationComponent implements OnInit {
  




  headersMutation: string[] = ['N° Référence', 'Date demande', 'Région (souhaitée)', 'Direction ou Etablissement d\'origine', 'Direction ou Etablissement (Souhaité)', 'Statut','Action'];
  user : UserDTOs  = new UserDTOs()

  reachForm !: FormGroup;
  page = 1;
  pageSize = 10;
  collectionSize1 = 0;
  collectionSize2 = 0;
  mutationList!: any[];
  permutationList!: any[];
  collapsed: boolean = false;
  tabTitle = 'Liste de mes demandes de mutations';
  tabIndex = 0;
  closeResult = '';
  userInfos : any
  region = "";
  ia ="";
  ief = "";
  numeroRef = "";
  bureau = ""
  direction = ""
  division = ""
  service = ""
  pourTraitement = false;
  demandes: MutationDTO[] = [];
  etablissement: string = "";
  profilConnecte : any
  traiteur = false
  permutations : PermutationDTO[] = []
  matricule = ""
  nom = ""
  prenom=""
  date =""
  statut = ""
  type = ""
  statutMutation = ""
  searchText : any
  currentUser !: Utilisateur;
  utilisateur2 !: Utilisateur
  createPermutationForm !: FormGroup
  apiUrl: string = environment.apiUrl;
  statutFilterForm !: FormGroup
  avancerFilterForm !: FormGroup
  piecesJointesFiles: File[] = [];
  piecesJointesFilesPermutationOs: File[] = [];
  idMutation : any
  idPermutation : any

  searchQuery = ""
  iaM= "";
  iefM= "";
  regionM= "";
  etablissementM= "";
  listIa: any;
  listIef: any;
  listEtab: any;
  listReg: any;
  listDir: any;
  listDiv: any;
  listBur: any;
  listServ: any;
  profile : any
  isDGPEEC: boolean =false;
  isOsManager: boolean =false;
  isProfOrFormateur: boolean =false;
  activatedUrl!: string;
  dashboardMutation = false
  dashboardPermutation = false;
  userId !: number

  constructor(
      private _formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      public modalService: NgbModal = inject(NgbModal),
      private readonly mutationService : MutationService,
      private readonly _credentialService: CredentialsService,
      private readonly permutationService: PermutationService,
      private _httpClient: HttpClient,
      private spinner: NgxSpinnerService,
      private readonly referenceService : ReferencesService,
      private readonly _userService: UtilisateurService,
      private readonly fileService:FileService,

  ) {


    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profile = this.profilConnecte[0].code
    this.activatedUrl = this.router.url
    this.userId = this.userInfos.id

    
    let prof = this.profilConnecte.find((pro : any) =>( (pro.code === "bureau-mo-rec") || (pro.code === "Chef-division-dgpeec")||
        (pro.code === "Représentant-IEF") || (pro.code === "Representant-IA") || (pro.code === "Chef-EFF") ||
        (pro.code === "Directeur-DRH") || (pro.code === "Chef-etablissement")|| (pro.code === "Chef-cfp")) )
    this.activatedUrl = this.router.url

    if(prof){
      this.pourTraitement = true
      if(this.profile === 'Chef-division-dgpeec') {
        this.isDGPEEC = true

      }



    }

    // Profils habilités à générer l'OS et à téléverser l'OS signé pour les permutations :
    // DGPEEC (chef de division et chefs de bureau) + Directeur-DRH + Admin-DRH
    this.isOsManager = this.profilConnecte.some((pro : any) =>
        pro.code === "Chef-division-dgpeec" || pro.code === "bureau-mo-rec" ||
        pro.code === "Directeur-DRH" || pro.code === "ADMIN-DRH")
    //if(this.profile === 'Professeur' || this.profile === 'Formateurs')

    if(this.profile?.code?.includes("Chef-service") || this.profile?.code?.includes("Chef-division"))
      this.pourTraitement = true

    if(this.activatedUrl?.includes("mes-demandes"))
      this.pourTraitement = false
    else this.pourTraitement = true

    if(this.activatedUrl?.includes("dashboard-mutation"))
     {
      this.dashboardMutation = true
      let stat = this.route.snapshot.paramMap.get('statut')
      if(stat && stat != 'all')
        {
          this.statutMutation = stat
        }
     }
     if(this.activatedUrl?.includes("dashboard-permutation"))
      {
       this.dashboardPermutation = true
       let stat = this.route.snapshot.paramMap.get('statut')
       if(stat && stat != 'all')
         {
           this.statut = stat
         }
      }

  }

  ngOnInit(): void {
    this.initForm();
    this.listmutations();
    this.getAllPermutations();
    this.getCurrentUser()
    this.allDataForReach()
  }
  onChangeValueFilter(){
    //console.log("ici")
    this.getAllPermutations()
  }

  onAccept(id : number) { 
   // console.log("pourTraitement ",this.pourTraitement );
    
    Swal.fire({
      title: 'Acceptation',
      text: 'Souhaitez-vous accepter cette demande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        let action = "ACCEPTER"
        if(this.pourTraitement)
          action = "VALIDER"
        let motif = ""
       // console.log("action === ",action);
        
        this.permutationService.traitement(id, action, motif, this.type).subscribe({
          next : (data)=>{
            if(data.success){
           //   console.log(data);
              Swal.fire({
                html:`Demande de permutation <b>${id}</b> accepté avec succès`,
                icon: 'success',
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false
              }).then(() => {
                window.location.reload()
              })
            }
          },
          error : (err)=>{
           // console.log(err);
            Swal.fire({
              html: "Une erreur est survenue lors de l'acceptation de la demande.Veuillez rééssayer!.",
              icon: 'error',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            }).then(() => {
              window.location.reload()
            })
          }
        })
      }
    });
  }

  initForm(){
    this.createPermutationForm = this._formBuilder.group({
      matriculeUtilisateur2: ['', Validators.required],
    })
    this.statutFilterForm = this._formBuilder.group({
      statut:new FormControl(''),
    });
    this.avancerFilterForm = this._formBuilder.group({
      prenom:new FormControl(''),
      matricule:new FormControl(''),
      nom:new FormControl(''),
      region:new FormControl(''),
      ia : new FormControl(''),
      ief:new FormControl(''),
      etablissement : new FormControl('')
    })
    this.reachForm = this._formBuilder.group({
      region:new FormControl(''),
      ia : new FormControl(''),
      ief:new FormControl(''),
      etablissement : new FormControl(''),
      bureau:new FormControl(''),
      direction : new FormControl(''),
      division:new FormControl(''),
      numeroRef:new FormControl(''),
      service:new FormControl(''),
    });
  }
  showSpinnerWithDelay(duration: number): void {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, duration);
    // window.location.reload()
  }
  getCurrentUser(){

    this.permutationService.getCurrentUser().subscribe({
      next : (data: any) => {

        this.currentUser= data.data
      }
    })
  }
  openModalSearch(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg', centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
    );
  }

  getAllPermutations(){
    //console.log("ici")
    this.spinner.show();

    let statut =''
    if(this.activatedUrl?.includes("dashboard-permutation") && this.statut ==="VALIDER" || this.activatedUrl?.includes("dashboard-permutation") && this.statut ==="REJETER")
      statut = this.statut
    else 
      statut = this.statutFilterForm.value.statut
  
    let nom = this.avancerFilterForm.value.nom
    let prenom = this.avancerFilterForm.value.prenom
    let matricule = this.avancerFilterForm.value.matricule
    let region = this.avancerFilterForm.value.region
    let etablissement = this.avancerFilterForm.value.etablissement
    let ia = this.avancerFilterForm.value.ia
    let ief = this.avancerFilterForm.value.ief
    if(this.pourTraitement)
      this.type = "traitée"
    else
      this.type = "emise"
    this.permutationService.getAll(this.page -1,  this.pageSize, matricule, region, statut, nom, prenom, this.type,  ia, ief, etablissement).subscribe(
        {
          next : (data: any) => {
            this.permutations = data.data.payload.content
         //   console.log(this.permutations);
            this.spinner.hide();
          },
          error : (err: any) => {
          //  console.log(err);
          }

        }
    )}


  genererOSMutation(allMutation : boolean, idMutation : number){
    this.mutationService.genererOS(allMutation, idMutation).subscribe({
      next : (data: any) => {

        this.Telecharger(data.payload)
        Swal.fire({
          icon: 'success',
          html: `<strong> Ordre de service généré avec succès </strong>`,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload()
        })
      }})
  }
  genererOS(){
    this.permutationService.generateAllPermutation().subscribe({
      next : (data: any) => {
      //  console.log(data.data.payload);
        this.Telecharger(data.data.payload)
        Swal.fire({
          icon: 'success',
          html: `<strong> Ordre de service généré avec succès </strong>`,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          //window.location.reload()
        })
      }})
  }

  generate(id:number){
    this.permutationService.generate(id).subscribe({
      next :(res :any) =>{
      //  console.log("data generated == ",res);
        if(res.success){

          this.Telecharger(res.data.ordreService)
          Swal.fire({
            icon: 'success',
            html: `<strong>Ordre de service Permutation ${res.data.id} généré avec succès</strong>`,
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            //window.location.reload()
          })

        }else{
          Swal.fire({
            icon: 'error',
            html: '<strong> Error génération ordre de service. rééssayez</strong>',
            showConfirmButton: false,
            timer: 2000
          })
        }
      }
    })
  }
  Telecharger(filename:string){
 // this.spinner.show()
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
          //this.spinner.hide()
        },
        (error) => console.log(error)
    );
  }


  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
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
    // this.listmutations()
  }
  listmutations(){
    this.mutationService.getAll(this.userInfos.id, this.page -1, this.pageSize, this.statutMutation,this.regionM, this.iaM, this.iefM,this.etablissementM,
        this.bureau,this.direction, this.division,this.service ,this.numeroRef, this.pourTraitement, this.profile)
        .subscribe({
          next : (data : ResponseApi2) =>{

            if(data.status?.includes('OK'))
            {this.demandes = data.payload
       
             // this.demandes.sort((a, b) => b.id - a.id);
             this.iaM = ""
             this.iefM = ""
             this.regionM = ""
             this.etablissementM = ""
             this.bureau = ""
             this.direction = ""
             this.division  = ""
             this.service = ""
          
              if(data.metadata)
                this.collectionSize1 = data.metadata.totalElements
            }

          }
        })

  }


  onViewDetailFormation(data: any) {
    this.router.navigate([data.reference, 'detail-view'], { relativeTo: this.route.parent })
  }

  onTabChange(event : MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.tabIndex == 0 ?
        this.tabTitle = 'Liste de mes demandes de mutations' :
        this.tabTitle = 'Liste de mes demandes de permutations';
  }

  onCreateMutation() {
    this.router.navigate(['create-mutation'], { relativeTo: this.route.parent })
  }

  onDemandePermutation() {
    let matricule = this.createPermutationForm.value.matriculeUtilisateur2
    this.permutationService.getUser2(matricule).subscribe(
        (data) => {
        //  console.log(data);
          if(data.success){
            this.utilisateur2 = data.data
            // console.log(this.utilisateur2)
            this.closeModal();
            this.router.navigate(['create-permutation', this.utilisateur2.matricule], { relativeTo: this.route.parent })
          }

        })

  }

  onViewDetailMutation(data: any) {
    this.router.navigate([data.id, 'detail-mutation'], { relativeTo: this.route.parent })
  }

  onViewDetailPermutation(idPermutation : number) {
    this.router.navigate([idPermutation, 'detail-permutation'], { relativeTo: this.route.parent })
  }

  onEditPermutation(idPermutation : number) {
    this.router.navigate([idPermutation, 'edit-permutation'], { relativeTo: this.route.parent })
  }

  onEditMutation(data: any) {
    this.router.navigate([data.id, 'edit-mutation'], { relativeTo: this.route.parent })
  }
  onTraitMutation(data: any) {
    this.router.navigate([data.id, 'traitement-demande-mutation'], { relativeTo: this.route.parent })
  }


  onParticipe(data: any) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous participer cette formation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui, je confirme',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: 'Votre demande de participation à la formation <b>(Type formation)</b> a été envoyée.',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        })
      }
    });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.initForm()
    this.listmutations()
  }

  onSearch() {
    this.iaM = this.reachForm.value.ia
    this.iefM = this.reachForm.value.ief
    this.regionM = this.reachForm.value.region
    this.etablissementM = this.reachForm.value.etablissement
    this.bureau = this.reachForm.value.bureau
    this.direction = this.reachForm.value.direction
    this.division  = this.reachForm.value.division
    this.service = this.reachForm.value.service
    this.listmutations()
    this.closeModal();
  }

  UploadPermutationOS(){
    this.spinner.show()
    this.permutationService.uploadPermuatationOS(this.idPermutation, this.userInfos.id, this.piecesJointesFilesPermutationOs[0]).subscribe({
      next: (data : ResponseApi2) => {
     //   console.log(data);
        if(data.status?.includes('OK'))
          {
            this.router.navigate(["gpeec/demandes-mutation-permutation"]);
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              html: 'Ordre de service chargé avec succès.',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.spinner.hide();
              //this.closeModal();
              this.modalService.dismissAll();
              // Rediriger vers la page des demandes reçues après la fermeture du message popup
              //  this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
              window.location.reload()
            })
          }
      } 
    })
  }

  onSaveDemandeOS() {
    this.spinner.show()
    //  this.showSpinnerWithDelay(3000)
    this.mutationService.TraitementValider(this.idMutation, this.userInfos.id, this.piecesJointesFiles[0])
        .subscribe((data : ResponseApi2) =>{
          this.router.navigate(["gpeec/demande-mutation-permutation-recues"]);
          // window.location.reload()
          if(data.status?.includes('OK'))
          {
            Swal.fire({
              icon: 'success',
              html: 'Ordre de service chargé avec succès.',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.spinner.hide();
              //this.closeModal();
              this.modalService.dismissAll();
              // Rediriger vers la page des demandes reçues après la fermeture du message popup
              //  this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
              window.location.reload()
            })
          }
        })
  }


  openModal(content: TemplateRef<any>, idMutation : any) {
    this.idMutation = idMutation
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg', centered: true }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  openModalUploadPermuationOs(content: TemplateRef<any>, idPermutation : any) {
    this.idPermutation = idPermutation
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg', centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
    );
  }



  matchSearchQuery(demande: MutationDTO): boolean {
    const searchValue = this.searchQuery.toLowerCase();
    let utilisateur = demande.demandeur
    let etablissement = demande.etablissementSouhaitee
   

    return( Object.values(demande).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(utilisateur).some(value =>
           value != null && value.toString().toLowerCase().includes(searchValue)))
      || Object.values(etablissement).some(value =>
          value != null && value.toString().toLowerCase().includes(searchValue))

}
allDataForReach(){
  this.referenceService.listIA()
  .subscribe(response => {
    if (response.success) {
      this.listIa = response.data; 
    }
  });
  this.referenceService.listIEF()
  .subscribe(response => {
    if (response.success) {
      this.listIef = response.data; 
    }
  });
  this.referenceService.listEtablissement()
  .subscribe(response => {
    if (response.success) {
      this.listEtab = response.data; 
    }
  });
  this.referenceService.listRegion()
  .subscribe(response => {
    if (response.success) {
      this.listReg = response.data; 
    }
  });
  this.referenceService.listDirections()
  .subscribe(response => {
    if (response.success) {
      this.listDir = response.data; 
    }
  });
  this.referenceService.listDivisions()
  .subscribe(response => {
    if (response.success) {
      this.listDiv = response.data; 
    }
  });
  this.referenceService.listButreaus()
  .subscribe(response => {
    if (response.success) {
      this.listBur = response.data; 
    }
  });
  this.referenceService.listService()
  .subscribe(response => {
    if (response.success) {
      this.listServ = response.data; 
    }
  });
}
getUserDetail(){
  this._userService.getOneUser(this.userInfos.id)
                   .subscribe({
                    next : (data : any) =>{
                        this.user = data.data
                    }
                   })
}
//vérification du profil traitant
doitTraiter(mutation : MutationDTO, codeProfilConnected : string) : boolean{

  if(mutation.profilDevantTraiter === codeProfilConnected) {

    return true
  }

  if(mutation.profilDevantTraiter === "Chef-service" || mutation.profilDevantTraiter === "Chef-division")
   {  if(mutation.demandeur.service && mutation.demandeur.service.code === this.user.service.code)
        return true
      if(mutation.demandeur.division && mutation.demandeur.division.code === this.user.division.code)
        return true
    }

    return false
  }
  visualiser2(fileName: string): void {
    this.fileService.openPdfInNewTab(fileName)
    };
  

}

