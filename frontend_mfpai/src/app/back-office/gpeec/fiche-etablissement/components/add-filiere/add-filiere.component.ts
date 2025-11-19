import { Location } from "@angular/common";
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import Swal from "sweetalert2";
import { FiliereService } from "../../../besoin-en-personnel/services/Filiere/filiere.service";
import { FicheSynoptiqueService } from "../../services/fiche-synoptique.service";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import { FiliereDiscipline } from "../../models/FiliereDiscipline";
import { Discipline } from "../../models/Discipline";
import { Filiere } from "../../../besoin-en-personnel/models/filiere";
import { ReferencesService } from "src/app/services/references.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DisciplineQuantum } from "../../models/DisciplineQuantum";
import { QuantumValues } from "../../models/QuatumsValues";
import { ActivatedRoute } from "@angular/router";
import { Niveau } from "../../models/Niveau";
import { Serie } from "../../models/Serie";
import { MatTabGroup } from "@angular/material/tabs";
declare var $: any;

export interface Formateur {
  matricule: string;
  prenom: string;
  nom: string;
}

@Component({
  selector: 'app-add-filiere',
  templateUrl: './add-filiere.component.html',
  styleUrls: ['./add-filiere.component.css']
})
export class AddFiliereComponent implements OnInit, AfterContentChecked{

  headersDisciplines: string[] = ['Nom Filière', 'QH Filière', 'Discipline', 'QH Discipline', 'Action'];
  headersFileresDisciplines: string[] = ['Nom Filière matière','Niveau', 'QH Filière', 'Discipline', 'QH Discipline', 'Action'];
  headersSeriesDisciplines: string[] = ['Series', 'Niveau', 'QH Serie', 'Discipline', 'QH Discipline', 'Action'];
  filieresList: any[] = [];

  autocompleteFormateurs: string[] = [];
  closeResult!: string;
  listDisciplines: Discipline[] = [];
  listFilieres: Filiere[] = [];
  filiereDisciplinesForm !: FormGroup;
  filiereDisciplines: FiliereDiscipline[] = []
  quantumsValuesListFilieres : QuantumValues[] = []
  idFiche : any
  filiereError: string = "";
  disciplineError: string = "";
  typeFormation : any
  infosGeneralesGroup = this._formBuilder.group({});
  infosFilieresGroup = this._formBuilder.group({});
  infosClassesGroup = this._formBuilder.group({});
  @ViewChild('tabGroupDispclines') tabGroupDispclines!: MatTabGroup;
  @ViewChild('tabGroupClasses') tabGroupClasses!: MatTabGroup;

