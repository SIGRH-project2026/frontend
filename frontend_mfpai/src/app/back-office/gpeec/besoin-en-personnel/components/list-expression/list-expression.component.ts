import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BesoinEnPersonnelService } from '../../services/besoin-en-personnel.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { CredentialsService } from 'src/app/services/credentials.service';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BesoinEnPersonnel } from '../../models/besoinEnPersonnel';
import { BEPFiliereDiscipline } from '../../models/BEPFiliereDiscipline';


export interface Filiere {
  id: number;
  filiere: string;
  nbrPersonnels: number;
}

export interface Demande {
  reference: number;
  matricule: string;
  prenom: string;
  nom: string;
  etablissementOrEcole: string;
  filieres: Filiere[];
  status: string;
}

@Component({
  selector: 'app-list-expression',
  templateUrl: './list-expression.component.html',
  styleUrls: ['./list-expression.component.css']
})
export class ListExpressionComponent implements OnInit {

  isSearchResult: boolean = false;
  
  headers!: string[];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  demandeList!: Demande[];
  collapsed: boolean = false;
  text = '';
  closeResult = '';
  statut = ""
  matricule = ""
  userInfos : any
  listBEP : BesoinEnPersonnel[] = []
  reachForm !: FormGroup;
  etablissement = "";
  region = ""
  ia = ""
  ief = ""
  prenom = ""
  nom = ""
  refencece = 0
  searchQuery = ""

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private readonly besoinEnPersonnelService : BesoinEnPersonnelService,
    private readonly _credentialService: CredentialsService,
    private readonly _fb : FormBuilder,
   
  ) { 
    this.userInfos = this._credentialService.getUserInfos();
    if(this.userInfos)
      this.userInfos.id
    
  }

  ngOnInit(): void {
    // Initialize data and headers
   // this.headers = ['N° Référence', 'Matricule', 'Demandeur', 'Etablissement ou Ecole de Formation', 'Filières et Nbr de personnels à recruter', 'Statut', 'Action'];
    this.headers = ['N° Référence', 'Matricule', 'Demandeur', 'Etablissement ou Ecole de Formation', 'Disciplines et Nbr de personnels à recruter', 'Action'];

    this.listBesoinEnPersonnel()
    this.initReachForm()
   
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

  onCreateDemande() {
    this.router.navigate(['create-expression'], { relativeTo: this.route.parent })
  }

  onViewDemande(idDemande: number) {
    this.router.navigate([idDemande, 'detail-expression'], { relativeTo: this.route.parent })
  }

  onSearch() {
    this.matricule = this.reachForm.value.matricule
    this.etablissement = this.reachForm.value.etablissement;
    console.log({et : this.etablissement});
    
    this.modalService.dismissAll();
    this.isSearchResult = true;
    this.listBesoinEnPersonnel();
  }


  onResetfiltre() {
    this.isSearchResult = !this.isSearchResult;
     this.listBesoinEnPersonnel()
  }

  listBesoinEnPersonnel(){
  
    
    this.besoinEnPersonnelService.getAll(this.userInfos.id,this.page-1, this.pageSize,this.matricule, this.statut, this.etablissement,
                                        this.region, this.ia, this.ief, this.prenom, this.nom, this.refencece)
        .subscribe({
          next : (data : ResponseApi2)=>{
              if(data.status?.includes("OK")){
                this.listBEP = data.payload
                if(data.metadata)
                  this.collectionSize = data.metadata.totalElements
                console.log({list : this.listBEP});
              }
          },
          error : (error) =>{
            console.error('Une erreur est survenue :', error);
          }
          
          
        })
  }
  rechercheMatStat() {
    //console.log({mat : this.matricule, st : this.statut});
  //  this.listBesoinEnPersonnel();
    }
    
  initReachForm() {
    this.reachForm = this._fb.group({
      'matricule': new FormControl(''),
      'etablissement': new FormControl(''),

    });
  }
nombreDePersonneParFiliere(bepFD : BEPFiliereDiscipline[]): number{
  let total = 0;
  for(let fil of bepFD)[
    total += fil.besoinEnNombreDisciplines.length
  ]
  return total

}
matchSearchQuery(demande: any): boolean {
    const searchValue = this.searchQuery.toLowerCase();
    let utilisateur = demande.utilisateur
    let etablissement = demande.etablissement
    let  bepFiliereDisciplines = demande.bepFiliereDisciplines

    return( Object.values(demande).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(utilisateur).some(value =>
           value != null && value.toString().toLowerCase().includes(searchValue)))
      || Object.values(etablissement).some(value =>
          value != null && value.toString().toLowerCase().includes(searchValue))

      || Object.values(bepFiliereDisciplines).some(value =>
          value != null && value.toString().toLowerCase().includes(searchValue)
      )
}

}

