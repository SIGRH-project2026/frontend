import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActeService } from 'src/app/services/acteService.service';
import { ActeDTO } from '../models/ActeDTO';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { ResponseApi } from 'src/app/models/response-api';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileService } from 'src/app/shared/services/files/file.service';
import { CredentialsService } from 'src/app/services/credentials.service';
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {NgxSpinner, NgxSpinnerService} from "ngx-spinner";
import { TypeActeDTO } from '../models/TypeActeDTO';

@Component({
  selector: 'app-liste-demandes',
  templateUrl: './liste-demandes.component.html',
  styleUrls: ['./liste-demandes.component.css']
})
export class ListeDemandesComponent  implements OnInit{
getListActeFiltres // la requête c'est bien passé, on traite l'information
() {
throw new Error('Method not implemented.');
}

  headers!: string[];
  page = 1;
	pageSize = 10;
  filter:string="";
  filtreAvanceForm!:FormGroup;
	collectionSize = 0;
	demandeList!: any[];
  acte!:ActeDTO
  collapsed:boolean = false;
  closeResult = '';
  actList:any[]=[];
  typeActe:string="";
  typeActes: TypeActeDTO[] = [];
  referenceActe:string='';
  date:string="";
  statutActe:string="";
  reference:string="";
  userInfos: any;
  userId:any;
  searchQuery: string = "";
  filteredItems:any[]=[];
  fromDashboard : boolean = false



  constructor(
    public modalService: NgbModal = inject(NgbModal),
    private route: ActivatedRoute,
    private router: Router,
    private readonly acteService:ActeService,
    private spinner : NgxSpinnerService,
    private readonly credentialService: CredentialsService,

    private readonly _fb : FormBuilder,
    private readonly fileService:FileService,

   ) { 
    this.userInfos = this.credentialService.getUserInfos();
    this.userId=this.userInfos.id;
   }

  ngOnInit(): void {
    
    // Initialize data and headers
    this.headers = ['N° Référence','Date demande', 'Acte', "Type d'acte",'Statut','Action'];
    this.refreshData();
      this.listAct();           
    this.initForm();
    this.getTypeActes();
  }

