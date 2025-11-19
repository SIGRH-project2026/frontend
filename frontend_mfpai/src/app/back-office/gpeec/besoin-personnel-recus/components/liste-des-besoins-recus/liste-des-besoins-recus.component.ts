import { Component, TemplateRef, inject } from '@angular/core';
import { Demande } from '../../../besoin-en-personnel/components/list-expression/list-expression.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CredentialsService } from 'src/app/services/credentials.service';
import { BesoinEnPersonnelService } from '../../../besoin-en-personnel/services/besoin-en-personnel.service';
import { BesoinEnPersonnel } from '../../../besoin-en-personnel/models/besoinEnPersonnel';
import { ReferencesService } from 'src/app/services/references.service';

@Component({
  selector: 'app-liste-des-besoins-recus',
  templateUrl: './liste-des-besoins-recus.component.html',
  styleUrls: ['./liste-des-besoins-recus.component.css']
})
export class ListeDesBesoinsRecusComponent {
  headers!: string[];
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  demandeList: any[] = [];
  collapsed: boolean = false;
  text = '';
  closeResult = '';
  userInfos: any ;
  idUser : any
  listBEP: BesoinEnPersonnel[] = [];
  statut = ""
  matricule = ""
  etablissement = "";
  region = ""
  ia = ""
  ief = ""
  prenom = ""
  nom = ""
  reference = 0
  reachForm !: FormGroup;
  listRegion : any
  listIa : any
  listIef : any
  searchQuery = "";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private readonly besoinEnPersonnelService : BesoinEnPersonnelService,
    private readonly _credentialService: CredentialsService,
    private readonly _fb : FormBuilder,
    private readonly referenceService : ReferencesService,


  ) { 
    this.userInfos = this._credentialService.getUserInfos();
    if(this.userInfos)
      this.idUser = this.userInfos.id
    
  }
  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['N° Référence', 'Demandeur' ,'Region','IA', 'IEF' , 'Etablissement ou Ecole de Formation',   'Action'];
    //this.refreshData();
    this.listBesoinEnPersonnel()
    this.getListRegion()
    this.getListIa()
    this.getListIef()
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

  refreshData() {
    // this.demandeList = DATA.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
    //   (this.page - 1) * this.pageSize,
    //   (this.page - 1) * this.pageSize + this.pageSize,
    // );
  }

 

  onViewDemande(user: any) {
    this.router.navigate([user.id, 'details-besoins-recus'], { relativeTo: this.route.parent })
  }

  onSearch() {
    console.log({search : this.reachForm.value});
    
    this.matricule = this.reachForm.value.matricule
    this.etablissement = this.reachForm.value.etablissement;
    this.region = this.reachForm.value.region;
    this.ia = this.reachForm.value.ia;
    this.ief = this.reachForm.value.ief
    let ref = parseInt(this.reachForm.value.reference);
    if(ref)
      this.reference = ref
    let nomComplet = this.reachForm.value.nomComplet.split(' ');
    this.nom = nomComplet[nomComplet.length - 1]
    for(let i = 0; i< nomComplet.length - 1; i++)
    this.prenom += (nomComplet[i] + ' ')

    console.log({et : this.prenom ,         nom : this.nom});
    
    this.listBesoinEnPersonnel() 
  }

  
  listBesoinEnPersonnel(){

    this.besoinEnPersonnelService.getAll(0,this.page-1, this.pageSize,this.matricule, this.statut, this.etablissement,
      this.region, this.ia, this.ief, this.prenom, this.nom, this.reference)
        .subscribe({
          next : (data : ResponseApi2)=>{
              if(data.status?.includes("OK")){
                this.listBEP = data.payload
                if(data.metadata)
                  this.collectionSize = data.metadata.totalElements
                this.initReachForm()
                this.prenom = ""
                this.nom = ""
                // console.log({list : this.listBEP});
              }
          },
          error : (error) =>{
            console.error('Une erreur est survenue :', error);
          }
          
          
        })
  }
  initReachForm() {
    this.reachForm = this._fb.group({
      'matricule': new FormControl(''),
      'etablissement': new FormControl(''),
      'region' : new FormControl(''),
      'ia' : new FormControl(''),
      'ief' : new FormControl(''),
      'nomComplet' : new FormControl(''),
      'reference' : new FormControl('')
    });
  }
  getListRegion(){
    this.referenceService.listRegion().subscribe(response => {
      if(response.success)
        this.listRegion = response.data;
    });
  }
  getListIa(){
    this.referenceService.listIA().subscribe(response => {
      if(response.success)
        this.listIa = response.data;
    });
  }
  getListIef(){
    this.referenceService.listIEF().subscribe(response => {
      if(response.success)
        this.listIef = response.data;
    });
  }

  matchSearchQuery(demande: any): boolean {
    const searchValue = this.searchQuery.toLowerCase();
    let utilisateur = demande.utilisateur
    let etablissement = demande.etablissement
    let region = demande.region
    let ia = demande.ia
    let ief = demande.ief

    return( Object.values(demande).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue)
    ) || Object.values(utilisateur).some(value =>
           value != null && value.toString().toLowerCase().includes(searchValue)))
      || Object.values(etablissement).some(value =>
          value != null && value.toString().toLowerCase().includes(searchValue))
      || Object.values(region).some(value =>
          value != null && value.toString().toLowerCase().includes(searchValue))
      || Object.values(ia).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue))
      || Object.values(ief).some(value =>
        value != null && value.toString().toLowerCase().includes(searchValue))
  
}
}

