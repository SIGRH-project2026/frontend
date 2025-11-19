import { Component, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FicheSynoptiqueService } from '../../../fiche-etablissement/services/fiche-synoptique.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { DisciplineDeficitaire, DisciplineDeficitaireAllEtablisemment } from '../../../horaire-professeurs/models/DisciplineDeficitaire';
import { DisciplineQuantum } from '../../../fiche-etablissement/models/DisciplineQuantum';
import { Discipline } from '../../../fiche-etablissement/models/Discipline';
import { ReferencesService } from 'src/app/services/references.service';

@Component({
  selector: 'app-liste-besoin-en-nbr-gap',
  templateUrl: './liste-besoin-en-nbr-gap.component.html',
  styleUrls: ['./liste-besoin-en-nbr-gap.component.css']
})
export class ListeBesoinEnNbrGapComponent {

  headers!: string[];
  page = 1;
	pageSize = 10;
	collectionSize = 0;
	userList!: any[];
  collapsed:boolean = false;
  text = '';
  closeResult = '';
  listDisciplineDeficitaire : DisciplineDeficitaireAllEtablisemment[] = []
  disciplinesDef : DisciplineDeficitaire[] = []
  disciplineRecherchee = ""
  first = 0
  searchQuery = "";
  listDisciplines: Discipline[] = [];
   constructor(
    private router: Router,
     private route: ActivatedRoute,
     public modalService: NgbModal = inject(NgbModal),
	 private readonly ficheService : FicheSynoptiqueService,
    private readonly referenceService : ReferencesService
   ) { }
  
  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['Disciplines','Heures dûes ', 'Heures effectuées','Déficit/Surplus','Action'];
	this.getDisciplineAyantDeficit()
  this.getListDiscplines()
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

 
  openModalAddAgent(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'l', centered: true }).result.then(
			(result) => {
        this.closeResult = `Closed with: ${result}`;
        this.router.navigate(['create-dossier-agent'], { relativeTo: this.route.parent })
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  

  onViewGap(id: any) {
    this.router.navigate([id,'details-gap'], { relativeTo: this.route.parent })
  }
  

  getDisciplineAyantDeficit(){
    
    this.ficheService.getDisciplineAyantDeficitEtab(this.page -1, this.pageSize, this.disciplineRecherchee)
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
                  if(data.status?.includes("OK")){
                    this.disciplinesDef = []
                    this.listDisciplineDeficitaire = data.payload
                        
                    if(data.collectionSize)
                      this.collectionSize = data.collectionSize
                    
                    for(let dfe  of this.listDisciplineDeficitaire)
                    {
                      if(dfe.disciplineDeficitaires.length > 0){
                       // if(this.first == 0)
                        for(let ds of dfe.disciplineDeficitaires ){
                          ds.etablissement = dfe.etablissement
                          this.disciplinesDef.push(ds)
                        } 
                      }
                    }
                    this.first ++
                  }
                },
              error : (error) =>{  
                console.error('Une erreur est survenue :', error);
              }
                    
           })
  }

  rechercherParDiscipline(event : any){
    this.disciplineRecherchee = event.target.value
    this.getDisciplineAyantDeficit()
    
  }
  matchSearchQuery(deficit: any): boolean {

    const searchValue = this.searchQuery.toLowerCase();
    let discipline = deficit.discipline
  
    return( Object.values(deficit).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(discipline).some(value =>
           value != null && value.toString().toLowerCase().includes(searchValue)))

}
getListDiscplines(): void {

  this.referenceService.listDiscipline()
    .subscribe(response => {
      if (response.success) {
        this.listDisciplines = response.data; 
      }
    });
}
}
