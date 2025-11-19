import { Component, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService } from 'src/app/services/credentials.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { FicheSynoptiqueService } from '../../../fiche-etablissement/services/fiche-synoptique.service';
import { DeconectedDTO } from 'src/app/models/utilisateur';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { HoraireProfs } from '../../models/HoraireProfs';
import { DisciplineDeficitaire } from '../../models/DisciplineDeficitaire';
import { ReferencesService } from 'src/app/services/references.service';
import { Discipline } from '../../../fiche-etablissement/models/Discipline';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-des-matiere-deficits',
  templateUrl: './list-des-matiere-deficits.component.html',
  styleUrls: ['./list-des-matiere-deficits.component.css']
})
export class ListDesMatiereDeficitsComponent {
  headers!: string[];
  headers2!: string[];
  page = 1;
  page2 = 1;
	pageSize = 10;
	pageSize2 = 10;
	collectionSize = 0;
	collectionSize2 = 0;
	deficitList!: any[];
	HoraireProffList!: any[];
  collapsed:boolean = false;
  closeResult = '';
  user : DeconectedDTO  = new DeconectedDTO()
  userInfos: any
  listHoraireProfs: HoraireProfs[] = [];
  listDisciplineDeficitaire: DisciplineDeficitaire[] = [];
  listDisciplines : Discipline[] = []
  disciplineRecherchee = ""
  matricule: string = "";
  nomComplet: string = "";
  reachForm !: FormGroup
  searchQuery = "";
  searchQuery1 = "";
  constructor(
    public modalService: NgbModal = inject(NgbModal),
    private router: Router,

    private route: ActivatedRoute,
    private readonly _credentialService: CredentialsService,
    private readonly _userService : UtilisateurService,
    private readonly ficheService : FicheSynoptiqueService,
    private readonly referenceService : ReferencesService,
    private readonly _fb : FormBuilder
  ) {
    this.userInfos = this._credentialService.getUserInfos();
    if(this.userInfos)
      this.userInfos.id
      this.getUserDetail()
     // this.getListDiscplines()
   }

  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['Disciplines','Total heures classes', 'Total Quantum annuel', "Deficit horaire"];
    this.headers2 = ['Matricule','Prénom et Nom','Nombre de classe', 'Nombre de discipline', "Quantum annuel",'Heures dispensée' ,'Action'];
    this.refreshData();
    this.refreshData2();
    this.initReachForm()
 
  }
 


  refreshData() {
	
  }
  refreshData2() {
	
  }

  initReachForm() {
    this.reachForm = this._fb.group({
      'matricule': new FormControl(''),
      'nomComplet': new FormControl(''),
    });
  }
  onViewdeatailst(id: any) {
    this.router.navigate([id,'details-horaires-professeur'], { relativeTo: this.route.parent })
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
  onSearch() {
    this.matricule = this.reachForm.value.matricule
    this.nomComplet = this.reachForm.value.nomComplet;
    this.getProfsHoraires()
  }

  getUserDetail(){
    this._userService.getOneUser(this.userInfos.id)
                     .subscribe({
                      next : (data : any) =>{
                          this.user = data.data
                         // console.log({user :this.user});
                         this.getProfsHoraires()
                         this.getDisciplineAyantDeficit()
                          
                      }
                     })
  }

  
  getProfsHoraires(){
    this.ficheService.getHoraireProfsByCodeEtab(this.user.etablissement.code, this.page2 -1, this.pageSize2, this.matricule, this.nomComplet)
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
                  if(data.status?.includes("OK")){
                    this.listHoraireProfs = data.payload
                    if(data.collectionSize)
                      this.collectionSize2 = data.collectionSize
                   // console.log({hp : this.listHoraireProfs});
                    this.initReachForm()
                  }
                },
              error : (error) =>{
                
                console.error('Une erreur est survenue :', error);
              }
                    
           })
  }
  getDisciplineAyantDeficit(){
   
    this.ficheService.getDisciplineAyantDeficit(this.user.etablissement.code, this.page -1, this.pageSize, this.disciplineRecherchee)
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
                  if(data.status?.includes("OK")){
                   
                    this.listDisciplineDeficitaire = data.payload 
    
                    if(data.collectionSize)
                      this.collectionSize = data.collectionSize
             
                    if(this.disciplineRecherchee == "")
                      for(let discipl of this.listDisciplineDeficitaire){
                        this.listDisciplines.push(discipl.discipline)
                      }
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
matchSearchQuery2(horaire: any): boolean {

  const searchValue = this.searchQuery1.toLowerCase();

  let professeur = horaire.professeur
  return ( Object.values(horaire).some(value =>
      value != null && value.toString().toLowerCase().includes(searchValue)
  ) || Object.values(professeur).some(value =>
         value != null && value.toString().toLowerCase().includes(searchValue)))
  
    // || Object.values(classeDisciplinesForProfs).some(value =>
    // value != null && value.toString().toLowerCase().includes(searchValue))
  
}
}


