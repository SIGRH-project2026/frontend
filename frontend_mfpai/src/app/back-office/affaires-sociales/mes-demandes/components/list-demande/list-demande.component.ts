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
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {

  headers: string[]  = ['N° Demande', 'Type de demande', 'Date demande','Statut', 'Action'];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  demandeList!: any[];
  demandePecList:DemandePecDTO[]=[];
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
  region:string="";
  ia:string="";
  filtreAvanceForm!:FormGroup;
  searchQuery: string = "";
  filteredItems:any[]=[];

  fromDashboard : boolean = false



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly _fb : FormBuilder,
    private spinner: NgxSpinnerService,
    private readonly fileService:FileService,
  ) { 
    this.userInfos = this.credentialService.getUserInfos();
    this.userId=this.userInfos.id;
  }

  ngOnInit(): void {
    this.getStatutFromDashboard()
    this.listPEC();
    this.refreshData(); 
    this.initForm();
  }

  getStatutFromDashboard(){
   // console.log(" url 1", this.router.url);
    
    if(this.router.url?.includes("mes-demandes-dashboard")){
      this.statut = this.route.snapshot.params["statut"]
      this.fromDashboard = true
    }
    //console.log(this.statut);
   // console.log(this.fromDashboard);

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
 
  listPEC(){
   // console.log("HElllllllllooooo")
    this.spinner.show();
    this.demandePecService.listPec(this.page-1,this.pageSize,this.userId,this.numero,this.matricule,this.nom,this.prenom,this.region,this.ia,this.date,this.objet,this.statut,this.type)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
         // console.log({data : data});
          this.demandePecList=data.payload;
          this.spinner.hide();
         // console.log({demandePecList : this.demandePecList});
          }
      }
    })
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

  getActeByNum(event:any){
    this.numero=event;
    this.demandePecService.listPec(this.page-1,this.pageSize,this.userId,this.numero,this.matricule,this.nom,this.prenom,"","",this.date,this.objet,this.statut,this.type)
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

  onSearchChange(value: string) {
   // console.log(value);
    this.searchQuery=value;
   // console.log(this.searchQuery);

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

  onSelectedType(event:any){
    this.statut=event;
    this.demandePecService.listPec(this.page-1,this.pageSize,this.userId,this.numero,this.matricule,this.nom,this.prenom,"","",this.date,this.objet,this.statut,this.type)
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

  initForm(): void {
    this.filtreAvanceForm= this._fb.group({
      numero: [''],
      type: [''],
      dateDemande: [''],
      statut: [''],
    });
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


  onCreateDemande() {
    this.router.navigate(['create-demande'], { relativeTo: this.route.parent })
  }

  onEditDemande(data: any) {
    this.router.navigate([data.id, 'edit-demande'], { relativeTo: this.route.parent });
  }

  onViewDemande(data: any) {
    this.router.navigate([data.id, 'detail-view'], { relativeTo: this.route.parent })
  }
  
  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
  //  console.log("Filtrons");
   // console.log({ formulaire: this.filtreAvanceForm.value});
    this.demandePecService.listPec(
      this.page - 1,
      this.pageSize,
      this.userId,
      this.filtreAvanceForm.value.numero,
      "",
      "",
      "",
      "",
      "",
      this.filtreAvanceForm.value.dateDemande,
      "",
      this.filtreAvanceForm.value.statut,
      this.filtreAvanceForm.value.type,
    ).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
        //  console.log({ data: data });
          this.demandePecList = data.payload;
        }
        // Nettoyer le formulaire après la recherche réussie
       this.filtreAvanceForm.reset();
      }
    });
   // console.log('Result');
    this.closeModal();
  }

}
const DATA: any[] = [
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
    status:'SOUMISE'
  },
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
    status:'SOUMISE'
  },
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
     status:'VALIDEER'
  },
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
     status:'VALIDEER'
  },
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
     status:'AMODIFIER'
  },
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
     status:'REJETEER'
  },
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
     status:'VALIDEER'
  },
  {
    num_demande:1093,
    typDemande:'Evacuation sanitaire',
    dateDemande:'01-01-2024',
     status:'SOUMISE'
  }
]

