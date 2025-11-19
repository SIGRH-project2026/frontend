import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Location } from "@angular/common";
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit,TemplateRef,inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { CredentialsService } from 'src/app/services/credentials.service';
import { ReferencesService } from 'src/app/services/references.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

import { FicheSynoptiqueService } from '../../services/fiche-synoptique.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FicheSynoptique } from '../../models/FicheSynoptique';
import { DeconectedDTO } from 'src/app/models/utilisateur';
import { ClasseProfDiscipline } from '../../models/ClasseProfDiscipline';
import { ProfDiscipline } from '../../models/ProfDiscipline';
import { DisciplineQuantum } from '../../models/DisciplineQuantum';
import { FiliereDiscipline } from '../../models/FiliereDiscipline';
import { FiliereService } from '../../../besoin-en-personnel/services/Filiere/filiere.service';
import { Filiere } from '../../../besoin-en-personnel/models/filiere';
import { QuantumValues } from '../../models/QuatumsValues';
import { Discipline } from '../../models/Discipline';
declare var $: any;

export interface Formateur {
  matricule: string;
  prenom: string;
  nom: string;
}

@Component({
  selector: 'app-list-fiche',
  templateUrl: './list-fiche.component.html',
  styleUrls: ['./list-fiche.component.css']
})
export class ListFicheComponent implements OnInit, AfterContentChecked{
  user : DeconectedDTO  = new DeconectedDTO()
  isCreatedFiche = false;
  headersDisciplines: string[] = ['Nom Filière', 'QH Filière', 'Niveau','Discipline', 'QH Discipline', 'Action'];
  headersClasses: string[] = ['Nom Classe',  'Professeur', 'QH Annuel', 'Discipline','QH Discipline', 'Action'];
  headersClassesSerie: string[] = ['Nom Classe', 'Serie', 'Professeur', 'QH Annuel', 'Discipline','QH Discipline', 'Action'];

  headersClasses2: string[] = [ 'Professeur', 'QH Annuel', 'Discipline','QH Discipline'];
  headersDisciplinesUpdate: string[] = ['Nom Filière', 'QH Filière', 'Discipline', 'QH Discipline'];
  headersClassesUpdate: string[] = ['Nom Classe', 'QH Classe', 'Professeur', 'QH Annuel', 'Discipline', 'QH Discipline'];

  headersFileresDisciplines: string[] = ['Nom Filière matière', 'QH Filière', 'Discipline', 'QH Discipline', 'Action'];
  headersSeriesDisciplines: string[] = ['Series', 'Type de Niveau', 'QH Serie', 'Discipline', 'QH Discipline', 'Action'];
 
  filieresList2: any[] = []; // Remplacez par votre propre tableau de filières


  selectedFormateurs: string[] = [];

