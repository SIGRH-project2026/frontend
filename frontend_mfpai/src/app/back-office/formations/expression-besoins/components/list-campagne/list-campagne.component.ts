import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCreateCampagneComponent } from '../edit-create-campagne/edit-create-campagne.component';
import Swal from 'sweetalert2';
import {CampagneService} from "../../../../../services/campagne.service";
import {ResponseApi} from "../../../../../shared/models/utils/response-api.model";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {CampagneInterface} from "../../../../../models/campagne.interface";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {CredentialsService} from "../../../../../services/credentials.service";
import {NgxSpinnerService} from "ngx-spinner";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-campagne',
  templateUrl: './list-campagne.component.html',
  styleUrls: ['./list-campagne.component.css']
})
export class ListCampagneComponent implements OnInit {
  
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  campaigns: CampagneInterface[] = []; // Initialize with an empty array or fetch from a service
  closeResult = '';
  statusResponse: string | undefined = ""
  selectedYear: string | null = "";
  role: string | undefined;
  dates: string[] = []


  searchData = {
    nom: '',
    dateDebut: '',
    dateFin: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private campagneService : CampagneService,
    private alert : AlertService,
    private spinner: NgxSpinnerService,
    private credentialService: CredentialsService
  ) { }


  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.dates.push(year.toString())
    }
    this.role = this.credentialService.getUserInfos()?.profil[0].code
    this.isCreateOrEditCampagneEnable()
    // if (localStorage.getItem("page")){
    //   this.page = +localStorage.getItem("page")!
    //   this.getAllCampagne(+localStorage.getItem("page")!-1,this.pageSize,"", this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);
      // localStorage.removeItem("page")
    // }else{
      this.getAllCampagne(this.page - 1,this.pageSize,"", this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);

    // }

  }


   isCreateOrEditCampagneEnable(): boolean{
    let roles = ['Chef-division-dfc']
    if (roles.includes(this.role || '')){
      return true
    }else{

      return false
    }
  }

  isStartOrStopCampagne(): boolean{
    // let roles = ['Chef-division-dfc','Chef-bureau-dfc','Directeur-DRH','Chef-EFF','Chef-etablissement','Representant-IA','Représentant-IEF']
    let roles = ['Chef-division-dfc']
    if (roles.includes(this.role || ''))
      return true
    return false
  }


  isSaveExpressionDeBesoin(){
    let roles = ['Chef-division-dfc','Chef-division-das','Directeur-DRH','Chef-service','Chef-EFF','Chef-etablissement','Representant-IA','Représentant-IEF','Chef-division-dgcaa','Chef-division-dgpeec']
    if (roles.includes(this.role  || ''))
      return true

    return false
  }

  canTreateExpressionDeBesoin(){
    let roles = ['Chef-division-dfc','Chef-bureau-dfc','Agent-bureau-dfc']
    if (roles.includes(this.role || ''))
      return true
    return  false
  }

  canTreateExport(){
    let roles = ['Chef-division-dfc','Directeur-DRH']
    if (roles.includes(this.role || ''))
      return true
    return  false
  }

  export(campagn: any){
    if (campagn.numberOfExpressionDeBesoin != 0){
      this.campagneService.downloadFile(campagn)
    }else{
      this.alert.showAlert({status:"EXCEPTION",message: "Aucune expression de besoin n'a encore été enregistrée sur cette campagne.",titre: "Exportation EB impossible"})
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



  getAllCampagne(page: number, size: number, filterValue: string, nom: string, dateDebut: string, dateFin: string){
    this.spinner.show();
    this.campagneService.getAll(page,size,filterValue,nom,dateDebut,dateFin).subscribe((res: ResponseApi)=>{

      if (res.status == "EXCEPTION"){
        this.spinner.hide();
        this.alert.showAlert({status: res.status, message: res.message, titre: "Liste Campagne."});
      }else{
        this.campaigns = res.payload;
        console.log(this.campaigns[0]);

        this.spinner.hide();
        this.collectionSize = res.metadata?.totalElements ?? 0
        this.pageSize = res.metadata?.size ?? 0
      }
    })
    localStorage.removeItem("page")
  }


  startCampagne(campagne: CampagneInterface){
    this.campagneService.startCampagne(campagne.id).subscribe((res: ResponseApi)=>{
      this.statusResponse = res.status
      if (this.statusResponse === "EXCEPTION"){
        this.alert.showAlert({status: res.status, message: res.message, titre: "Démarrage Campagne."});
      }else {
        Swal.fire({
          // title: 'En cours',
          html: `La campagne du <b>${campagne.dateDebut}<b/> au <b>${campagne.dateFin}<b/> est en cours.`,
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        })
      }
      this.getAllCampagne(this.page-1,this.pageSize,"", this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);


    })
  }




  stopCampagne(campagne: CampagneInterface){
    this.campagneService.stopCampagne(campagne.id).subscribe((res: ResponseApi)=>{
      if (this.statusResponse === "EXCEPTION"){
        this.alert.showAlert({status: res.status, message: res.message, titre: "Clôture Campagne."});
      }else{
        Swal.fire({
          // title: 'Clôturée',
          html: `La campagne du <b>${campagne.dateDebut}<b/> au <b>${campagne.dateFin}<b/> est clôturée.`,
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        })

      }
      this.getAllCampagne(this.page-1,this.pageSize,"", this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);
    })
  }

  onCreateCampaign() {
    const modalRef = this.modalService.open(EditCreateCampagneComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.editData = null; // Pass null for creating a new campaign
    modalRef.result.then((result) => {
      this.getAllCampagne(0,this.pageSize,"", this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);
    }, (reason) => {
    });
  }

  onEditCampaign(campaign: CampagneInterface) {
    const modalRef = this.modalService.open(EditCreateCampagneComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.editData = { ...campaign }; // Pass the campaign data for editing
    modalRef.result.then((result) => {
      this.getAllCampagne(this.page-1,this.pageSize,"", this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);
    }, (reason) => {
    });
  }


  onDemarrer(campagne: CampagneInterface): void {
    Swal.fire({
      // title: 'Confirmation',
      text: "Voulez-vous démarrer cette campagne ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {


      if (result.isConfirmed) {
        this.startCampagne(campagne)
      }
    })

  }

  onCloturer(campagne: CampagneInterface): void {
    Swal.fire({
      // title: 'Confirmation',
      text: "Voulez-vous clôturer cette campagne ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stopCampagne(campagne)
      }
    })
  }



  onYearSelected(): void {
    this.pageSize = 10
    this.getAllCampagne(0,this.pageSize,this.selectedYear!, this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);
  }

  onSubmitExpression(campagne: CampagneInterface) {
    // localStorage.setItem("page",this.page.toString())
    this.router.navigate(['soumettre-expression',campagne.id], { relativeTo: this.route.parent })
  }

  onTraitementExpression(campagne: CampagneInterface) {
    this.router.navigate([ 'traitement-expression',campagne.id], { relativeTo: this.route.parent })
  }

  onViewDetailCampagne(campagne: CampagneInterface) {
    this.router.navigate(['detail-expression',campagne.id], { relativeTo: this.route.parent })
  }

  renderClass(statut: string) {
    switch (statut) {
      case "NEW_CAMPAGNE":
        return "new-campaign";
      case "STARTED_CAMPAGNE":
        return "progress-campaign";
      case "ENDED_CAMPAGNE":
        return "closed-campaign";
      default:
        return "default-campaign";
    }
  }

  refreshData() {
    this.page = 1;
    this.getAllCampagne(0,this.pageSize,this.selectedYear!, this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);

  }


  onPageChange(page: number) {
    this.page = page;
    this.getAllCampagne(page - 1,this.pageSize,this.selectedYear!, this.searchData.nom ,this.searchData.dateDebut,this.searchData.dateFin);
  }



  onSearch(): void {
    this.page = 1
    this.getAllCampagne(0, this.pageSize, "", this.searchData.nom, this.searchData.dateDebut, this.searchData.dateFin);
  }

}

