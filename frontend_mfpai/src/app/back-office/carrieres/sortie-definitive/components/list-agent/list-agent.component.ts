import {Component, TemplateRef, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ActeService} from "../../../../../services/acteService.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Agent} from "../../../../../models/carriere";
import {ActeDTO} from "../../../mes-demandes/components/models/ActeDTO";


@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.css']
})
export class ListAgentComponent implements OnInit{
  headers!: string[];
    page = 0;
	pageSize = 10;
    demandeList: ActeDTO[] = [];
	collectionSize = this.demandeList.length;
	//demandeList!: any[];
    collapsed:boolean = false;
    closeResult = '';
    SDEF: string = "SDEF";

    filterValue: string = '';

  constructor(
    public modalService: NgbModal = inject(NgbModal),
    private router: Router,
     private  acteService: ActeService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
   
   ) { }

  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['Matricule','Prénom', 'Nom', " Type d'acte" ,'Fonction' , 'Action'];

    this.getListTemporaire(0, this.pageSize, this.SDEF, '', '' );


  }

    onSearch() {

        this.getListTemporaire(0, this.pageSize, this.SDEF, this.filterValue, '' );
    }


  refreshData() {
      this.getListTemporaire(this.page, this.pageSize, this.SDEF, '', '' );
  }


  getListTemporaire(page:number, size: number, code: string, filter: string, typeActe: string) {
      this.spinner.show();
      this.acteService.listActesSortie(page,size, code, filter, typeActe).subscribe({
          next: (response)  => {

              this.demandeList = response.payload;


              //console.log(this.demandeList);

              this.spinner.hide();

              this.collectionSize = response.metadata?.totalElements ?? 0
              this.pageSize = response.metadata?.size ?? 0
      },
          complete: () => {},
          error: (err) => {

          }
      })
  }

  onViewAgent(acte: any) {
    this.router.navigate([acte?.id,'details-agent'], { relativeTo: this.route.parent })
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



    onStatusChange(event: any) {
        const selectedValue = event.target.value;

      //  console.log(selectedValue)
      //  this.getExpressionDeBesoins(0,10,selectedValue,'','','','','')
        this.getListTemporaire(0, this.pageSize, this.SDEF, '', selectedValue );
        // You can perform additional actions based on the selected value here
    }

}

const DATA:any[] =  [
  { id:10001,  matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fonction' },
  { id:10002, matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fonction'  },
  { id:10003, matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fonction' },
  { id:10004, matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fonction' },
  { id:10005, matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fonction' },
  { id:10006, matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fonction'  },
  { id:10007, matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fonction'  },
  { id:10008, matricule:'mat009',Prenom: '03/06/2020', nom : 'lorem' ,  TypeActe: "Acte" ,  fonction : 'Fontion' , }
]
