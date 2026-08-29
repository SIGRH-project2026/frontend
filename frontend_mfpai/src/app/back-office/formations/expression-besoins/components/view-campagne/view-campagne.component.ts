import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CampagneService} from "../../../../../services/campagne.service";
import {CampagneInterface} from "../../../../../models/campagne.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {ExpressionDeBesoinInterface} from "../../../../../models/expression-de-besoin.interface";
import {NgxSpinnerService} from "ngx-spinner";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {CredentialsService} from "../../../../../services/credentials.service";

@Component({
  selector: 'app-view-campagne',
  templateUrl: './view-campagne.component.html',
  styleUrls: ['./view-campagne.component.css']
})
export class ViewCampagneComponent implements OnInit {

  headers!: string[];
  // page   = 0;
  pageSize: number | undefined = 10;
    page: number | undefined = 1;
  collectionSize: number | undefined ;
  statut = '';
  text = '';
  closeResult = '';
  campagneId: string | null = '';
  expressionDeBesoins: ExpressionDeBesoinInterface[] = []
    campaign: CampagneInterface | undefined;

    searchForm!: FormGroup;
    formGroup!: FormGroup;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private campagneService: CampagneService,
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private spinner: NgxSpinnerService,
    private demandeService: DemandeStageService,
    private credentialService: CredentialsService
  ) { }
  ngOnInit(): void {
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

      this.getCampagne();
      this.headers = ['Référence', 'Besoins en compétences', 'Date', 'Demandeur', 'Statut', 'Action'];
  }

    onSubmitSearch(): void {
        if (this.formGroup.valid) {
            // Perform actions when the form is submitted

            this.getExpressionDeBesoins(0,10,'',this.formGroup.get('reference')?.value,this.formGroup.get('besoinCompetences')?.value,this.formGroup.get('prenomDemandeur')?.value,this.formGroup.get('nomDemandeur')?.value,this.formGroup.get('date')?.value)
        } else {
            // Display error messages or handle invalid form
        }
    }

    canTreateExpressionDeBesoin(campagne: any){
        let roles = ['Chef-division-dfc','Chef-bureau-dfc','Agent-bureau-dfc']
        let role = this.credentialService.getUserInfos()?.profil[0].code
        if (roles.includes(role || ''))
            return true
        return  false
    }
    onStatusChange(event: any) {
        this.statut = event.target.value;
        this.page = 1;
        this.getExpressionDeBesoins(0,this.pageSize!,this.statut,'','','','','')
        // You can perform additional actions based on the selected value here
    }

    onSubmit() {
        // Handle the search logic here, e.g., send the search term to a service
        const searchTerm = this.searchForm?.get("searchTerm");
        if (searchTerm != null && searchTerm != undefined){
            this.getExpressionDeBesoins(0,10,'',searchTerm.value,'','','','')
        }


    }

    getExpressionDeBesoins(page: number, size: number,statut: string, filter: string,besoin: string,  prenomDemandeur: string,  nomDemandeur: string,  date: string){
      this.spinner.show()
      this.campagneService.getAllExpressionDeBesoin(page, size, filter,statut,besoin,  prenomDemandeur,  nomDemandeur,  date, this.campagneId).subscribe((res)=>{
          if (res.status === 'OK'){
              this.spinner.hide()
              this.expressionDeBesoins = res.payload
              this.collectionSize = res.metadata?.totalElements
              this.pageSize = res.metadata?.size
          }else{
              this.spinner.hide()
              this.alert.showAlert({status: res.status, message: res.message, titre: "Erreur chargement expressions de besoin."});
          }

      })
  }

    isFilePresent = false
    getCampagne(){
      this.spinner.show()
        this.campagneService.getCampagne(this.campagneId!).subscribe((res)=>{
            if (res.status === 'OK'){
                this.campaign = res.payload
                this.isFilePresent = this.campaign?.pieceJoint.length === 0 ? false : true

                this.spinner.hide()
                this.getExpressionDeBesoins(0,10,'','','','','','')
            }else{
                this.alert.showAlert({status: res.status, message: res.message, titre: "Erreur recupèration campagne."});
            }

        })
        this.spinner.hide()
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
      this.page = 1;
      // this.getExpressionDeBesons(this.page,this.pageSize, "")
      this.getExpressionDeBesoins(0,this.pageSize!,this.statut, "",'','','','')
  }

    onPageChange(page: number){
      this.page = page;
      this.getExpressionDeBesoins(page - 1,this.pageSize!,this.statut, "",'','','','')
    }


  onViewDemande(user: any) {
    this.router.navigate(['detail-theme-formation',user.id], { relativeTo: this.route.parent })
  }

  onSearch() {
  }

    downloadFile(fileName: string){
        this.demandeService.downloadFile(fileName)
    }
}
