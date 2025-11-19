import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DemandePecService } from 'src/app/services/demandePecService';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FileService } from 'src/app/shared/services/files/file.service';
import Swal from 'sweetalert2'
import { DemandePecDTO } from '../../../models/DemandePecDTO';
import { ReferencesService } from 'src/app/services/references.service';
import { Profil } from 'src/app/models/utilisateur';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActeService } from 'src/app/services/acteService.service';
import { UserDTOs } from 'src/app/models/UserDTOs';

@Component({
  selector: 'app-list-demande-recue',
  templateUrl: './list-demande-recue.component.html',
  styleUrls: ['./list-demande-recue.component.css']
})
export class ListDemandeRecueComponent implements OnInit {

  isSearchResult: boolean = false;

  headers: string[]  = ['N° Demande', 'Matricule','Demandeur', 'Type demande','Entité','Région','Date', 'Statut','Action'];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  demandeList!: any[];
  demandePecList:DemandePecDTO[]=[];
  demandePecList1:DemandePecDTO[]=[];
  collapsed: boolean = false;
  text = '';
  closeResult = '';
  userInfos: any;
  userId:any;
  date:string="";
  numero:string="";
  matricule:string="";
  nom:string="";
  prenom:string="";
  objet:string="";
  type:string="";
  statut:string="";
  region: any;
  ief: any;
  ia: any;
  cfp: any;
  etablissement: any;
  filtreAvanceForm!:FormGroup;
  searchQuery: string = "";
  filteredItems:any[]=[];
  profil!:Profil;
  userDTO!:UserDTOs;
  dashStatut!:any;

 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referenceService: ReferencesService,
    public modalService: NgbModal = inject(NgbModal),
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly _fb : FormBuilder,
    private readonly fileService:FileService,
    private readonly spinner: NgxSpinnerService,
    private readonly acteService: ActeService,
    private readonly activatedRoute: ActivatedRoute,


  ) { 
    this.userInfos = this.credentialService.getUserInfos();
    this.userId=this.userInfos.id;
    this.dashStatut = this.activatedRoute.snapshot.paramMap.get('statut')
  }

  ngOnInit(): void {
    this.listPEC();
    this.refreshData();
    this.listRegion();
    this.initForm();
    this.getTraitrant(this.userId);
  }

  getTraitrant(id:number){
    this.spinner.show()
    this.acteService.getOneUser(id)
    .subscribe((data: any) => {
      if (data.success) {
       console.log({utilisateur:data.data});
        this.userDTO=data.data;
        this.profil=this.userDTO.profils[0];
        console.log({profil:this.profil})
        this.spinner.hide()
        //if(this.userDT)
      } else {
      }
    });     
  }

  getActeStatus(acteStatus: String): string {
    switch (acteStatus) {
      case 'SOUMISE':
        return 'SOUMISE';
      case 'AMODIFIER':
        return 'AMODIFIER';
      case 'VALIDEE':
        return 'VALIDEE';
        case 'REJETEE':
        return 'REJETEE';
      default:
        return 'SOUMISE';
    }
  }

  listRegion(){
    this.referenceService.listRegion().subscribe(response => {
      if(response.success){
          this.region = response.data;
        console.log({region:this.region});
      }
  });
}

  initForm(): void {
    this.filtreAvanceForm= this._fb.group({
      matricule: [''],
      prenom: [''],
      nom: [''],
      dateDemande: [''],
      region: [''],
      ia: [''],
      statut: [''],
    });
  }


  listPEC(){
    if(this.router.url.includes('dash') && this.dashStatut!=null)
      {
      //console.log("Je viens du DashBoard")
      //console.log({stat:this.dashStatut})
      this.demandePecService.listPec(this.page-1,this.pageSize,0,"","","","","","","","",this.dashStatut,"")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
         // console.log({data : data});
          this.demandePecList=data.payload;
         // console.log({demandePecList : this.demandePecList});
          }
      }
    })
  }
    else{
   // console.log("HElllllllllooooo");
    this.demandePecService.listPec(this.page-1,this.pageSize,0,this.numero,this.matricule,this.nom,this.prenom,"","",this.date,this.objet,this.statut,this.type)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
         // console.log({data : data});
          this.demandePecList=data.payload;
         // console.log({demandePecList : this.demandePecList});
          }
      }
    })
  }
}


  filterItems() {
    //console.log('Hello')
    if (this.searchQuery.trim() === '') {
      // Si le champ de recherche est vide, réinitialise simplement la liste des éléments filtrés
      this.demandePecService.listPec(this.page-1,this.pageSize,0,"","","","","","","","","","");
    } else {
      // Sinon, filtre les éléments selon la valeur de recherche
      this.demandePecList = this.demandePecList.filter(item =>
        item.numeroDemande.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.matricule.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.prenom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.region.label.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.statutPriseEnCharge.libelle.toLowerCase().includes(this.searchQuery.toLowerCase())||
        item.typeDemandePeec.libelle.toLowerCase().includes(this.searchQuery.toLowerCase())
       // item.utilisateur.direction.label.toLowerCase().includes(this.searchQuery.toLowerCase())||
       // item.utilisateur.ia.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  matchSearchQuery(demande: any): boolean {
    const searchValue = this.searchQuery.toLowerCase();
    let utilisateur = demande.utilisateur
    let type=demande.typeDemandePeec
    let statut=demande.statutPriseEnCharge
    return( Object.values(demande).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(utilisateur).some(value =>
           value != null && value.toString().toLowerCase().includes(searchValue)))
       || Object.values(type).some(value =>
          value != null && value.toString().toLowerCase().includes(searchValue)) 
       || Object.values(statut).some(value =>
          value != null && value.toString().toLowerCase().includes(searchValue)
      ) 
}

  onSearchChange(value: string) {
    //console.log(value);
    this.searchQuery=value;
    //console.log(this.searchQuery);

    if (value.trim() === '') {
     // console.log(this.searchQuery)
      // Si le champ de recherche est vide, réinitialise simplement la liste des éléments filtrés
      this.listPEC();
     // this.demandePecList = this.demandePecList;
    } else {
      // Sinon, filtre les éléments selon la valeur de recherche
      this.demandePecList = this.demandePecList.filter(item =>
        item.numeroDemande.toLowerCase().includes(value.toLowerCase()) ||
        item.utilisateur.matricule.toLowerCase().includes(value.toLowerCase()) ||
        item.utilisateur.nom.toLowerCase().includes(value.toLowerCase()) ||
        item.utilisateur.prenom.toLowerCase().includes(value.toLowerCase()) ||
        item.utilisateur.region.label.toLowerCase().includes(value.toLowerCase()) ||
        item.statutPriseEnCharge.libelle.toLowerCase().includes(value.toLowerCase())||
        item.typeDemandePeec.libelle.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  onInputChange() {
    //console.log('Hello');
    if (this.searchQuery.trim() === '') {
      // Si le champ de recherche est vide, réinitialise simplement la liste des éléments filtrés
      this.demandeList = this.demandePecList;
    } else {
      // Sinon, filtre les éléments selon la valeur de recherche
      this.demandePecList = this.demandePecList.filter(item =>
        item.numeroDemande.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.matricule.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.prenom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.utilisateur.region.label.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.statutPriseEnCharge.libelle.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  getActeByNum(event:any){
    this.numero=event;
    this.demandePecService.listPec(this.page-1,this.pageSize,0,this.numero,this.matricule,this.nom,this.prenom,"","",this.date,this.objet,this.statut,this.type)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
          //console.log({data : data});
          this.demandePecList=data.payload;
          //console.log({demandePecList : this.demandePecList});
          }
      }
    })
  }
  onSelectedType(event:any){
    this.statut=event;
    this.demandePecService.listPec(this.page-1,this.pageSize,0,this.numero,this.matricule,this.nom,this.prenom,"","",this.date,this.objet,this.statut,this.type)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
          //console.log({data : data});
          this.demandePecList=data.payload;
          //console.log({demandePecList : this.demandePecList});
          }
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

  getListEF(code: any): void {
    this.referenceService.listIEFByCode(code)
        .subscribe(response => {
            if (response.success) {
                this.ief = response.data;
            }
        });
}

getListIA(code: any): void {
    this.referenceService.listIAByCode(code)
        .subscribe(response => {
            if (response.success) {
                this.ia = response.data;
                console.log({ia:this.ia})
            }
        });
}

getListCFP(code: any): void {
    this.referenceService.listCFPByCode(code)
        .subscribe(response => {
            if (response.success) {
                this.cfp = response.data;
            }
        });
}

getListEtablissement(code: any): void {
    this.referenceService.listEtablissementByCode(code)
        .subscribe(response => {
            if (response.success) {
                this.etablissement = response.data;
            }
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
  refreshData() {
    this.demandeList = DATA.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }


  onEditDemande(data: any) {
    this.router.navigate([data.id, 'traitement-demande'], { relativeTo: this.route.parent });
  }

  onViewDemande(data: any) {
    this.router.navigate([data.id, 'detail-view'], { relativeTo: this.route.parent })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    console.log({ formulaire: this.filtreAvanceForm.value});
    this.demandePecService.listPec(
      this.page - 1,
      this.pageSize,
      0,
      "",
      this.filtreAvanceForm.value.matricule,
      this.filtreAvanceForm.value.nom,
      this.filtreAvanceForm.value.prenom,
      this.filtreAvanceForm.value.region,
      "",
     // this.filtreAvanceForm.value.ia,
      this.filtreAvanceForm.value.dateDemande,
      "",
      this.filtreAvanceForm.value.statut,
      ""
    ).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
         // console.log({ data: data });
          this.demandePecList = data.payload;
        }
        // Nettoyer le formulaire après la recherche réussie
       this.filtreAvanceForm.reset();
      }
    });
   // console.log('Result');
    this.modalService.dismissAll();
    this.isSearchResult = true;
  }

  onResetfiltre() {
    this.isSearchResult = !this.isSearchResult;
     this.refreshData();
  }

}
const DATA: any[] = [
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
    status:'SOUMISE'
  },
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
    status:'SOUMISE'
  },
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
     status:'SOUMISE'
  },
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
     status:'VALIDEER'
  },
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
     status:'VALIDEER'
  },
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
     status:'REJETEER'
  },
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
     status:'REJETEER'
  },
  {
    num_demande:1093,
    typeDemande:'lorem',
    matricule:'matt001',
    entite:'loem ipsum',
    region:'loem ipsum',
    prenomDemandeur:'Lorem',
    nomDemandeur:'Ipsum',
    date:'01-01-2024',
     status:'REJETEER'
  }
]

