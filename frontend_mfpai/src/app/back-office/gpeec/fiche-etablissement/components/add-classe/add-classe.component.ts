import { Location } from "@angular/common";
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReferencesService } from "src/app/services/references.service";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import Swal from "sweetalert2";
import { FiliereService } from "../../../besoin-en-personnel/services/Filiere/filiere.service";
import { FicheSynoptiqueService } from "../../services/fiche-synoptique.service";
import { DeconectedDTO } from "src/app/models/utilisateur";
import { ClasseProfDiscipline } from "../../models/ClasseProfDiscipline";
import { Discipline } from "../../models/Discipline";
import { DisciplineQuantum } from "../../models/DisciplineQuantum";
import { ProfDiscipline } from "../../models/ProfDiscipline";
import { Filiere } from "../../../besoin-en-personnel/models/filiere";
import { UtilisateurService } from "src/app/services/utilisateur.service";
import { ActivatedRoute } from "@angular/router";
import { QuantumValues } from "../../models/QuatumsValues";
import { Niveau } from "../../models/Niveau";
import { Serie } from "../../models/Serie";
declare var $: any;

export interface Formateur {
  matricule: string;
  prenom: string;
  nom: string;
}

@Component({
  selector: 'app-add-classe',
  templateUrl: './add-classe.component.html',
  styleUrls: ['./add-classe.component.css']
})
export class AddClasseComponent implements OnInit, AfterContentChecked{

  headersClasses: string[] = ['Nom Classe',  'Professeur', 'QH Annuel', 'Discipline','QH Discipline', 'Action'];
  classesList: any[] =[];

  selectedFormateurs: string[] = [];

  autocompleteFormateurs: string[] = [];
  listDisciplines: Discipline[] = [];
  listFilieres: Filiere[] = [];
  listProfs: DeconectedDTO [] = [];
  classProfsList: ClasseProfDiscipline[] = [];
  idFiche : any
  codeEtab : any
  quantumsValuesListClasses: QuantumValues[] = [];
  profError: string = "";
  disciplineClassError: string = "";
  classNameError: string = "";
  typeFormation : any;
  niveauFST : Niveau[] = []
  niveauFPT : Niveau[] = []
  series : Serie[] = []
  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectDisciplineClasse').selectpicker();
    // $('#selectDisciplineClasse').selectpicker();
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

  classProfForm !: FormGroup
  constructor(
    private location: Location,
    private cdr: ChangeDetectorRef,
    private readonly referenceService: ReferencesService,
    private readonly ficheService: FicheSynoptiqueService,
    private readonly filiereService: FiliereService,
    private fb: FormBuilder,
    private readonly _userService: UtilisateurService,
    private readonly activatedRoute : ActivatedRoute
  ) {
       let id = this.activatedRoute.snapshot.paramMap.get('idFiche')
       if(id)
        this.idFiche = parseInt(id)
      this.codeEtab = this.activatedRoute.snapshot.paramMap.get('codeEtab')
      this.typeFormation = this.activatedRoute.snapshot.paramMap.get('typeFormation')
    
     // console.log({fi : this.idFiche , codE : this.codeEtab});
      
   }

  ngOnInit(): void {
    //this.autocompleteFormateurs = this.formateurs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
    this.getListDiscplines()
    this.getAllFiliere()
    this.initFormClassProf()
    this.getProfByCodeEtablissement()
    this.getSerieByCodeForm("FST")
    this.getNiveaauByCodeForm("FST")
    this.getNiveaauByCodeForm("FPT")
  }

  getNiveaauByCodeForm(code : any){
    this.referenceService.listNiveauxByCodeFormation(code)
   
    .subscribe(response => {
     
      if (response.success) {
       if(code === 'FST')
        this.niveauFST = response.data
       if(code === 'FPT')
        this.niveauFPT = response.data   
       console.log({fst : this.niveauFST, fpt : this.niveauFPT});  
      }
   
    });
  }
  getSerieByCodeForm(code : any){
    this.referenceService.listSerieByCodeForm(code)
    .subscribe(response => {
  
      if (response.success) {
        this.series = response.data;
      }
      
    });
  }
  onSaveClasse(withSerie : boolean) {
    if(!withSerie)
   { this.addQuantumValuesClass(this.classProfsList, this.quantumsValuesListClasses)
    this.ficheService.addClasse(this.idFiche, this.classProfsList)
        .subscribe({
          next : (data : ResponseApi2) =>{
            if(data.status?.includes("OK")){
              Swal.fire({
                icon: "success",
                html: "Classe ajoutée avec succès.",
                showConfirmButton: false,
                timer: 3000,
              }).then(() => {
                this.location.back();
              });
            }
          }
        })}
    else{
      this.addQuantumValuesClass(this.classProfsList, this.quantumsValuesListClasses)
      this.ficheService.addClasseSerie(this.idFiche, this.classProfsList)
          .subscribe({
            next : (data : ResponseApi2) =>{
              if(data.status?.includes("OK")){
                Swal.fire({
                  icon: "success",
                  html: "Classe ajoutée avec succès.",
                  showConfirmButton: false,
                  timer: 3000,
                }).then(() => {
                  this.location.back();
                });
              }
            }
          })
    }

  }

  onReset() {
   this.location.back();
  }

