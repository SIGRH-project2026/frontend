import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {DemandeStage, Discipline} from "../../../../../models/demande-stage.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {CredentialsService} from "../../../../../services/credentials.service";
import {Profil} from "../../../../../models/utilisateur";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {

  headers: string[]  = ['N° Demande', 'Demandeur', 'Téléphone','Date Début','Date Fin','Statut', 'Action'];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  demandes: DemandeStage[] = [];
  collapsed: boolean = false;
  text = '';
  closeResult = '';
  canConnectedUserCreateDemandeStage = false;
  searchForm!: FormGroup;
  demandeForm!: FormGroup;
  discipleStages: Discipline[] = []
  selectedType = ""



  constructor(
      private router: Router,
      private route: ActivatedRoute,
      public modalService: NgbModal = inject(NgbModal),
      private demandeStageService: DemandeStageService,
      private formBuilder: FormBuilder,
      private alert : AlertService,
      private credentialSercice: CredentialsService,
      private spinner: NgxSpinnerService
  ) { }

  statutDemandeStage = ''
  showOtherButton = true;

  ngOnInit(): void {
    this.statutDemandeStage = sessionStorage.getItem('statutDemandeStage') ?? ''
    switch (this.statutDemandeStage){
      case 'ALL':
        this.getAllDemandeStage(0,10,"","","","","","","","")
        break;
      case 'AUTORISER':
        this.getAllDemandeStage(0,10,"","","","","","","","AUTORISER")
          this.showOtherButton = false;
        break;
      case 'ENREGISTRER':
        this.getAllDemandeStage(0,10,"","","","","","","","ENREGISTRER")
        this.showOtherButton = false;
        break;
      case 'NONAUTORISER':
        this.getAllDemandeStage(0,10,"","","","","","","","NONAUTORISER")
        this.showOtherButton = false;
        break;

    }
    this.initSearchForm()
    this.initDemandeForm()
    this.getAllDisciplineStage()
    this.canConnectedUserCreateDemandeStage = this.canCreateDemandeStage()
  }

  /**
   * initialisation formulaire demande
   */
  initDemandeForm(){
    this.demandeForm = this.formBuilder.group({
      numeroDemande: [''],
      prenomDemandeur: [''],
      nomDemandeur: [''],
      disciplineStage: [''],
      dateDebut: [''],
      dateFin: [''],
      statutDemandeStage: ['']

    });
  }

  /**
   * filter demande de stage
   */
  onFilterDemandeStage(): void {
    switch (this.statutDemandeStage){
      case 'ALL':
        this.getAllDemandeStage(0,10,"",this.demandeForm.value['numeroDemande'],this.demandeForm.value['prenomDemandeur'],this.demandeForm.value['nomDemandeur'],this.demandeForm.value['disciplineStage'],this.demandeForm.value['dateDebut'],this.demandeForm.value['dateFin'],this.demandeForm.value['statutDemandeStage'])
        break;
      case 'AUTORISER':
        this.getAllDemandeStage(0,10,"",this.demandeForm.value['numeroDemande'],this.demandeForm.value['prenomDemandeur'],this.demandeForm.value['nomDemandeur'],this.demandeForm.value['disciplineStage'],this.demandeForm.value['dateDebut'],this.demandeForm.value['dateFin'],'AUTORISER')
        break;
      case 'ENREGISTRER':
        this.getAllDemandeStage(0,10,"",this.demandeForm.value['numeroDemande'],this.demandeForm.value['prenomDemandeur'],this.demandeForm.value['nomDemandeur'],this.demandeForm.value['disciplineStage'],this.demandeForm.value['dateDebut'],this.demandeForm.value['dateFin'],'ENREGISTRER')
        break;
      case 'NONAUTORISER':
        this.getAllDemandeStage(0,10,"",this.demandeForm.value['numeroDemande'],this.demandeForm.value['prenomDemandeur'],this.demandeForm.value['nomDemandeur'],this.demandeForm.value['disciplineStage'],this.demandeForm.value['dateDebut'],this.demandeForm.value['dateFin'],'NONAUTORISER')
        break;

    }
      // fermeture modal
      this.closeModal()
  }


  /**
   * creation demande de stage
   */
  canCreateDemandeStage(){
    // profil apte a effectuer une demande de stage
    // ADMIN-DRH et Directeur-DRH peuvent créer en secours lorsque la division métier (DFC) n'est pas disponible
    let profils = [ 'Chef-division-dfc', 'ADMIN-DRH', 'Directeur-DRH']
    // let profils = ['Chef-bureau-dfc', 'Chef-division-dfc','Agent-bureau-dfc','Chef-division-dgcaa','Chef-division-das','Chef-division-dgpeec']
    // profil de l'utilisateyr connecter
    let userProfils = this.credentialSercice.getUserInfos()?.profil

    // verification ...
    return userProfils!.some((item: Profil) => profils!.includes(item.code!));
  }

  /**
   * L'ADMIN-DRH et le Directeur-DRH ont une vue/gestion globale : ils agissent en secours
   * de la division métier (DFC) et peuvent traiter une demande de bout en bout.
   */
  isAdminDrh(): boolean {
    let userProfils = this.credentialSercice.getUserInfos()?.profil
    return userProfils?.some((item: Profil) => item.code === 'ADMIN-DRH' || item.code === 'Directeur-DRH') ?? false
  }


  /**
   * verifier si l'utilisateur connecter est apte a creer une demande de stage
   * @param demande
   */
  canGiverAdvice(demande: DemandeStage){

    if (demande.division === undefined)
      return false
    let userProfils = this.credentialSercice.getUserInfos()?.profil

    return (this.isAdminDrh() || userProfils?.filter(profile => demande.division.code.toLowerCase() ===  (this.lenProfilCode(profile.code) === 2 ? profile.code.split('-')[1].toLowerCase() : profile.code.split('-')[2].toLowerCase())).length != 0) && demande.statutDemandeStage.code === 'ENREGISTRER'

  }

  lenProfilCode(profils: string){
    return profils.split('-').length;
  }

  canGiverSetAttestationAndRapport(demande: DemandeStage){
    if (demande.division === undefined)
      return false
    let userProfils = this.credentialSercice.getUserInfos()?.profil

    return (this.isAdminDrh() || userProfils?.filter(profil => demande.division.code.toLowerCase() ===  (this.lenProfilCode(profil.code) === 2 ? profil.code.split('-')[1].toLowerCase() : profil.code.split('-')[2].toLowerCase())).length != 0) && demande.statutDemandeStage.code === 'AUTORISER'
  }

  canGiverSetAttestation(demande: DemandeStage){
    if (demande.division === undefined)
      return false
    let userProfils = this.credentialSercice.getUserInfos()?.profil

    return (this.isAdminDrh() || userProfils?.filter(profil => profil.code === 'Chef-division-dfc').length != 0) && demande.statutDemandeStage.code === 'AUTORISER'
  }


  verifyIfSameDivision(){

  }

  /**
   * recherche pour filtrer
   */
  onSearchAll(): void {
    switch (this.statutDemandeStage){
      case 'ALL':
        this.getAllDemandeStage(0,10,this.searchForm.value.searchQuery,"","","","","","","")
        break;
      case 'AUTORISER':
        this.getAllDemandeStage(0,10,this.searchForm.value.searchQuery,"","","","","","","AUTORISER")
        break;
      case 'ENREGISTRER':
        this.getAllDemandeStage(0,10,this.searchForm.value.searchQuery,"","","","","","","ENREGISTRER")
        break;
      case 'NONAUTORISER':
        this.getAllDemandeStage(0,10,this.searchForm.value.searchQuery,"","","","","","","NONAUTORISER")
        break;

    }

  }
  initSearchForm(){
    this.searchForm = this.formBuilder.group({
      searchQuery: [''] // Initialize the input field with an empty string
    });

  }


  /**
   * recuperation de la liste des dscipline de stage
   */
  getAllDisciplineStage(){
    this.demandeStageService.getAllDisciplineStage().subscribe((res)=>{
      this.discipleStages = res.payload
    })
  }


  /**
   * initialisation formulaire filtre denabde de stage
   */
  initFormFilterByDemandeType(){
    switch (this.statutDemandeStage){
      case 'ALL':
        this.getAllDemandeStage(0,10,this.searchForm.value.searchQuery,"","","","","","",this.selectedType)
        break;
      case 'AUTORISER':
        this.getAllDemandeStage(0,10,'',"","","","","","","AUTORISER")
        break;
      case 'ENREGISTRER':
        this.getAllDemandeStage(0,10,'',"","","","","","","ENREGISTRER")
        break;
      case 'NONAUTORISER':
        this.getAllDemandeStage(0,10,'',"","","","","","","NONAUTORISER")
        break;

    }
  }

  /**
   * recuperation de la liste des demande de stage
   * @param page
   * @param size
   * @param filterValue
   * @param numero
   * @param prenomDemandeur
   * @param nomDemandeur
   * @param discipline
   * @param dateDebut
   * @param dateFin
   * @param statut
   */
  getAllDemandeStage(page: number, size: number, filterValue: string, numero: string, prenomDemandeur: string, nomDemandeur: string,  discipline: string,dateDebut: string,dateFin: string,statut: string){
    this.spinner.show()
    this.demandeStageService.getAll(page, size, filterValue, numero, prenomDemandeur, nomDemandeur,  discipline,dateDebut,dateFin,statut)
        .subscribe((res)=>{
          if (res.status === "OK"){

            this.demandes = res.payload
            this.collectionSize = res.metadata?.totalElements ?? 0
            this.pageSize = res.metadata?.size ?? 0
            this.spinner.hide()
          }else{
            this.spinner.hide()
            this.alert.showAlert({status: res.status, message: res.message, titre: "Liste des demandes de stage"});
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


  /**
   * gestion du nombre d'item a afficher
   * @param event
   */
  refreshData(event: any) {
    switch (this.statutDemandeStage){
      case 'ALL':
        this.getAllDemandeStage(0,10,'',"","","","","","","")
        break;
      case 'AUTORISER':
        this.getAllDemandeStage(0,10,'',"","","","","","","AUTORISER")
        break;
      case 'ENREGISTRER':
        this.getAllDemandeStage(0,10,'',"","","","","","","ENREGISTRER")
        break;
      case 'NONAUTORISER':
        this.getAllDemandeStage(0,10,'',"","","","","","","NONAUTORISER")
        break;

    }
  }


  /**
   * pagination
   * @param event
   */
  refreshData1(event: any) {
    if (event.target['text'] != undefined && event.target['text'] != "««" && event.target['text'] != "«" && event.target['text'] != "»" && event.target['text'] != "»»"){
      switch (this.statutDemandeStage){
        case 'ALL':
          this.getAllDemandeStage(+event.target['text']-1,10,'',"","","","","","",this.selectedType)
          break;
        case 'AUTORISER':
          this.getAllDemandeStage(+event.target['text']-1,10,'',"","","","","","",'AUTORISER')
          break;
        case 'ENREGISTRER':
          this.getAllDemandeStage(+event.target['text']-1,10,'',"","","","","","",'ENREGISTRER')
          break;
        case 'NONAUTORISER':
          this.getAllDemandeStage(+event.target['text']-1,10,'',"","","","","","",'NONAUTORISER')
          break;

      }

    }

  }


  /**
   * creation demande de stage
   */
  onCreateDemande() {
    this.router.navigate(['create-demande'], { relativeTo: this.route.parent })
  }


  /**
   * modificatin demande de stage
   * @param data
   */
  onEditDemande(data: any) {
    this.router.navigate(['edit-demande',data.id], { relativeTo: this.route.parent });
  }


  /**
   * visioner demande de stage
   * @param data
   */
  onViewDemande(data: any) {
    this.router.navigate(['detail-view',data.id], { relativeTo: this.route.parent })
  }

  onImputerDemande(data: any) {
    this.router.navigate(['imputer-demande', data.id], { relativeTo: this.route.parent });
  }

  /**
   * donner son avis
   * @param data
   */
  onDonnerAvisDemande(data: any) {
    this.router.navigate(['donner-avis',data.id], { relativeTo: this.route.parent });
  }


  /**
   * enregisrer rapport de stage
   * @param data
   */
  onSaveRapport(data: any) {
    this.router.navigate(['rapport-stage',data.id], { relativeTo: this.route.parent });
  }


  /**
   * enregistrer attestation de stage
   * @param data
   */
  onSaveAttestation(data: any) {
    this.router.navigate([ 'attestation-stage',data.id], { relativeTo: this.route.parent });
  }

  /**
    * enregistrer autorisation de stage
    * @param data
    */
  onSaveAutorisation(data: any) {
    this.router.navigate(['autorisation-stage', data.id], { relativeTo: this.route.parent });
  }

  /**
   * telechargement fichier
   * @param fileName
   */
  downloadFile(fileName: string){

    this.demandeStageService.downloadFile(fileName)
  }


  closeModal() {
    this.modalService.dismissAll();
  }

  canAuthorize() {
    // profil apte a effectuer une demande de stage
    // ADMIN-DRH et Directeur-DRH peuvent autoriser en secours lorsque la division métier (DFC) n'est pas disponible
    let profils = [ 'Chef-division-dfc', 'ADMIN-DRH', 'Directeur-DRH']
    // let profils = ['Chef-bureau-dfc', 'Chef-division-dfc','Agent-bureau-dfc','Chef-division-dgcaa','Chef-division-das','Chef-division-dgpeec']
    // profil de l'utilisateyr connecter
    let userProfils = this.credentialSercice.getUserInfos()?.profil

    // verification ...
    return userProfils!.some((item: Profil) => profils!.includes(item.code!));
  }
}
