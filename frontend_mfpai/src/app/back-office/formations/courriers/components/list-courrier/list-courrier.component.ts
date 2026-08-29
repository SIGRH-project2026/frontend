import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CourrierService} from "../../../../../services/courrier.service";
import {Demande} from "../../../../../models/demande.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {Bureau, Direction, Division, Profil, Service} from "../../../../../models/utilisateur";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {CredentialsService} from "../../../../../services/credentials.service";
import {CourrierResponse} from "../../../../../models/courrier.interface";
import Swal from "sweetalert2";
import {Location} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-courrier',
  templateUrl: './list-courrier.component.html',
  styleUrls: ['./list-courrier.component.css']
})
export class ListCourrierComponent implements OnInit {


  headers: string[] =  ['N° Référence', 'Date d\'enregistrement', 'Type de demande','Type courrier', 'Entité responsable','Statut','Action'];
  headers_: string[] =  ['N° Référence', 'Date d\'enregistrement', 'Type de demande','Type courrier', 'Entité responsable','Statut'];

  courrierList: CourrierResponse[] = [];
  closeResult = '';
  searchForm!: FormGroup;
  formFilterByTypeCourrier!: FormGroup;
  selectedType: string = '';
  selectedDirection: string = ''
  advancedSearchForm!: FormGroup;
  directions!: Direction[]
  divisions!: Division[]
  bureaux!: Bureau[]
  services!: Service[]
  isOk = true;
  initOk = true;
  canCreateCourrier = false;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  listTypeDemande!: Demande []
  statutCourrier = ''


  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    public courrierService: CourrierService,
    private formBuilder: FormBuilder,
    private referenceService: ReferencesService,
    private alert : AlertService,
    private credentialService: CredentialsService,
    private spinner: NgxSpinnerService
  ) { }

  initFormFilterByCourrierType(){

    switch (this.statutCourrier) {
      case 'ALL':
        this.getAllCourrier(0, 10, "", "",  this.selectedType, "",  "","","")
        break
      case 'TRAITER':
        this.getAllCourrier(0, 10, "", "", this.selectedType, "",  "","",'TRAITER')
        break
      case 'NONTRAITER':
        this.getAllCourrier(0, 10, "", "", this.selectedType, "",  "",'','NONTRAITER')
        break
    }
  }

  onSelectedDirection(){
    this.getDivisionByDirectionCode(this.advancedSearchForm.value["direction"])
    this.advancedSearchForm.value["direction"] === "AUD" ? this.isOk = true : this.isOk = false;
    this.getServiceByBureauCode()
    this.initOk = false
  }

  onSelectedDivision(){
    this.getBureauByDivisionCode()

  }

  listTypeDemandeCourrier(){
    this.courrierService.listTypeDemandeCourrier()
        .subscribe((res)=>{
          this.listTypeDemande = res.payload
        })
  }


  /**
   * recuperation service via bureau
   */
  getServiceByBureauCode(){
    this.referenceService.listServiceByDirectionCode(this.advancedSearchForm.value["direction"]).subscribe((res)=>{
      this.services = res.data
    })
  }

  /**
   * recuperation direation via code
   * @param code
   */
  getDivisionByDirectionCode(code: string){
    this.referenceService.listDivisionByDirectionCode(code).subscribe((res)=>{
      this.divisions = res.data
    })
  }

  /**
   * verifier si l'utilisateir connecter peux
   * creer une campagne
   */
  verifyIfUserCanCreateCourrier(){
    let profils = ['Chef-bureau-buco', 'Assistant-DRH']
    let userProfils = this.credentialService.getUserInfos()?.profil
    this.canCreateCourrier =  userProfils!.some((item: Profil) => profils!.includes(item.code!));
  }

  getBureauByDivisionCode(){
    this.referenceService.listBureauByCode(this.advancedSearchForm.value["division"]).subscribe((res)=>{
      this.bureaux = res.data
    })
  }
  getAllDirection(){
    this.referenceService.listDirections().subscribe((res)=>{
      this.directions = res.data
    })
  }


  initAdvancedSearchForm(){
    this.advancedSearchForm = this.formBuilder.group({
      typeDemande: [''],
      typeCourrier: [''],
      direction: [''],
      division: [''],
      bureau: [''],
      service: ['']
    });
  }


  initSearchForm(){
    this.searchForm = this.formBuilder.group({
      searchQuery: [''] // Initialize the input field with an empty string
    });
  }

    onAdvancedSearchForm(): void {
      switch (this.statutCourrier) {
        case 'ALL':
          this.getAllCourrier(0, 10, '', '',  '', this.advancedSearchForm.value['direction'],  this.advancedSearchForm.value['division'],this.advancedSearchForm.value['typeCourrier'],"")
          break
        case 'TRAITER':
          this.getAllCourrier(0, 10, '', '',  '', this.advancedSearchForm.value['direction'],  this.advancedSearchForm.value['division'],this.advancedSearchForm.value['typeCourrier'],"TRAITER")
          break
        case 'NONTRAITER':
          this.getAllCourrier(0, 10, '', '',  '', this.advancedSearchForm.value['direction'],  this.advancedSearchForm.value['division'],this.advancedSearchForm.value['typeCourrier'],"NONTRAITER")
          break
      }
        // Implement form submission logic here
      this.closeModal()
  }

  onSearchAll(): void {
    switch (this.statutCourrier) {
      case 'ALL':
        this.getAllCourrier(0, 10, this.searchForm.value['searchQuery'], "",  '', "",  "","","")
        break
      case 'TRAITER':
        this.getAllCourrier(0, 10, this.searchForm.value['searchQuery'], "", '', "",  "","",'TRAITER')
        break
      case 'NONTRAITER':
        this.getAllCourrier(0, 10, this.searchForm.value['searchQuery'], "", '', "",  "",'','NONTRAITER')
        break
    }
  }

  profil: string | undefined = '';
  canTraiterCourrier(){
     let profils = ['Chef-division-dfc', 'Chef-division-dgpeec','Chef-division-dgcaa','Chef-division-das']
     // profil de l'utilisateyr connecter
     let userProfils = this.credentialService.getUserInfos()?.profil

     // verification ...
     return userProfils!.some((item: Profil) => profils!.includes(item.code!));
  }
  canTraiterCourrier_(){
     let profils = ['Chef-division-dfc', 'Chef-division-dgpeec','Chef-division-dgcaa','Chef-division-das','Assistant-DRH']
     // profil de l'utilisateyr connecter
     let userProfils = this.credentialService.getUserInfos()?.profil

     // verification ...
     return userProfils!.some((item: Profil) => profils!.includes(item.code!));
  }

  getProfil(){
    this.profil = this.credentialService.getUserInfos()?.profil[0].code
  }

  haveSameDivision(code: string){

    if (this.profil === 'Assistant-DRH'){
      return false;
    }
    let userProfils = this.credentialService.getUserInfos()?.profil
    for (let i = 0; i < userProfils!.length; i++) {
      if (userProfils![i].code.split('-')[2].toLowerCase() === code.toLowerCase())
        return true
    }
    return false;
  }


  ngOnInit(): void {
    this.getProfil()
    this.statutCourrier = sessionStorage.getItem('statutCourrier') ?? ''

    switch (this.statutCourrier) {
      case 'ALL':
        this.getAllCourrier(0, 10, "", "",  '', "",  "","","")
        break
      case 'TRAITER':
        this.getAllCourrier(0, 10, "", "", '', "",  "","",'TRAITER')
        break
      case 'NONTRAITER':
        this.getAllCourrier(0, 10, "", "", '', "",  "",'','NONTRAITER')
        break
    }
    this.listTypeDemandeCourrier();

    this.verifyIfUserCanCreateCourrier()
    // init search form
    this.initSearchForm()
    this.initAdvancedSearchForm();
    this.getAllDirection()
  }
  getAllCourrier(page: number, size: number, filterValue: string, reference: string, typeDemande: string, direction: string,  division: string,typeCourrier: string,statut: string){
    this.spinner.show()
    this.courrierService.getAll(page, size, filterValue, reference, typeDemande, direction,  division,typeCourrier, statut).subscribe((res)=>{
      if (res.status === "OK"){
        this.spinner.hide()
        this.courrierList = res.payload
        this.collectionSize = res.metadata?.totalElements ?? 0
        this.pageSize = res.metadata?.size ?? 0
      }else{
        this.spinner.hide()
        this.alert.showAlert({status: res.status, message: res.message, titre: "Enregistrement Courrier"});
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


  refreshData(event: any) {
    this.page = 1;
    switch (this.statutCourrier) {
      case 'ALL':
        this.getAllCourrier(0, this.pageSize, "", "",  '', "",  "","","")
        break
      case 'TRAITER':
        this.getAllCourrier(0, this.pageSize, "", "", '', "",  "","",'TRAITER')
        break
      case 'NONTRAITER':
        this.getAllCourrier(0, this.pageSize, "", "", '', "",  "",'','NONTRAITER')
        break
    }
  }


  onPageChange(page: number) {
    this.page = page;
    switch (this.statutCourrier) {
      case 'ALL':
        this.getAllCourrier(page - 1, this.pageSize, "", "",  '', "",  "","","")
        break
      case 'TRAITER':
        this.getAllCourrier(page - 1, this.pageSize, "", "", '', "",  "","",'TRAITER')
        break
      case 'NONTRAITER':
        this.getAllCourrier(page - 1, this.pageSize, "", "", '', "",  "",'','NONTRAITER')
        break
    }
  }

  onCreateCourrier() {
    this.router.navigate(['create-courrier'],{ relativeTo: this.route });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    this.closeModal();
  }

  traiterCourrier(id: number) {

    Swal.fire({
      title: 'Confirmation',
      text: 'Le courrier est-il traité ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show()
        this.courrierService.traiterCourrier(id.toString()).subscribe((res)=>{
          if (res.status === 'OK'){
            this.spinner.hide()
            switch (this.statutCourrier) {
              case 'ALL':
                this.getAllCourrier(0, 10, "", "",  '', "",  "","","")
                break
              case 'TRAITER':
                this.getAllCourrier(0, 10, "", "", '', "",  "","",'TRAITER')
                break
              case 'NONTRAITER':
                this.getAllCourrier(0, 10, "", "", '', "",  "",'','NONTRAITER')
                break
            }
          }
        })
        Swal.fire({
          html: 'Le courrier a été traité avec succès.',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        })
      }else{

      }
    });
  }

  changeStatus(id: string) {
    this.courrierService.traiterCourrier(id).subscribe((res)=>{
      console.log(res.message)
    })

  }


}

