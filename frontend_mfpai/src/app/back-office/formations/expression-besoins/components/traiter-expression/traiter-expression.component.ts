import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {CampagneService} from "../../../../../services/campagne.service";
import {CampagneInterface} from "../../../../../models/campagne.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExpressionDeBesoinService} from "../../../../../services/expression-de-besoin.service";
import {ExpressionDeBesoinInterface} from "../../../../../models/expression-de-besoin.interface";
import {NgxSpinnerService} from "ngx-spinner";
import {AlertService} from "../../../../../shared/commons/alert.service";

@Component({
  selector: 'app-traiter-expression',
  templateUrl: './traiter-expression.component.html',
  styleUrls: ['./traiter-expression.component.css']
})
export class TraiterExpressionComponent implements OnInit {

  headers!: string[];
  page = 1;
  pageSize: number | undefined = 10;
  collectionSize: number | undefined = 0;
  text = '';
  closeResult = '';
  isButtonDisabled: boolean = true;
  selectedRows: number[] = [];
  searchForm: FormGroup | undefined;
  formGroup!: FormGroup;
  formGroup_!: FormGroup;
  campagneId: string | null = '';
  campaign: CampagneInterface | undefined;
  expressionDeBesoins: ExpressionDeBesoinInterface[] = []


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private campagneService: CampagneService,
    private expressionDeBesoinService: ExpressionDeBesoinService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alert: AlertService
  ) { }



  ngOnInit(): void {
    this.initFormThemeProvisoire();
    this.formGroup = this.formBuilder.group({
      reference: [''],
      besoinCompetences: [''],
      prenomDemandeur: [''],
      nomDemandeur: [''],
      date: ['']
    });
    this.searchForm = this.formBuilder.group({
      searchTerm: ['']
    });
    this.campagneId = this.route.snapshot.paramMap.get('campagneId')
    this.getCampagne()
    this.getExpressionDeBesoins(0,10,'NON_TRAITER','','','','','')
    this.headers = ['Cocher', 'Référence', 'Besoins en compétences', 'Date', 'Demandeur', 'Statut', 'Action'];
  }

  /**
   * recuperation des liste d'expression de besoin
   * @param page
   * @param size
   * @param statut
   * @param filter
   * @param besoin
   * @param prenomDemandeur
   * @param nomDemandeur
   * @param date
   */
  getExpressionDeBesoins(page: number, size: number,statut: string, filter: string,besoin: string,  prenomDemandeur: string,  nomDemandeur: string,  date: string){
    this.spinner.show()
    this.campagneService.getAllExpressionDeBesoin(page, size, filter,statut,besoin,  prenomDemandeur,  nomDemandeur,  date, this.campagneId).subscribe((res)=>{
      this.expressionDeBesoins = res.payload
      this.collectionSize = res.metadata?.totalElements
      this.pageSize = res.metadata?.size
      this.spinner.hide()
    })
  }


  /**
   * faire une recherche sur le expression de besoin nom traiter
   */
  onSubmitSearch(): void {
    if (this.formGroup.valid) {
      // Perform actions when the form is submitted
      this.getExpressionDeBesoins(0,10,'NON_TRAITER',this.formGroup.get('reference')?.value,this.formGroup.get('besoinCompetences')?.value,this.formGroup.get('prenomDemandeur')?.value,this.formGroup.get('nomDemandeur')?.value,this.formGroup.get('date')?.value)
    } else {
      // Display error messages or handle invalid form
    }
  }

  /**
   * recuperation d'une campagne
   */
  getCampagne(){
    this.spinner.show()
    this.campagneService.getCampagne(this.campagneId!).subscribe((res)=>{
      this.campaign = res.payload
      this.spinner.hide()
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

  /**
   *
   * @param reason
   * @private
   */
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
   * rafraichir donnees
   */
  refreshData() {
    this.page = 1;
    this.getExpressionDeBesoins(0,this.pageSize!,'NON_TRAITER', "",'','','','')
  }

  onPageChange(page: number){
    this.page = page;
    this.getExpressionDeBesoins(page - 1,this.pageSize!,'NON_TRAITER', "",'','','','')
  }


  /**
   * recuperation des remandes a traiter
   * @param event
   * @param demande
   */
  onCheckboxChange(event: any, demande: any) {
  if (event.target.checked) {
    // Add the selected row to the array
    this.selectedRows.push(demande.id);
  } else {
    // Remove the deselected row from the array
    this.selectedRows = this.selectedRows.filter(item => item !== demande.id);
  }

  // Check if any row is selected to enable/disable the button
  this.isButtonDisabled = this.selectedRows.length === 0;
}


  /**
   *  afficcher uniquement les expression de besoin non traiter
   */
  onSubmit() {
    const searchTerm = this.searchForm?.get("searchTerm");
    if (searchTerm != null){
      this.getExpressionDeBesoins(0,10,'NON_TRAITER',searchTerm.value,'','','','')
    }
  }


  /**
   * modifier demande
   * @param user
   */
  onEditDemande(user: any) {
    sessionStorage.setItem('campagneId',this.campagneId!)
    this.router.navigate([`edit-expression`, user.id], { relativeTo: this.route.parent })
  }

  onViewDemande(user: any) {
    this.router.navigate([user.id, 'detail-theme-formation'], { relativeTo: this.route.parent })
  }

  initFormThemeProvisoire(){
    this.formGroup_ = this.formBuilder.group({
      themeProvisoire: ['',Validators.required],
    });
  }

  theme: string = ''
  /**
   * Confirmer la demande
   */
  onTraitementMultiple() {

    Swal.fire({
      title: "Souhaitez-vous confirmer ce traitement",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Traitement simultané',
          confirmButtonColor: 'rgba(29, 74, 123, 1)',
          confirmButtonText: 'Valider',
          cancelButtonText: 'Annuler',
          showCancelButton: true,
          html:
              '<form ' +
              '<div class="row">' +
              '<div class="col-12"><label class="form-label" style="text-align: left !important;display: block;font-size: 14px">Thème provisoire</label><input type="text" id="themeProvisoireInput" placeholder="Saisir" class="form-control"></div>' +
              '</div>' +
              '</form>',
          focusConfirm: false,
            preConfirm: () => {
                const themeProvisoireValue = (document.getElementById('themeProvisoireInput') as HTMLInputElement).value;
                this.theme = themeProvisoireValue;

                // You can process the value here or do any other operation
            }
        }).then((result) => {
          this.spinner.show()
          if (this.theme === ''){
            this.spinner.hide()
            this.alert.showAlert({status: 'EXCEPTION',message:"Veuillez renseigner le théme",titre:'Traitement EB'})
          }else {
            this.expressionDeBesoinService.traiterExpressionDeBesoins(this.selectedRows.join(','), this.theme).subscribe((res)=>{
              this.getExpressionDeBesoins(0,10,'NON_TRAITER','','','','','')
              this.spinner.hide()
              this.selectedRows = []
              // this.
              Swal.fire({
                title: 'Traitement réussi',
                icon: 'success',
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false
              })
            })
          }
        })


      }
    })
  }


}