  onDelete(indClasse : number, disciplineQunt : DisciplineQuantum[], idDisc : number) {
  

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
       
          if(disciplineQunt.length == 1)
            this.classProfsList.splice(indClasse, 1)
          else
         {   let index = disciplineQunt.findIndex((dq : DisciplineQuantum) => dq.discipline.id === idDisc);
            disciplineQunt.splice(index, 1)
          }
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
  getListDiscplines(): void {

    this.referenceService.listDiscipline()
      .subscribe(response => {
        if (response.success) {
          this.listDisciplines = response.data; 
        }
      });

      this.referenceService.listDiscipline()
      .subscribe(response => {
        if (response.success) {
          $('#selectDisciplineClasse').selectpicker("refresh");
          
        }
      });
  }
  getAllFiliere() {
    this.filiereService.getAll().subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK"))
          this.listFilieres = data.payload

      }
    })
  }
  initFormClassProf(): void {
    this.classProfForm = this.fb.group({

      nomClasse: ['', Validators.required],
      quantum: [],
      serie: [new Serie()],
      professeur : [],
      disciplines: []
    });
  }
getProfByCodeEtablissement(){

  this._userService.listProfParEtablissement(this.codeEtab)
    .subscribe(response => {
      if (response.success) {
        this.listProfs = response.data
        this.autocompleteFormateurs = this.listProfs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom} (${participant.quantumHoraire}H)`);

      }
    });
}

//ajout class prof discipline
addClassProfs() {
  this.disciplineClassError = ""
  this.profError = ""
  this.classNameError = ""
  let matProf : any
  if(this.classProfForm.value.professeur[0].value.split(' ')[0])
    matProf = this.classProfForm.value.professeur[0].value.split(' ')[0]
  
  let serie : any
    serie = this.series.find((fil: Serie) => fil.id == parseInt(this.classProfForm.value.serie))


  let prof = this.listProfs.find((p : DeconectedDTO) =>(p.matricule == matProf))
 
  let cpd : ClasseProfDiscipline = new  ClasseProfDiscipline()
  cpd.nomClasse = this.classProfForm.value.nomClasse
  cpd.quantum = this.classProfForm.value.quantum
  if(serie)
    cpd.serie = serie
  
  let pd : ProfDiscipline = new ProfDiscipline()
 
    //disciplines quantum pour le prof
    let disciplineQuan: DisciplineQuantum[] = []
    
    let filDisc = this.classProfForm.value.disciplines
    if(filDisc && prof && this.classProfForm.valid)
    {  
     
      for(let dp of this.classProfForm.value.disciplines){
        let d: Discipline = new Discipline()
        d.id = dp.id
        d.libelle = dp.libelle
        let discQ: DisciplineQuantum = new DisciplineQuantum
        discQ.discipline = d
        discQ.quantum = 0
        disciplineQuan.push(discQ)
      }
      if(prof && disciplineQuan)
        pd.professeur = prof
        pd.disciplineQuantums =disciplineQuan

    if(pd)
      cpd.profDiscipline.push(pd)

      if( this.classProfsList.length>0)
        {  let exitingCL = this.classProfsList.findIndex((fd : ClasseProfDiscipline) => fd.nomClasse === cpd.nomClasse)
          if(exitingCL >= 0)
            {
              for(let d of cpd.profDiscipline)
                this.classProfsList[exitingCL].profDiscipline.push(d)
            }  else this.classProfsList.push(cpd)
      }
        else this.classProfsList.push(cpd)
    
  // console.log({ clasProDis : this.classProfsList});
    this.initFormClassProf()
    this.classProfForm.value.disciplines = []

    Swal.fire({
      html: "Classe ajoutée avec succès.",
      icon: "success",
      timer: 1000,
      showCancelButton: false,
      showConfirmButton: false,
    }).then(() => {
      $('#selectDisciplineClasse').selectpicker("deselectAll");
    });
  } else {
    if(!prof && !filDisc &&  !this.classProfForm.valid )
      {
        this.profError = "Veuillez choisir un professeur."
        this.disciplineClassError = "Veuillez choisir au moins une discipline."
        this.classNameError =  "Veuillez saisir un nom de classe."
        
      }else if(!prof){
        this.profError = "Veuillez choisir un professeur."
        this.disciplineClassError = ""
      }
    else if(!filDisc) {
             this.disciplineClassError = "Veuillez choisir au moins une discipline."
          }else if(!this.classProfForm.valid)
          this.classNameError =  "Veuillez saisir un nom de classe."

  }
  // if(cpd.nomClasse != "")
  //   this.classNameError =  "Veuillez saisir un nom de classe."
  // else this.classNameError = ""
}
//quatumsValues
quatumsValues(  indexClasse: number, indexFiliere : number, indexDisc : number, event : any){
  // console.log({iF: indexFiliere, iD : indexDisc, quant : event.target.value});
   let qValue : QuantumValues = new QuantumValues()
   qValue.idF = indexFiliere
   qValue.idD = indexDisc
   qValue.quantum = parseInt(event.target.value)

    qValue.idC =indexClasse
    this.quantumsValuesListClasses.push(qValue)
 }
 addQuantumValuesClass(listClasses : ClasseProfDiscipline[], quantumVal: QuantumValues[] ){
  let k = 0;
  for(let cl of listClasses )
  { 
    let cQunt = quantumVal.filter(a => a.idC == k)
     let i = 0;
    for(let profD of cl.profDiscipline){
      let qV = cQunt.filter(q => q.idF == i)
      let j = 0
      for(let disc of profD.disciplineQuantums){
        let quantD = qV.find(dq => dq.idD == j)
        if(quantD)
          listClasses[k].profDiscipline[i].disciplineQuantums[j].quantum = quantD?.quantum

        j++
      }
      i++
    }
    k++
  }
}
 
}