  getTypeActes(): void {
    this.acteService.listTypeActe().subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes('OK')) {
          this.typeActes = data.payload ?? [];
        }
      }
    });
  }

 

  
  listAct(){
  //  console.log("HElllllllllooooo")
    this.acteService.listActes(this.page-1,this.pageSize,this.userId,"","","","","","")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
        //  console.log({data : data});
          this.actList=data.payload
           //console.log({actesList : this.actList});
           if(data.metadata){
            this.collectionSize = data.metadata.totalElements
          }
          }
      }
      
    })
  }

  modifier(idActe:number){
   // this.spinner.show();
    this.acteService.traiterActe(idActe,this.userId,"modifier","","")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
          //console.log({data : data});
          this.actList=data.payload
         //  console.log({actesList : this.actList});
          }
      }
    });
    window.location.reload();
  }

  matchSearchQuery(demande: any): boolean {
   // console.log({dm:demande});
    const searchValue = this.searchQuery.toLowerCase();
    let agent = demande.agent;
    let typeAA = demande.typeAA;
    let typeAG = demande.typeAG;
    let typeActe = demande.typeActe;
    let statutActe = demande.statutActe;
    if (typeAA != null && Object.values(typeAA).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    )) {
        return true;
    }
    if (typeAG != null && Object.values(typeAG).some(value =>
      value != null && value.toString().toLowerCase().includes(searchValue)
  )) {
      return true;
  }
    return Object.values(demande).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(agent).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(typeActe).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(statutActe).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    );
}

  onSelectedType(event:any){
    this.typeActe=event;
    this.acteService.listActes(this.page-1,this.pageSize,this.userId,"","",this.typeActe,"","","")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
         // console.log({data : data});
          this.actList=data.payload
          // console.log({actesList : this.actList});
          }
      }
    });
  }

  getActeByRef(event:any){
    this.referenceActe=event;
    this.acteService.listActes(this.page-1,this.pageSize,this.userId,this.referenceActe,"","","","","")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
          //console.log({data : data});
          this.actList=data.payload
          // console.log({actesList : this.actList});
          }
      }
    });

  }

  refreshData() {
		this.demandeList = DATA.map((user:any, i:any) => ({ id: i + 1, ...user })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }

  refresh(){
    //console.log(this.pageSize);
   // console.log(this.collectionSize)
    this.acteService.listActes(this.page-1,this.pageSize,this.userId,"","",this.typeActe,"","","")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
        {
         // console.log({data : data});
          this.actList=data.payload
          // console.log({actesList : this.actList});
          }
      }
    });
  }

  onCreateActe() {
    this.router.navigate(['ajout-acte'], { relativeTo: this.route.parent })
  }

  onViewActe(acte: any) {
    this.router.navigate([acte,'detail-acte'], { relativeTo: this.route.parent })
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
  initForm(): void {
    this.filtreAvanceForm= this._fb.group({
      referenceActe: [''],
      dateDemandeActe: [''],
      typeActe: [''],
    });
  }


  onSearch() {
   /* console.log('Result');
   // this.initForm();
    console.log({ reference: this.filtreAvanceForm.value.referenceActe });
    console.log({ type: this.filtreAvanceForm.value.typeActe });
    console.log({ date: this.filtreAvanceForm.value.dateDemandeActe });

    */
    this.acteService.listActes(
      this.page - 1,
      this.pageSize,
      this.userId,
      this.filtreAvanceForm.value.referenceActe,
      this.filtreAvanceForm.value.dateDemandeActe,
      this.filtreAvanceForm.value.typeActe,
      "",
      "",
      ""
    ).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
         // console.log({ data: data });
          this.actList = data.payload;
          //console.log({ actesList: this.actList });
        }
        // Nettoyer le formulaire après la recherche réussie
        this.filtreAvanceForm.reset();
      }
    });
  }

  telecharger(fileName:string){
  //  console.log(fileName);
    this.fileService.telecharger(fileName)
  }
  telechargerBordereau(bordereau:string){
  //  console.log(bordereau);
    this.fileService.telecharger(bordereau)
  }




  telechargerF(id:number){
   // console.log("telechargerrrrrrrrrrrrrrrrrrr");
   // console.log(id)
    this.acteService.getActe(id)
      .subscribe({
        next: (data: ResponseApi2) => {
          if (data.status?.includes("OK")) {
            this.acte = data.payload;
           /* console.log({ acte: this.acte });
            console.log({ pieces: this.acte.pieceJointes }); 
            console.log({ taille: this.acte.pieceJointes.length });
            */
            if (this.acte.pieceJointes.length > 0) {
              const num = this.acte.pieceJointes.length;
              const dernierElement = this.acte.pieceJointes[num - 1];
             // console.log("Dernier élément dans piecesJointes:", dernierElement);
              // Maintenant on utilise dernierElement
               this.fileService.telecharger(dernierElement.generatedName);
            } else {
            //  console.log("Aucun élément dans piecesJointes.");
            }
          }
        }
      });
    }

 onEditActe(acte: any) {
    this.router.navigate([acte,'edit-acte'], { relativeTo: this.route.parent })
  }


}








const DATA:any[] =  [
  { id:10001,  Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte de gestion', TypeActe: "Acte1", status: 'SOUMIS'},
  { id:10002, Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte administratif', TypeActe: "Acte1", status: 'AMODIFIER' },
  { id:10003, Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte administratif', TypeActe: "Acte1", status: 'TRANSMIS' },
  { id:10004, Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte administratif', TypeActe: "Acte1", status: 'VALIDER' },
  { id:10005, Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte administratif', TypeActe: "Acte1", status: 'INVALIDER' },
  { id:10006, Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte de gestion', TypeActe: "Acte1", status: 'AMODIFIER' },
  { id:10007, Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte de gestion', TypeActe: "Acte1", status: 'SOUMIS' },
  { id:10008, Reference:'mat009',Date_demande: '03/06/2020', Acte: 'Acte de gestion', TypeActe: "Acte1", status: 'SOUMIS', }
]