  autocompleteFormateurs: string[] = [];
  closeResult!: string;
  ficheSnoptique: FicheSynoptique = new FicheSynoptique();
  filiereDiscUpdate : FiliereDiscipline = new FiliereDiscipline()
  classProfDiscUpdate : ClasseProfDiscipline = new ClasseProfDiscipline()
  listFilieres: Filiere[] = [];
  filiereDisciplinesForm !: FormGroup;
  quantumsValuesListFilieres  : QuantumValues[] = []
  indexFiliereUpdate: number = 0;
  indexClasseUpdate: number = 0;
  listDisciplines: Discipline[] = [];
  listProfs: DeconectedDTO [] = [];
  quantumsValuesListClasses: QuantumValues[] = [];
  typeFormation: string = "filiere";
  typeFormation2: string = "cfiliere";
  
  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectDisciplineClasse').selectpicker();
    $('#selectDisciplineFiliere').selectpicker();
    // Forcer la mise à jour de la vue
    this.cdr.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.initializeSelectpicker();
  }

  countRows(classe: ClasseProfDiscipline): number {
    let total = 0;
    classe.profDiscipline.forEach((professeur: ProfDiscipline) => {
      total += professeur.disciplineQuantums.length;
    });
    return total;
  }


  infosGeneralesGroup = this._formBuilder.group({});
  infosFilieresGroup = this._formBuilder.group({});
  infosClassesGroup = this._formBuilder.group({});
  userInfos: any;
  classProfForm !: FormGroup
  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private readonly _credentialService: CredentialsService,
    private readonly _userService : UtilisateurService,
    private readonly ficheService : FicheSynoptiqueService,
    private readonly filiereService: FiliereService,
    private readonly fb : FormBuilder,
    private readonly referenceService: ReferencesService,
  ) {
    this.userInfos = this._credentialService.getUserInfos();
    if(this.userInfos)
      this.userInfos.id
    
   }

  ngOnInit(): void {
  //  this.autocompleteFormateurs = this.formateurs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
   
    this.getFicheEtablissement()
    this.getAllFiliere()
    this.initFormFiliereDiscp()
    this.getListDiscplines()
    this.initFormClassProf()
  }
  onTabChange(event: any, classe : boolean) {
    if(!classe)
     { 
      if(event == 0)
        this.typeFormation = "filiere"
      else this.typeFormation = "serie"
    }else{
      if(event == 0)
        this.typeFormation2 = "cfiliere"
      else this.typeFormation2 = "cserie"
    }
  }

  onCreateFiche() {
    this.router.navigate(['create-fiche'], { relativeTo: this.route.parent })
  }

  onAddClasse() {
    this.router.navigate(['add-classe', this.ficheSnoptique.id, this.ficheSnoptique.chefEtablissemnt.etablissement.code, this.typeFormation2], { relativeTo: this.route.parent })
  }
  onAddFiliere() {
    this.router.navigate(['add-filiere',this.ficheSnoptique.id, this.typeFormation ], { relativeTo: this.route.parent })
  }

  getProfByCodeEtablissement(){

    this._userService.listProfParEtablissement(this.user.etablissement.code)
      .subscribe(response => {
        if (response.success) {
          this.listProfs = response.data 
          this.autocompleteFormateurs = this.listProfs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom} (${participant.quantumHoraire}H)`);
        }
      });
  }
  onSaveFiche() {
    Swal.fire({
      icon: "success",
      html: "Fiche d'etablissement enregistré avec succès.",
      showConfirmButton: false,
      timer: 3000,
    }).then(() => {
      this.location.back();
    });
  }
  onReset() {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous annuler l'enregistrement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4A7B",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: "L’enregistrement  a été annulé avec succès.",
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          this.location.back();
        });
      }
    });
  }

  getListDiscplines(): void {

    this.referenceService.listDiscipline()
      .subscribe(response => {
        if (response.success) {
          this.listDisciplines = response.data;

            console.log(this.listDisciplines);
        }
      });

      this.referenceService.listDiscipline()
      .subscribe(response => {
        if (response.success) {
          $('#selectDisciplineClasse').selectpicker("refresh");
          
        }
      });
  }

  openModal(content: TemplateRef<any>, index : number, estUneFiliere : boolean) {

    if(estUneFiliere)
      {
        this.filiereDiscUpdate = this.ficheSnoptique.filiereDisciplines[index]
        this.indexFiliereUpdate = index
      }
    else {
        this.classProfDiscUpdate = this.ficheSnoptique.classeProfDisciplines[index]
        this.indexClasseUpdate = index
    }
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg',scrollable:true, centered: true }).result.then(
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
   closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    console.log('Result');
    this.closeModal();
  }

   onDelete(indClasse : number, indProfDisc : number,  idDisc : number , withSerie :  boolean) {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous supprimer cette discipline ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4A7B",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
      //  console.log({av : 'Avant', inC : indClasse , indProfDisc : indProfDisc, idDisc : idDisc});
        
      if(!withSerie)
        {let displineQuant = this.ficheSnoptique.classeProfDisciplines[indClasse].profDiscipline[indProfDisc].disciplineQuantums
        let index = displineQuant.findIndex((dq : DisciplineQuantum) => dq.discipline.id === idDisc);
        this.ficheSnoptique.classeProfDisciplines[indClasse].profDiscipline[indProfDisc].disciplineQuantums.splice(index, 1)
       }
       else{
        let displineQuant = this.ficheSnoptique.serieClasseProfDisciplines[indClasse].profDiscipline[indProfDisc].disciplineQuantums
        let index = displineQuant.findIndex((dq : DisciplineQuantum) => dq.discipline.id === idDisc);
        this.ficheSnoptique.serieClasseProfDisciplines[indClasse].profDiscipline[indProfDisc].disciplineQuantums.splice(index, 1)
       }
        this.updateFicheEtablissement();


        Swal.fire({
          html: "La discipline a été supprimée avec succès.",
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        })
      }
    });
   }
   onDelete2(indFiliere : number,  idDisc : number, withSerie : boolean) {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous supprimer cette discipline ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4A7B",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        if(!withSerie){
        let displineQuant = this.ficheSnoptique.filiereDisciplines[indFiliere].disciplineQuantums
        if(displineQuant.length == 1)
          this.ficheSnoptique.filiereDisciplines.splice(indFiliere, 1)
        else
          { 
            let index = displineQuant.findIndex((dq : DisciplineQuantum) => dq.discipline.id === idDisc);
            this.ficheSnoptique.filiereDisciplines[indFiliere].disciplineQuantums.splice(index, 1)
          }
        }else{
          let displineQuant = this.ficheSnoptique.serieNiveauDisciplines[indFiliere].disciplineQuantums
          if(displineQuant.length == 1)
            this.ficheSnoptique.serieNiveauDisciplines.splice(indFiliere, 1)
          else
            { 
              let index = displineQuant.findIndex((dq : DisciplineQuantum) => dq.discipline.id === idDisc);
              this.ficheSnoptique.serieNiveauDisciplines[indFiliere].disciplineQuantums.splice(index, 1)
            }
        }
       
        this.updateFicheEtablissement();
        Swal.fire({
          html: "La discipline a été supprimée avec succès.",
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        })
      }
    });
   }
   onDelete3() {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous supprimer cette discipline ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4A7B",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
    
        Swal.fire({
          html: "La discipline a été supprimée avec succès.",
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        })
      }
    });
   }
   onSaveFiliere() {
    this.addQuantumValues(this.filiereDiscUpdate, this.quantumsValuesListFilieres)
    let fil = this.listFilieres.find((fil: Filiere) => fil.id == parseInt(this.filiereDisciplinesForm.value.filiere))
      if (fil)
      this.filiereDiscUpdate.filiere = fil

    this.filiereDiscUpdate.quantum = this.filiereDisciplinesForm.value.quantum
    this.ficheSnoptique.filiereDisciplines[this.indexFiliereUpdate] = this.filiereDiscUpdate
    this.updateFicheEtablissement()
    Swal.fire({
      icon: "success",
      html: "Filière modifiée avec succès.",
      showConfirmButton: false,
      timer: 3000,
    }).then(() => {
       this.closeModal();
    });
   }
   addQuantumValues(filiereDisc : FiliereDiscipline, quantumVal: QuantumValues[] ){
   
      let qV = quantumVal.filter(q => q.idF == this.indexFiliereUpdate)
      let j = 0
      for(let disc of filiereDisc.disciplineQuantums){
        let quantD = qV.find(dq => dq.idD == j)
        if(quantD)
          filiereDisc.disciplineQuantums[j].quantum = quantD?.quantum
          j++
      } 
    }
   onSaveClasse() {
    this.addQuantumValuesClass(this.classProfDiscUpdate, this.quantumsValuesListClasses)
    this.classProfDiscUpdate.nomClasse = this.classProfForm.value.nomClasse
   // this.classProfDiscUpdate.quantum = this.classProfForm.value.quantum
    this.ficheSnoptique.classeProfDisciplines[this.indexClasseUpdate] = this.classProfDiscUpdate
    this.updateFicheEtablissement()
    Swal.fire({
      icon: "success",
      html: "Classe modifiée avec succès.",
      showConfirmButton: false,
      timer: 3000,
    }).then(() => {
       this.closeModal();
    });
  }

  getUserDetail(){
    this._userService.getOneUser(this.userInfos.id)
                     .subscribe({
                      next : (data : any) =>{
                          this.user = data.data
                         // console.log({user :this.user});
                          
                      }
                     })
  }
 
  getFicheEtablissement(){
    this.ficheService.get(this.userInfos.id)
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
                  if(data.status?.includes("OK")){
                    this.ficheSnoptique = data.payload
                    this.user = this.ficheSnoptique.chefEtablissemnt
                    this.getProfByCodeEtablissement()
                   
                   // console.log({userFic :this.user});
                    this.isCreatedFiche = true
                  }else{
                    this.getUserDetail()
                  }
              },
              error : (error) =>{
                
                console.error('Une erreur est survenue :', error);
              }
                    
           })
  }

    
  updateFicheEtablissement(){
    this.ficheService.update(this.ficheSnoptique)
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
                  if(data.status?.includes("OK")){
                    this.ficheSnoptique = data.payload
                    this.isCreatedFiche = true
                  }else{
                    this.getUserDetail()
                  }
              },
              error : (error) =>{
                
                console.error('Une erreur est survenue :', error);
              }
                    
           })
  }
  getAllFiliere() {
    this.filiereService.getAll().subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK"))
          this.listFilieres = data.payload

      }
    })
  }

  //initialisation formulaire
initFormFiliereDiscp(): void {
  this.filiereDisciplinesForm = this.fb.group({

    filiere: [new Filiere()],
    quantum: [],
    disciplines: []
  });
}

initFormClassProf(): void {
  this.classProfForm = this.fb.group({

    nomClasse: ['', Validators.required],
  //  quantum: [],
  //  professeur : [],
  //  disciplines: []
  });
}
    //quatumsValues
    quatumsValues(  indexDisc : number, event : any){
      // console.log({iF: indexFiliere, iD : indexDisc, quant : event.target.value});
       let qValue : QuantumValues = new QuantumValues()
       qValue.idF = this.indexFiliereUpdate
       qValue.idD = indexDisc
       qValue.quantum = parseInt(event.target.value)
         this.quantumsValuesListFilieres.push(qValue)    
     }
     quatumsValues2(indexProf : number,  indexDisc : number, event : any){
      // console.log({iF: indexFiliere, iD : indexDisc, quant : event.target.value});
      let qValue : QuantumValues = new QuantumValues()
      qValue.idF = indexProf
      qValue.idD = indexDisc
      qValue.quantum = parseInt(event.target.value)
  
      qValue.idC =this.indexClasseUpdate
      this.quantumsValuesListClasses.push(qValue)
     }

 addQuantumValuesClass(classProf : ClasseProfDiscipline, quantumVal: QuantumValues[] ){

    let cQunt = quantumVal.filter(a => a.idC == this.indexClasseUpdate)
     let i = 0;
    for(let profD of classProf.profDiscipline){
      let qV = cQunt.filter(q => q.idF == i)
      let j = 0
      for(let disc of profD.disciplineQuantums){
        let quantD = qV.find(dq => dq.idD == j)
        if(quantD)
          classProf.profDiscipline[i].disciplineQuantums[j].quantum = quantD?.quantum
        j++
      }
      i++
    }

}
}
