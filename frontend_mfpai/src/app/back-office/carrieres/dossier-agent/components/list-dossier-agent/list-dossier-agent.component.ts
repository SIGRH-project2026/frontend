import {Component, TemplateRef, inject, OnInit} from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { ModalDismissReasons,  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseApi } from 'src/app/models/response-api';
import { CarriereService } from 'src/app/services/carriere.service';
import { DossierAgent } from '../../../models/dossier-agent/dossier-agent';
import { DossierAgentService } from '../../../services/dossier-agent/dossier-agent.service';
import { SearchPipe } from '../../../Pipes/Search.pipe';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-list-dossier-agent',
    templateUrl: './list-dossier-agent.component.html',
    styleUrls: ['./list-dossier-agent.component.css']
})
export class ListDossierAgentComponent implements OnInit{
  headers!: string[];
  page = 1;
	pageSize = 10;
	userList!: any[];
  collapsed:boolean = false;
  dossierList : DossierAgent[] = []
	collectionSize = 0;
  public dossier :any;

  rechercheForm!: FormGroup;

  filtreAvanceForm !: FormGroup;
  
  closeResult = '';
  searchText = '';
  direction !: any[]
  
 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public modalService: NgbModal = inject(NgbModal),
    private carriereService : CarriereService,
    private formBuilder: FormBuilder ,
    private dossierDossierAgentService: DossierAgentService,
    private readonly _dossierAgentService : DossierAgentService,  
    private _formBuilder: FormBuilder,
   ) { }

   searchData = {
    nom: '',
    prenom: '',
    matricule: '',
    adresse: ''
  };

   ngOnInit(): void {
    // Initialize data and headers
    this.InitForm()
    this.headers = ['Matricule','Prénom', 'Nom','Adresse','Fonction','Corps et grade', 'Action'];
    this.refreshData();
    this.rechercheForm = this.formBuilder.group(
     { matricule : ['', Validators.required]}
    )
    this.listDossierAgent()
  }

  refreshData() {
		this.userList = this.dossierList.map((user:any, i:any) => ({ id: i + 1, ...user })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }

  refreshData1(event: any) {
    if (event.target['text'] != undefined && event.target['text'] != "««" && event.target['text'] != "«" && event.target['text'] != "»" && event.target['text'] != "»»"){
      this.listDossierAgent();
    }

  }
InitForm(){
  this.filtreAvanceForm = this._formBuilder.group({
    nom: [''],
    prenom: [''],
    adresse: [''],
    matricule: [''],

  });
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

  onCreateDossier() {
    this.router.navigate(['create-dossier-agent'], { relativeTo: this.route.parent })
  }


  openModalSearch(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg', centered: true }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
        this.listDossierAgent()
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
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

  // redirectDetail(id : number){
  //     console.log(id)
  //   this.router.navigate([`carrieres/mon-dossier/${id}`])
  // }

 redirectDetail(dossierId: number){
    console.log("Redirection vers dossier ID:", dossierId);
    // Utiliser la route avec paramètre
    this.router.navigate(['/carrieres/mon-dossier', dossierId]);
}

  listDossierAgent() {
    //console.log("helloooooooo");
    let adresse = this.filtreAvanceForm.value.adresse
    let matricule = this.filtreAvanceForm.value.matricule
    let nom = this.filtreAvanceForm.value.nom
    let prenom = this.filtreAvanceForm.value.prenom
  
    this._dossierAgentService.getAll(this.page -1, this.pageSize, adresse, matricule, nom, prenom)
        .subscribe({
          next : (data : any) =>{
            if(data.success){
              this.dossierList = data.data.content
            //  console.log("donnees :::: ", this.dossierList);
              this.collectionSize = data.data.totalElements
            }
          },
          error : (error) =>{
            console.error({error : error})
          }
        })
  } 

  onSearch(val: string) {
  //  console.log("testons  == ",val);
    this.dossierDossierAgentService.recherche(val)
      .subscribe({
        next : (data : ResponseApi) =>{
       //   console.log("les données user complète",data);
        if(data.success){
            this.dossier=data.data;
            if(this.dossier.utilisateur.matricule == val){
              this.router.navigate(['create-dossier-agent',this.dossier.utilisateur.matricule], { relativeTo: this.route.parent })
            }
          }
        },
        error : (error)=>{
          Swal.fire({
            title: 'Utilisateur',
            html: ' Ce matricule ne correspond à aucun utilisateur ',
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

