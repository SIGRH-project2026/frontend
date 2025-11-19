import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import {FormationService} from "../../../../../services/formation.service";
import {ResponseApi} from "../../../../../shared/models/utils/response-api.model";

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {

  headers: string[] = ['N° Demande', 'N° Reference Formation', 'Matricule', 'Participant', 'Direction/Etablissment', 'Type', 'Titre de la formation', 'Actions'];
  //headers: string[] = ['N° Demande', 'N° Reference Formation', 'Matricule', 'Participant',  'Corps et grade', 'Type', 'Titre de la formation', 'Actions'];
  page = 1;
  pageSize = 10;

  demandeList: any[] = [];
  filteredItems: any[] = [];

 collectionSize = 10;
 closeResult = '';
 searchTerm: string = '';
 FormationRef: string = '';

 debut="";
  fin="";
  duree="";
  FormationId: any;
  status: string="";
  formation: any;
 

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formationService : FormationService,
    public modalService: NgbModal = inject(NgbModal)
  ) { 

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.FormationId = params['dataId'];
      console.log(this.FormationId);
    });
    //this.refreshData();

    this.http.get(environment.apiUrl+"api/formations/"+this.FormationId, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        this.formation=response;


        this.formationService.getAllParticipationsByFormation(this.FormationId).subscribe({
          next: (response:any) => {

              console.log(response)
              this.demandeList=response;
              this.filteredItems = this.demandeList;
            },
        complete: () => {},

          error: (error) => {

      }
      });
        
        
      },
      (error) => console.log(error)
    );

    //this.getParticipation();
  }

  name = 'ListeDemandesFormation.xlsx';
 exportToExcel(): void {
    let element = document.getElementById('dataTables');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  filterItems() {
    console.log(this.searchTerm.toLowerCase());
    this.filteredItems = this.demandeList.filter((item:any) =>
      item.formation.intitule.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  getParticipation(){
      
  }

  openModalSearch(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true }).result.then(
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
    // this.demandeList = this.demandeList.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
    //   (this.page - 1) * this.pageSize,
    //   (this.page - 1) * this.pageSize + this.pageSize,
    // );


  }


  onViewDemande(data: any) {
    this.router.navigate([data.id, 'detail-view'], { relativeTo: this.route });
  }

  ExportExcel() {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    console.log('Result');
    this.closeModal();
  }

  onJoindreDossier(data: any) {
    this.router.navigate([data.id, 'joindre-dossier'], { relativeTo: this.route });
  }
  onEditFormation(data: any) {
    this.router.navigateByUrl("formations/liste-des-formations/" + data.id + "/edit-formation");
  } 

}

/*const DATA: any[] = [
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 2',
    grade: 'grade 2',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 2',
    grade: 'grade 2',
    titreFormation: 'Lorem'
  },
]

 */
