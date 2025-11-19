import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PermutationService } from '../../../mes-demandes-mutation-permutation/service/permutation.service';
import { PermutationDTO } from '../../../mes-demandes-mutation-permutation/model/Permutation';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CredentialsService } from 'src/app/services/credentials.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-permutation',
  templateUrl: './list-permutation.component.html',
  styleUrls: ['./list-permutation.component.css']
})
export class ListPermutationComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = DATAPERMUTATION.length;
  permutationList!: any[];
  collapsed: boolean = false;

  closeResult = '';
  apiUrl: string = environment.apiUrl;

  matricule = ""
  nom = ""
  prenom=""
  date =""
  statut = ""
  type = "reçue"
  statutFilterForm !: FormGroup
  avancerFilterForm !: FormGroup 
  searchText = ""
  permutations: PermutationDTO[]=[]
  userInfos : any
  profilConnecte : any
  pourTraitement = false;
  isProfOrFormateur = false;
  profile : any

  piecesJointesFiles: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly _fb: FormBuilder,
    public modalService: NgbModal = inject(NgbModal),
    private readonly permutationService : PermutationService,
    private readonly _credentialService: CredentialsService,
    private _httpClient: HttpClient,
    private spinner : NgxSpinnerService
  ) {

    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profile = this.profilConnecte[0].code
    let prof = this.profilConnecte.find((pro : any) =>( (pro.code === "bureau-mo-rec") || (pro.code === "Chef-division-dgpeec") || (pro.code === "Representant-IA") || (pro.code === "Représentant-IEF") || (pro.code === "Chef-etablissement") || (pro.code === "Professeur") || (pro.code === "Formateurs")) )
    if(prof){
        console.log(prof)
        this.pourTraitement = true
      }
      if(this.profile === 'Professeur' || this.profile === 'Formateurs')
        this.isProfOrFormateur = true
   }

  ngOnInit(): void {
    this.initForm()
    this.refreshData();
    this.getAllPermutations()
    console.log("le profil ",this.userInfos.profil[0].code);
    
  }

  initForm(){
    this.statutFilterForm = this._fb.group({
      statut:new FormControl(''),
    });
    this.avancerFilterForm = this._fb.group({
      prenom:new FormControl(''),
      matricule:new FormControl(''),
      nom:new FormControl(''),
      region:new FormControl(''),
      ia : new FormControl(''),
      ief:new FormControl(''),
      etablissement : new FormControl('')
    });
  }

  onChangeValueFilter(){
    this.getAllPermutations()
  }

  getAllPermutations(){

    this.spinner.show();
    let statut = this.statutFilterForm.value.statut
    let nom = this.avancerFilterForm.value.nom
    let prenom = this.avancerFilterForm.value.prenom
    let matricule = this.avancerFilterForm.value.matricule
    let region = this.avancerFilterForm.value.region
    let etablissement = this.avancerFilterForm.value.etablissement
    let ia = this.avancerFilterForm.value.ia
    let  ief = this.avancerFilterForm.value.ief



    this.permutationService.getAll(this.page -1,  this.pageSize, matricule, region, statut, nom, prenom, this.type, ia, ief, etablissement).subscribe(
      {
        next : (data: any) => {
         
        this.permutations = data.data.payload.content
        console.log(this.permutations);
          this.spinner.hide();
        },
        error : (err: any) => {
          console.log(err);
        }

      }
  )}

  
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

    this.permutationList = DATAPERMUTATION.map((demande: any, i: any) => ({ id: i + 1, ...demande })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  onViewDetailPermutation(data: any) {
    this.router.navigate([data.id, 'detail-permutation'], { relativeTo: this.route.parent })
  }

  onEditPermutation(data: any) {
    this.router.navigate([data.id, 'traitement-demande-permutation'], { relativeTo: this.route.parent })
  }


  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    console.log('Result');
    this.closeModal();
  }


  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  Telecharger(filename:string){
    console.log({filename : filename});

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
}


const DATAPERMUTATION: any[] = [
  {
    num_demande: 'dem002',
    dateDemande: '23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom: 'DIEME',
    },
    formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom: 'YADE',
    },
    statut: 'ENVOYEER'
  },
  {
    num_demande: 'dem001',
    dateDemande: '23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom: 'DIEME',
    },
    formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom: 'YADE',
    },
    statut: 'VALIDEER'
  },
  {
    num_demande: 'dem002',
    dateDemande: '23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom: 'DIEME',
    },
    formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom: 'YADE',
    },
    statut: 'ACCEPTEER'
  },
  {
    num_demande: 'dem002',
    dateDemande: '23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom: 'DIEME',
    },
    formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom: 'YADE',
    },
    statut: 'REFUSEER'
  },
  {
    num_demande: 'dem002',
    dateDemande: '23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom: 'DIEME',
    },
    formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom: 'YADE',
    },
    statut: 'AMODIFIER'
  },
  {
    num_demande: 'dem001',
    dateDemande: '23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom: 'DIEME',
    },
    formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom: 'YADE',
    },
    statut: 'REJETEER'
  }
]
