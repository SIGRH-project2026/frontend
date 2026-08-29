// import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {PtaService} from "../../../../../services/pta.service";
import {PlanTravailAnnuel} from "../../../model/pta";
import {CredentialsService} from "../../../../../services/credentials.service";
import {NgxSpinnerService} from "ngx-spinner";
@Component({
  selector: 'app-list-pta',
  templateUrl: './list-pta.component.html',
  styleUrls: ['./list-pta.component.css']
})
export class ListPtaComponent implements OnInit {

  searchForm!: FormGroup;
  headers: string[] = ['N° PTA', 'Libellé PTA', 'Date', 'Actions'/*, 'Résultats', 'Sous actions',*/, 'Action'];
  page = 1;
  size = 10;

  pta!: PlanTravailAnnuel;
  ptaList: PlanTravailAnnuel[] = [];
  collectionSize = this.ptaList.length;

  dateDuJour: any = '';

  initPtaFormGroup!: FormGroup;
  advancedSearchForm!: FormGroup;
   direction: any;

  userInfos: any;
  constructor(
    private router: Router,
    // private datePipe: DatePipe,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private formBuilder: FormBuilder,
    private referenceService: ReferencesService,
    private ptaService: PtaService,
    private spinner: NgxSpinnerService,
    private credentialsService: CredentialsService,
  ) {

    this.userInfos = this.credentialsService.getUserInfos();
  }
//Coordinateur
  ngOnInit(): void {
    // this.dateDuJour = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
   // this.refreshData();
   this.getAllPTA(0, 10, "", "","", "","", "", "");

   this.filterValueSearch();
   this.lookingSearchForm()
    this.initForm();

    this.getDirections();


    this.userInfos = this.credentialsService.getUserInfos();



  }


  filterValueSearch(){
    this.searchForm = this.formBuilder.group({
      filterValue: [''] // Initialize the input field with an empty string
    });
  }


  onSearchAll(): void {
    this.getAllPTA(0, 10, this.searchForm.value.filterValue, "","", "","", "", "");
  }


  getDirections(){
    this.referenceService.listDirections().
    subscribe({
      next : (response:any)=>{
        if(response.success){
          this.direction = response.data
        }
      }
    })
  }



  getAllPTA(page: number, size: number, filter: string, numPta: string, libelle: string, responssable: string,
            division: string, debut: string, fin: string){
    this.ptaService.getListPTA(page, size, filter, numPta, libelle, responssable, division,debut, fin).subscribe((res)=>{
      this.spinner.show();
      if (res.status === "OK"){
        this.ptaList = res.payload;
        this.spinner.hide();
        this.collectionSize = res.metadata?.totalElements ?? 0;
        this.size = res.metadata?.size ?? 0;
      }else
        this.spinner.hide();
    })
  }

  /*
    create a new PTA
   */


  initForm() {
    this.initPtaFormGroup = this.formBuilder.group({
        nomPTA: ['', Validators.required],
        date: ['', Validators.required],
        direction: this.formBuilder.group({
          code: ['', Validators.required]
        })
    });
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true }).result.then(
      (result) => {
        `Closed with: ${result}`;
      },
      (reason) => {
        `Dismissed ${this.getDismissReason(reason)}`;
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
    this.getAllPTA(0, event, this.searchForm.value.filterValue, "","", "","", "", "");
  }


  onPageChange(page: number) {
    this.page = page;
    this.getAllPTA(page - 1, this.size, this.searchForm.value.filterValue, "", "", "",  "","", "");
  }

  onCreatePTA() {
    this.closeModal();
   // console.log(this.initPtaFormGroup.value)

    this.ptaService.addInitPTA(this.initPtaFormGroup.value).subscribe({
      next: (res) => {

        const idPTA = res?.data?.id;

        this.pta = res?.data;
        if(res?.success) {
          this.router.navigate(['create-pta', idPTA], { relativeTo: this.route.parent });
          sessionStorage.setItem("actionPtaFormClick", 'create');

          Swal.fire({
            html: `${this.pta?.initialPTA?.nomPTA} <b>2024</b> est enregistré avec succès.`,
            icon: 'success',
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick:true
          }).then(() => {


          })
        }

      },complete: () => {},
      error: (err) =>{

      }
    })

  }

  onCreateAction(data: any) {
    this.router.navigate(['create-pta', data.id], { relativeTo: this.route.parent });
     sessionStorage.setItem("actionPtaFormClick", 'create');
  }

  onEditPTA(data: any) {
    this.router.navigate(['edit-pta', data.id], { relativeTo: this.route.parent });
     sessionStorage.setItem("actionPtaFormClick", 'edit');
  }

  onViewPTA(data: any) {
    this.router.navigate(['view-pta', data.id], { relativeTo: this.route.parent })
  }


  closeModal() {
    this.modalService.dismissAll();
  }


  onSearch() {

    this.getAllPTA(0, 10, "", this.advancedSearchForm.value['numPta'],
        this.advancedSearchForm.value['libelle'],
        this.advancedSearchForm.value['responssable'],
        this.advancedSearchForm.value['division'],
        this.advancedSearchForm.value['debut'],
        this.advancedSearchForm.value['fin'])
    this.closeModal();
  }



  onAdvancedSearchForm(): void {

    this.getAllPTA(0, 10, "", this.advancedSearchForm.value['numPta'],
        this.advancedSearchForm.value['libelle'],
        this.advancedSearchForm.value['responssable'],
        this.advancedSearchForm.value['division'],
        this.advancedSearchForm.value['debut'],
        this.advancedSearchForm.value['fin'])
    this.closeModal()
  }



  lookingSearchForm(){
    this.advancedSearchForm = this.formBuilder.group({
      numPta: [''],
      libelle: [''],
      responssable: [''],
      division: [''],
      debut: [''],
      fin: ['']

    });
  }

}

const DATA: any[] = [
  {
    num_pta: 'PTA01-2024',
    date: '29-04-2024',
    libellePta: 'Plan de Travail Annuel de la DRH 2024',
    nbrActions: 2,
    nbrResultats: 6,
    nbrSousActions: 5,
  },
  {
    num_pta: 'PTA01-2023',
    date: '29-04-2023',
    libellePta: 'Plan de Travail Annuel de la DRH 2023',
    nbrActions: 5,
    nbrResultats: 12,
    nbrSousActions: 20,
  },
  {
    num_pta: 'PTA01-2022',
    date: '29-04-2022',
    libellePta: 'Plan de Travail Annuel de la DRH 2022',
    nbrActions: 5,
    nbrResultats: 12,
    nbrSousActions: 20,
  },
  {
    num_pta: 'PTA01-2021',
    date: '29-04-2021',
    libellePta: 'Plan de Travail Annuel de la DRH 2021',
    nbrActions: 5,
    nbrResultats: 12,
    nbrSousActions: 20,
  }
];

