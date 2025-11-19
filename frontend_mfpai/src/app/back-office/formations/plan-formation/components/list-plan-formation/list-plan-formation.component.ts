import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import {NgxSpinnerService} from "ngx-spinner";
import { CredentialsService } from 'src/app/services/credentials.service';

@Component({
  selector: 'app-list-plan-formation',
  templateUrl: './list-plan-formation.component.html',
  styleUrls: ['./list-plan-formation.component.css']
})
export class ListPlanFormationComponent implements OnInit {
  
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  plansFormationsList: any[] = []; // Initialize with an empty array or fetch from a service
  closeResult = '';
  userInfos:any;
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal = inject(NgbModal),
    private readonly _credentialService: CredentialsService,
  ) {

    this.userInfos = this._credentialService.getUserInfos();
    if (this.userInfos)
      this.userInfos.id
   }

  getPlanFormation(){
   this.spinner.show();
    this.http.get(environment.apiUrl+"plan-formation/list", {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {

        this.collectionSize = response.data.content.length;


        this.plansFormationsList = response.data.content.map((plan: any, i: number) => ({ id: i + 1, ...plan })).slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );

        this.spinner.hide();
        
      },
      (error) => console.log(error)
    )
  }

  downloadFiles(files: any[]): void {
    files.forEach(file => {
      const filename = file.generatedName;
      this.http.get(environment.apiUrl + "files/download?filename=" + filename, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        },
        responseType: 'blob' // traiter la réponse comme un blob
      }).subscribe(
        (response: Blob) => {
          const blobUrl = URL.createObjectURL(response);
          const anchor = document.createElement('a');
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.href = blobUrl;
          anchor.download = filename;
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(blobUrl);
        },
        (error) => console.log(error)
      );
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

  ngOnInit(): void {
    // Fetch campaigns data from a service or other source
    //this.refreshData();
    this.getPlanFormation();
  }

  onCreatePlan() {
    this.router.navigate(['create-plan-formation'], { relativeTo: this.route.parent });
  }

  onEditPlan(plan: any) {
    localStorage.setItem("idPlan", plan.id.toString());
this.router.navigate([plan.id, 'edit-plan-formation'], { relativeTo: this.route.parent });
  }

  onPublishPlan(plan: any): void {
    Swal.fire({
      html: "Souhaitez-vous confirmer la publication du <b>"+plan.titre+"</b> ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.put(environment.apiUrl+"plan-formation/"+plan.id.toString()+"/change-status?statutCode=ENCOURS",
        {headers: {
          'accept':'*/*',
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {


            const body = JSON.stringify(
              {
                "datePublication": new Date()
              }
            );
            
            this.http.put(environment.apiUrl+"plan-formation/"+plan.id.toString()+"/modify", body,
        { headers: {
          'accept':'*/*',
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {

            Swal.fire({
              html: `Plan de formation <b>${plan.sateDebut}-${plan.dateFin}<b/> a été publié avec succès.`,
              icon: 'success',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            })
            window.location.reload();
            
          },
          (error) => console.log(error)
        )
            
          },
          (error) => console.log(error)
        )
        
        
      }
    })
  }

  onCreateThemeFormation(plan: any) {
    localStorage.setItem("idPlan", plan.id.toString());
    this.router.navigate([plan.id, 'create-theme-formation'], { relativeTo: this.route.parent })
  }

  onViewDetailPlan(plan: any) {
    localStorage.setItem("idPlan", plan.id);
    this.router.navigate([plan.id, 'detail-plan-formation'], { relativeTo: this.route.parent })
  }

  renderClass(statut: string) {
    switch (statut) {
      case "BROUILLON":
        return "draft-plan";
      case "ENCOURS":
        return "progress-plan";
      case "CLOTURE":
        return "closed-plan";
      default:
        return "default-plan";
    }
  }

  refreshData() {
    this.plansFormationsList.map((plan, i) => ({ id: i + 1, ...plan })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  onSearch() {
    console.log('Result');
  }

}

const DATAPLANFORMATIONS: any[] = [
  { id: 1, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Brouillon', datePublication:'', nbrTheme: 6 },
  { id: 2, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'En cours', datePublication:'01/01/2023', nbrTheme: 2 },
  { id: 3, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 },
  { id: 4, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 },
  { id: 5, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 },
  { id: 6, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 },
  { id: 7, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 },
  { id: 8, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 },
  { id: 9, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 },
  { id: 10, titrePlan: 'Plan de formation', reference: "ref001", anneeDebut: '2023', anneeFin: '2025', statut: 'Clôturer', datePublication:'01/01/2023', nbrTheme: 10 }
];