  serieDisciplines: FiliereDiscipline[] = []
  niveauFST : Niveau[] = []
  niveauFPT : Niveau[] = []
  series : Serie[] = []
  quantumsValuesListSeries : QuantumValues[] = []
  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
   // $('#selectDisciplineClasse').selectpicker();
    $('#selectDisciplineFiliere').selectpicker();
    // Forcer la mise à jour de la vue
    this.cdr.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.initializeSelectpicker();
  }

  countRows(classe: any): number {
    let total = 0;
    classe.professeurs.forEach((professeur: any) => {
      total += professeur.disciplines.length;
    });
    return total;
  }

  fstSelected: boolean = false;
  fptSelected: boolean = false;
  constructor(
    private location: Location,
    private cdr: ChangeDetectorRef,
    private readonly ficheService: FicheSynoptiqueService,
    private readonly filiereService: FiliereService,
    private readonly referenceService: ReferencesService,
    private fb: FormBuilder,
    private readonly activatedRoute : ActivatedRoute,
    private _formBuilder: FormBuilder,
  ) { 
    let id = this.activatedRoute.snapshot.paramMap.get('idFiche')
    this.typeFormation = this.activatedRoute.snapshot.paramMap.get('typeFormation')
    
    if(id)
     this.idFiche = parseInt(id)
  }

  ngOnInit(): void {
   // this.autocompleteFormateurs = this.formateurs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom}`);
   this.getListDiscplines()
   this.getAllFiliere()
   this.initFormFiliereDiscp()
   this.getSerieByCodeForm("FST")
   this.getNiveaauByCodeForm("FST")
   this.getNiveaauByCodeForm("FPT")
  }
  getSerieByCodeForm(code : any){
    this.referenceService.listSerieByCodeForm(code)
    .subscribe(response => {
  
      if (response.success) {
        this.series = response.data;
      }
      
    });
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
    //quatumsValues
    quatumsValues( serie : boolean,  indexFiliere: number, indexDisc: number, event: any) {
      // console.log({iF: indexFiliere, iD : indexDisc, quant : event.target.value});
      let qValue: QuantumValues = new QuantumValues()
      qValue.idF = indexFiliere
      qValue.idD = indexDisc
      qValue.quantum = parseInt(event.target.value)
      if (! serie)
        this.quantumsValuesListFilieres.push(qValue)
        
    else
        this.quantumsValuesListSeries.push(qValue)
      
    }
  onSaveFiliere(withSerie : boolean) { 
    if(!withSerie)
     { 
      this.addQuantumValues(this.filiereDisciplines, this.quantumsValuesListFilieres)
      this.ficheService.addFiliere(this.idFiche, this.filiereDisciplines)
        .subscribe({
          next : (data : ResponseApi2 )=>{
            if(data.status?.includes("OK")){
              Swal.fire({
                icon: "success",
                html: "Filière ajoutée avec succès.",
                showConfirmButton: false,
                timer: 3000,
              }).then(() => {
                this.location.back();
              });
            }
          }
        })
      }else{
        this.addQuantumValues(this.filiereDisciplines, this.quantumsValuesListSeries)
        this.ficheService.addSerie(this.idFiche, this.filiereDisciplines)
        .subscribe({
          next : (data : ResponseApi2 )=>{
            if(data.status?.includes("OK")){
              Swal.fire({
                icon: "success",
                html: "Série ajoutée avec succès.",
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

  addQuantumValues(listFiliereDisc : FiliereDiscipline[], quantumVal: QuantumValues[] ){
  let i = 0;
  for(let filier of listFiliereDisc){
    let qV = quantumVal.filter(q => q.idF == i)
    let j = 0
    for(let disc of filier.disciplineQuantums){
      let quantD = qV.find(dq => dq.idD == j)
      if(quantD)
        listFiliereDisc[i].disciplineQuantums[j].quantum = quantD?.quantum

        j++
    }
    i++
  }
}
  onDelete(indFiliere : number, disciplineQunt : DisciplineQuantum[], idDisc : number) {
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
          this.filiereDisciplines.splice(indFiliere, 1)
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
//initialisation formulaire
initFormFiliereDiscp(): void {
  this.filiereDisciplinesForm = this.fb.group({

    filiere: [new Filiere()],
    serie: [new Serie()],
    niveau: [new Niveau()],
    quantum: [],
    disciplines: []
  });
}
  getListDiscplines(): void {

    this.referenceService.listDiscipline()
      .subscribe(response => {
        if (response.success) {
          this.listDisciplines = response.data;

         // console.log("fddf ", this.listDisciplines);
        }
      });

      
    this.referenceService.listDiscipline()
      .subscribe(response => {
        if (response.success) {
          $('#selectDisciplineFiliere').selectpicker("refresh");
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

  countRows2(filiere:FiliereDiscipline):number {
    let totalRows =0; 
    filiere.disciplineQuantums.forEach(() => {
      totalRows +=1;
    });
    totalRows +=1;
    return totalRows;
  }
    //ajouter une filiere et ses disciplines
    addFiliereDiscipline() {
      let filiereDisc: FiliereDiscipline = new FiliereDiscipline()
      let fil = this.listFilieres.find((fil: Filiere) => fil.id == parseInt(this.filiereDisciplinesForm.value.filiere))
      if (fil)
        filiereDisc.filiere = fil
      
      let niv = this.niveauFPT.find((niv: Niveau) => niv.id == parseInt(this.filiereDisciplinesForm.value.niveau))
      if(niv)
      filiereDisc.niveau = niv

      let disciplineQuan: DisciplineQuantum[] = []
      filiereDisc.quantum = this.filiereDisciplinesForm.value.quantum
      let filDisc = this.filiereDisciplinesForm.value.disciplines
      if(filDisc && fil)
      {  
        this.filiereError = ""
        this.disciplineError = ""
        for (let dp of this.filiereDisciplinesForm.value.disciplines) {
          let d: Discipline = new Discipline()
          d.id = dp.id
          d.libelle = dp.libelle
          let discQ: DisciplineQuantum = new DisciplineQuantum
          discQ.discipline = d
          discQ.quantum = 0
          disciplineQuan.push(discQ)
        }
        filiereDisc.disciplineQuantums = disciplineQuan
        if( this.filiereDisciplines.length>0)
          {  let exitingFil = this.filiereDisciplines.findIndex((fd : FiliereDiscipline) => fd.filiere.id ==filiereDisc.filiere.id)
      //  console.log({es : exitingFil});
        
            if(exitingFil >= 0)
          {
            for(let d of filiereDisc.disciplineQuantums)
              this.filiereDisciplines[exitingFil].disciplineQuantums.push(d)
          }  else this.filiereDisciplines.push(filiereDisc)
        }
          else this.filiereDisciplines.push(filiereDisc)
        //console.log({ form: this.filiereDisciplines });
        this.initFormFiliereDiscp()
    
        Swal.fire({
          html: "Filière ajoutée avec succès.",
          icon: "success",
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          $('#selectDisciplineFiliere').selectpicker("deselectAll");
        });
    } else {
      if(!fil && !filDisc)
        {
          this.filiereError = "Veuillez choisir une filiére."
          this.disciplineError = "Veuillez choisir au moins une discipline."
          
        }else if(!fil){
          this.filiereError = "Veuillez choisir une filiére."
          this.disciplineError = ""
        }
      else {
            this.disciplineError = "Veuillez choisir au moins une discipline."
            this.filiereError = ""
          }
    }
    }
  //ajouter une filiere et ses disciplines
  addSerieeDiscipline() {
    let canSave = false
    let filiereDisc: FiliereDiscipline = new FiliereDiscipline()
    let serie = this.series.find((fil: Serie) => fil.id == parseInt(this.filiereDisciplinesForm.value.serie))
    if (serie)
      filiereDisc.serie = serie

    let niv = this.niveauFST.find((niv: Niveau) => niv.id == parseInt(this.filiereDisciplinesForm.value.niveau))
    if(niv)
      filiereDisc.niveau = niv

    let disciplineQuan: DisciplineQuantum[] = []
    filiereDisc.quantum = this.filiereDisciplinesForm.value.quantum
    let filDisc = this.filiereDisciplinesForm.value.disciplines
    if (filDisc && serie) {
      this.filiereError = ""
      this.disciplineError = ""
      for (let dp of this.filiereDisciplinesForm.value.disciplines) {
        let d: Discipline = new Discipline()
        d.id = dp.id
        d.libelle = dp.libelle
        let discQ: DisciplineQuantum = new DisciplineQuantum
        discQ.discipline = d
        discQ.quantum = 0
        disciplineQuan.push(discQ)
      }
      filiereDisc.disciplineQuantums = disciplineQuan
      if (this.serieDisciplines.length > 0) {
        let exitingFil = this.filiereDisciplines.findIndex((fd: FiliereDiscipline) => fd.serie.id == filiereDisc.serie.id)

        if (exitingFil >= 0) {
          for (let d of filiereDisc.disciplineQuantums)
            this.filiereDisciplines[exitingFil].disciplineQuantums.push(d)
        }
        else {
          if (filiereDisc.serie && filiereDisc.disciplineQuantums) {
            this.filiereDisciplines.push(filiereDisc)
            canSave = true
          }
        }
      }
      else {
        if (filiereDisc.serie && filiereDisc.disciplineQuantums) {
          this.filiereDisciplines.push(filiereDisc)
          canSave = true
        }
      }
      // console.log({ form: this.filiereDisciplines });
      this.initFormFiliereDiscp()
      if (canSave)
        Swal.fire({
          html: "Filière ajoutée avec succès.",
          icon: "success",
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          $('#selectDisciplineFiliere').selectpicker("deselectAll");
        });
    }
    else {
      if (!serie && !filDisc) {
        this.filiereError = "Veuillez choisir une série."
        this.disciplineError = "Veuillez choisir au moins une discipline."

      } else if (!serie) {
        this.filiereError = "Veuillez choisir une série."
        this.disciplineError = ""
      }
      else {
        this.disciplineError = "Veuillez choisir au moins une discipline."
        this.filiereError = ""
      }
    }
  }
   

}

