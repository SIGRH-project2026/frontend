import {Component, OnInit, TemplateRef, inject, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {ParametreService} from "../../../../../services/parametre.service";
import {ParametreResponse} from "../../../../../models/parametre-response.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {Division} from "../../../../../models/utilisateur";
import {ReferencesService} from "../../../../../services/references.service";
import {NgxSpinnerService} from "ngx-spinner";

declare var $: any;
@Component({
  selector: 'app-list-indicateur',
  templateUrl: './list-indicateur.component.html',
  styleUrls: ['./list-indicateur.component.css']
})
export class ListIndicateurComponent  implements OnInit, AfterViewInit {

  headers: string[] = ['N° Indicateur', 'Libelle','Date', 'Responsable Activité', 'Divisions impliqués','Statut','Action'];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  indicateurs: ParametreResponse[] = [];
  closeResult = '';
    text = '';
  searchForm!: FormGroup;
  AdvanceSearchForm!: FormGroup;
  selectedType: string = '';
  divisionImpliques: Division[] = [];

  ngAfterViewInit(): void {
    this.getListDivisions()
  }

  /**
   * liste des division
   */
  getListDivisions(){
    this.referenceService.listDivisions().subscribe((res)=>{
      let listDivision = res.data
      listDivision.forEach((value: Division) => {
        this.divisionImpliques.push(value)
      })
      $('#selectDivisionImplique').selectpicker('refresh');
    })
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private parametreService: ParametreService,
    private formBuilder: FormBuilder,
    private alert : AlertService,
    private referenceService: ReferencesService,
    private spinner: NgxSpinnerService
  ) { }

  initForm(){
    this.AdvanceSearchForm = this.formBuilder.group({
      indicatorNumber: [''],
      libelle: [''],
      responsibleActivity: [''],
      involvedDivisions: [[]],
      startDate: [''],
      endDate: ['']
    });
  }



  initFormFilterByStatut(){
    this.page = 1;
    this.getAllParametres(0,this.pageSize,'','','','','',this.selectedType,'');
  }

  /**
   * la liste des parametres
   * @param page
   * @param size
   * @param filter
   * @param numero
   * @param libelle
   * @param date
   * @param responsableActivite
   * @param statut
   * @param divisions
   */
  getAllParametres(page: number,size: number, filter: string, numero: string, libelle: string, date: string,responsableActivite: string, statut: string,  divisions: string){
    this.spinner.show()
    this.parametreService.getAllParametre(page, size,filter,numero,libelle,date,responsableActivite,statut, divisions).subscribe((res)=>{
      if (res.status === "OK"){
      this.indicateurs = res.payload
      this.collectionSize = res.metadata?.totalElements ?? 0
      this.pageSize = res.metadata?.size ?? 0
        this.spinner.hide()
      }else{
        this.spinner.hide()
        this.alert.showAlert({status: res.status, message: res.message, titre: "Enregistrement Indicateur"});
      }
    })
  }

  /**
   * activer et desactiver parametre
   * @param id
   * @param data
   */
  enableOrDisableParametre(id:string, data: any){
    this.spinner.show()
  this.parametreService.enableOrDisableParametre(id).subscribe((res)=>{
    if (res.status === 'OK'){
      this.spinner.hide()
      Swal.fire({
        title: this.text,
        html: `L'indicateur <b>${data.numero}</b> a été ${this.text.toLowerCase()}.`,
        icon: 'success',
        timer: 1500,
        showCancelButton: false,
        showConfirmButton: false
      })
      this.getAllParametres(0,this.pageSize,'','','','','','','');

    }
  })
  }


  ngOnInit(): void {
    this.initForm()
    this.initSearchForm()
    this.getListDivisions()
    this.getAllParametres(0,this.pageSize,'','','','','','','');
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
    this.getAllParametres(0, event, this.searchForm.value.searchQuery,'','','','',this.selectedType,'')
  }
  onSearchAll(): void {
    this.getAllParametres(0,this.pageSize,this.searchForm.value.searchQuery,'','','','','','');

  }

  initSearchForm(){
    this.searchForm = this.formBuilder.group({
      searchQuery: ['']
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.getAllParametres(page - 1, this.pageSize, this.searchForm.value.searchQuery,'','','','',this.selectedType,'')
  }

  /**
   * creer indicateur
   */
  onCreateIndicateur() {
    this.router.navigate(['create-indicateur'], { relativeTo: this.route.parent })
  }


  /**
   * modifier indicateur
   * @param data
   */
  onEditIndicateur(data: any) {
    sessionStorage.setItem('indicateur', JSON.stringify(data))
    this.router.navigate([ 'edit-indicateur', data.id], { relativeTo: this.route.parent })
  }


  /**
   * voir detail indicateur
   * @param data
   */
  onViewIndicateur(data: any) {
    this.router.navigate([ 'detail-indicateur',data.id], { relativeTo: this.route.parent })
  }


  /**
   * changer statut
   * @param data
   */
  changeStatus(data: ParametreResponse): void {
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
        if(data.statut === 'INACTIF'){
          this.text = "Activé";
          // data.status = true
        }else{
          this.text = "Désactivé";
          // data.status = false
        }
        this.enableOrDisableParametre(data.id.toString(), data)


      }
    })
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    this.getAllParametres(0, this.pageSize, '',this.AdvanceSearchForm.value['indicatorNumber'],this.AdvanceSearchForm.value['libelle'],this.AdvanceSearchForm.value['startDate'],this.AdvanceSearchForm.value['responsibleActivity'],'',this.AdvanceSearchForm.value['involvedDivisions'].join(','))
    this.closeModal();

  }

}


