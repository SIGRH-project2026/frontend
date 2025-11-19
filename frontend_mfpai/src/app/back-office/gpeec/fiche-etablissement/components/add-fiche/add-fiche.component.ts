import { Location } from "@angular/common";
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DeconectedDTO } from "src/app/models/utilisateur";
import { ReferencesService } from "src/app/services/references.service";
import { UtilisateurService } from "src/app/services/utilisateur.service";
import Swal from "sweetalert2";
import { FicheSynoptiqueService } from "../../services/fiche-synoptique.service";
import { CredentialsService } from "src/app/services/credentials.service";
import { Discipline } from "../../models/Discipline";
import { FiliereService } from "../../../besoin-en-personnel/services/Filiere/filiere.service";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import { Filiere } from "../../../besoin-en-personnel/models/filiere";
import { FiliereDiscipline } from "../../models/FiliereDiscipline";
import { DisciplineQuantum } from "../../models/DisciplineQuantum";
import { ClasseProfDiscipline } from "../../models/ClasseProfDiscipline";
import { ProfDiscipline } from "../../models/ProfDiscipline";
import { FicheSynoptique } from "../../models/FicheSynoptique";
import { QuantumValues } from "../../models/QuatumsValues";
import { MatTabGroup } from "@angular/material/tabs";
import { Niveau } from "../../models/Niveau";
import { TypeEtablissement } from "../../models/TypeEtablissement";
import { Serie } from "../../models/Serie";

declare var $: any;

export interface Formateur {
  matricule: string;
  prenom: string;
  nom: string;
}

@Component({
  selector: "app-add-fiche",
  templateUrl: "./add-fiche.component.html",
  styleUrls: ["./add-fiche.component.css"],
})
export class AddFicheComponent implements OnInit, AfterContentChecked {

  headersFileresDisciplines: string[] = ['Nom Filière matière','Niveau', 'QH Filière', 'Discipline', 'QH Discipline', 'Action'];
  headersSeriesDisciplines: string[] = ['Series', 'Niveau', 'QH Serie', 'Discipline', 'QH Discipline', 'Action'];
  headersClasses: string[] = ['Nom Classe', 'Series','Professeur', 'Heures dûes', 'Discipline', 'QH Discipline', 'Action'];


  selectedFormateurs: any[] = [];

  autocompleteFormateurs: string[] = [];
  userInfos: any;
  listDisciplines: Discipline[] = [];
  listFilieres: Filiere[] = [];
  filiereDisciplines: FiliereDiscipline[] = []
  serieDisciplines: FiliereDiscipline[] = []
  niveauFST : Niveau[] = []
  niveauFPT : Niveau[] = []
  series : Serie[] = []
 
  fstSelected: boolean = false;
  fptSelected: boolean = false;

  @ViewChild('tabGroupDispclines') tabGroupDispclines!: MatTabGroup;
  @ViewChild('tabGroupClasses') tabGroupClasses!: MatTabGroup;

  filiereDisciplinesForm !: FormGroup;
  classProfForm !: FormGroup
  listProfs: DeconectedDTO[] = [];
  quantumHoraireProf: number = 0
  classProfsList: ClasseProfDiscipline[] = []

  quantumsValuesListFilieres: QuantumValues[] = []
  
  quantumsValuesListSeries: QuantumValues[] = []
  quantumsValuesListClasses: QuantumValues[] = [];
  quantumsValuesListClassesSerie: QuantumValues[] = [];
  filiereError: string = "";
  disciplineError: string = "";
  profError: string = "";
  disciplineClassError: string = "";
  classNameError: string = "";
  typeEtablissement : TypeEtablissement[] = []
  // typeEtablissement = [
  //   { id: 1, code: 'FST', libelle: 'Formation secondaire technique' },
  //   { id: 2, code: 'FPT', libelle: 'Formation professionnelle et technique' }
  // ];




  selectedTypeEtablissement: string[] = [];
  selectedSeries: string[] = [];
  selectedTypeNiveau: string[] = [];
  selectedSeriesDisciplines: string = '';
  selectedTypeNiveauDisciplines: string = '';
  formationPro: TypeEtablissement[] = [];
  serieClassProfsList: ClasseProfDiscipline[] = [];

  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectTypeEtablissement').selectpicker();
    $('#selectSeries').selectpicker();
    $('#selectTypeNiveau').selectpicker();
    $('#selectDisciplineClasse').selectpicker();
    $('#selectDisciplineFiliere').selectpicker();
    // Forcer la mise à jour de la vue
    this.cdr.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.initializeSelectpicker();
  }

  // countRows(classe: any): number {
  //   let total = 0;
  //   classe.professeurs.forEach((professeur: any) => {
  //     total += professeur.disciplines.length;
  //   });
  //   return total;
  // }


  infosGeneralesGroup = this._formBuilder.group({});
  infosFilieresGroup = this._formBuilder.group({});
  infosClassesGroup = this._formBuilder.group({});

  user: DeconectedDTO = new DeconectedDTO()
  constructor(
      private _formBuilder: FormBuilder,
      private location: Location,
      private cdr: ChangeDetectorRef,
      private readonly _credentialService: CredentialsService,
      private readonly _userService: UtilisateurService,
      private readonly referenceService: ReferencesService,
      private readonly ficheService: FicheSynoptiqueService,
      private readonly filiereService: FiliereService,
      private fb: FormBuilder,
  ) {
    this.userInfos = this._credentialService.getUserInfos();
    if (this.userInfos)
      this.userInfos.id
  }

  ngOnInit(): void {
    this.getUserDetail()
    this.getListDiscplines()
    this.getAllFiliere()
    this.initFormFiliereDiscp()
    this.initFormClassProf()
    this.getTypeEtabllissement()
    this.getSerieByCodeForm("FST")
  }

  onSaveFiche() {
    let ficheSynoptique: FicheSynoptique = new FicheSynoptique()
    ficheSynoptique.userId = this.user.id

    this.addQuantumValues(this.filiereDisciplines, this.quantumsValuesListFilieres)
    this.addQuantumValues(this.serieDisciplines, this.quantumsValuesListSeries)
    this.addQuantumValuesClass(this.classProfsList, this.quantumsValuesListClasses)
    this.addQuantumValuesClass(this.serieClassProfsList, this.quantumsValuesListClassesSerie)
    ficheSynoptique.filiereDisciplines = this.filiereDisciplines
    ficheSynoptique.classeProfDisciplines = this.classProfsList
    ficheSynoptique.serieClasseProfDisciplines = this.serieClassProfsList
    ficheSynoptique.serieNiveauDisciplines = this.serieDisciplines
    ficheSynoptique.formationProfessionels = this.formationPro
    this.ficheService.post(ficheSynoptique)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              console.log({ dat: data.payload });
              Swal.fire({
                icon: "success",
                html: "Fiche d'etablissement enregistré avec succès.",
                showConfirmButton: false,
                timer: 3000,
              }).then(() => {
                this.location.back();
              });
            }
          },
          error: (error) => {
            console.error("Erreur lors de la créeation de la fiche")
          }
        })
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


  onDelete(indFiliere: number, disciplineQunt: DisciplineQuantum[], idDisc: number) {
    if (disciplineQunt.length == 1)
      this.filiereDisciplines.splice(indFiliere, 1)
    else {
      let index = disciplineQunt.findIndex((dq: DisciplineQuantum) => dq.discipline.id === idDisc);
      disciplineQunt.splice(index, 1)
    }

  }


  onDelete2(indClasse: number, disciplineQunt: DisciplineQuantum[], idDisc: number) {
    if (disciplineQunt.length == 1)
      this.classProfsList.splice(indClasse, 1)
    else {
      let index = disciplineQunt.findIndex((dq: DisciplineQuantum) => dq.discipline.id === idDisc);
      disciplineQunt.splice(index, 1)
    }
  }

  getUserDetail() {
    this._userService.getOneUser(this.userInfos.id)
        .subscribe({
          next: (data: any) => {
            this.user = data.data
            this.getProfByCodeEtablissement()
            // console.log({user :this.user});

          }
        })
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
getTypeEtabllissement(){
  this.referenceService.listFormationPro()
  .subscribe(response => {

    if (response.success) {
      this.typeEtablissement = response.data;
   
    }
  });
  this.referenceService.listFormationPro()
  .subscribe(response => {
    if (response.success) {
      $('#selectTypeEtablissement').selectpicker("refresh");

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
  countRows2(filiere: FiliereDiscipline): number {
    let totalRows = 0;
    filiere.disciplineQuantums.forEach(() => {
      totalRows += 1;
    });
    totalRows += 1;
    return totalRows;
  }
  countRows(classe: ClasseProfDiscipline): number {
    let total = 0;
    classe.profDiscipline.forEach((professeur: ProfDiscipline) => {
      total += professeur.disciplineQuantums.length;
    });
    return total;
  }

  //ajouter une filiere et ses disciplines
  addFiliereDiscipline() {
    let canSave = false
    let filiereDisc: FiliereDiscipline = new FiliereDiscipline()
    let fil = this.listFilieres.find((fil: Filiere) => fil.id == parseInt(this.filiereDisciplinesForm.value.filiere))
    if (fil)
      filiereDisc.filiere = fil

    let niv = this.niveauFST.find((niv: Niveau) => niv.id == parseInt(this.filiereDisciplinesForm.value.niveau))
    if (!niv)
       niv = this.niveauFPT.find((niv: Niveau) => niv.id == parseInt(this.filiereDisciplinesForm.value.niveau))
    if(niv)
      filiereDisc.niveau = niv

    let disciplineQuan: DisciplineQuantum[] = []
    filiereDisc.quantum = this.filiereDisciplinesForm.value.quantum
    let filDisc = this.filiereDisciplinesForm.value.disciplines
    if (filDisc && fil) {
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
      if (this.filiereDisciplines.length > 0) {
        let exitingFil = this.filiereDisciplines.findIndex((fd: FiliereDiscipline) => fd.filiere.id == filiereDisc.filiere.id)

        if (exitingFil >= 0) {
          for (let d of filiereDisc.disciplineQuantums)
            this.filiereDisciplines[exitingFil].disciplineQuantums.push(d)
        }
        else {
          if (filiereDisc.filiere && filiereDisc.disciplineQuantums) {
            this.filiereDisciplines.push(filiereDisc)
            canSave = true
          }
        }
      }
      else {
        if (filiereDisc.filiere && filiereDisc.disciplineQuantums) {
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
      if (!fil && !filDisc) {
        this.filiereError = "Veuillez choisir une filiére."
        this.disciplineError = "Veuillez choisir au moins une discipline."

      } else if (!fil) {
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
        let exitingFil = this.serieDisciplines.findIndex((fd: FiliereDiscipline) => fd.serie.id == filiereDisc.serie.id)

        if (exitingFil >= 0) {
          for (let d of filiereDisc.disciplineQuantums)
            this.serieDisciplines[exitingFil].disciplineQuantums.push(d)
        }
        else {
          if (filiereDisc.serie && filiereDisc.disciplineQuantums) {
            this.serieDisciplines.push(filiereDisc)
            canSave = true
          }
        }
      }
      else {
        if (filiereDisc.serie && filiereDisc.disciplineQuantums) {
          this.serieDisciplines.push(filiereDisc)
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
  //initialisation formulaire
  initFormFiliereDiscp(): void {
    this.filiereDisciplinesForm = this.fb.group({

      filiere: [new Filiere()],
      niveau: [new Niveau()],
      serie: [new Serie()],
      quantum: [],
      disciplines: []
    });
  }
  initFormClassProf(): void {
    this.classProfForm = this.fb.group({

      nomClasse: ['', Validators.required],
      quantum: [],
      serie:[new Serie()],
      professeur: [],
      disciplines: []
    });
  }
  getProfByCodeEtablissement() {

    this._userService.listProfParEtablissement(this.user.etablissement.code)
        .subscribe(response => {
          if (response.success) {
            this.listProfs = response.data
            this.autocompleteFormateurs = this.listProfs.map(participant => `${participant.matricule} ${participant.prenom} ${participant.nom} (${participant.quantumHoraire}H)`);

          }
        });
  }

  //ajout class prof discipline
  addClassProfs(withSerie : boolean) {
    let serie : any
    if(withSerie)
      serie = this.series.find((fil: Serie) => fil.id == parseInt(this.classProfForm.value.serie))
 
    this.disciplineClassError = ""
    this.profError = ""
    this.classNameError = ""

    let matProf = this.classProfForm.value.professeur[0].value.split(' ')[0]
    let prof = this.listProfs.find((p: DeconectedDTO) => (p.matricule == matProf))

    let cpd: ClasseProfDiscipline = new ClasseProfDiscipline()
    cpd.nomClasse = this.classProfForm.value.nomClasse
    cpd.quantum = this.classProfForm.value.quantum
    if(serie)
      cpd.serie = serie
    let pd: ProfDiscipline = new ProfDiscipline()

    //disciplines quantum pour le prof
    let disciplineQuan: DisciplineQuantum[] = []

    let filDisc = this.classProfForm.value.disciplines


    if (filDisc && prof && cpd.nomClasse != "") {


      for (let dp of this.classProfForm.value.disciplines) {
        let d: Discipline = new Discipline()
        d.id = dp.id
        d.libelle = dp.libelle
        let discQ: DisciplineQuantum = new DisciplineQuantum
        discQ.discipline = d
        discQ.quantum = 0
        disciplineQuan.push(discQ)
      }
      if (prof && disciplineQuan)
        pd.professeur = prof
      pd.disciplineQuantums = disciplineQuan

      if (pd)
        cpd.profDiscipline.push(pd)
      if (this.classProfsList.length > 0) {
        let exitingCL :any
        if(!withSerie)
           exitingCL = this.classProfsList.findIndex((fd: ClasseProfDiscipline) => fd.nomClasse === cpd.nomClasse)

        else   exitingCL = this.serieClassProfsList.findIndex((fd: ClasseProfDiscipline) => fd.nomClasse === cpd.nomClasse)

        if (exitingCL >= 0) {
          for (let d of cpd.profDiscipline)
            {if(!withSerie)
              this.classProfsList[exitingCL].profDiscipline.push(d)
              else this.serieClassProfsList[exitingCL].profDiscipline.push(d)
            }
        } else {  if(!withSerie)
                   this.classProfsList.push(cpd)
                  else 
                  this.serieClassProfsList.push(cpd)
                }
      }
      else {
        if(!withSerie)
            this.classProfsList.push(cpd)
        else this.serieClassProfsList.push(cpd)

      }
      //console.log({ clasProDis : this.classProfsList});
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
      if (!prof && !filDisc && !this.classProfForm.valid) {
        this.profError = "Veuillez choisir un professeur."
        this.disciplineClassError = "Veuillez choisir au moins une discipline."
        this.classNameError = "Veuillez saisir un nom de classe."

      } else if (!prof) {
        this.profError = "Veuillez choisir un professeur."
        this.disciplineClassError = ""
      }
      else if (!filDisc) {
        this.disciplineClassError = "Veuillez choisir au moins une discipline."
      } else if (!this.classProfForm.valid)
        this.classNameError = "Veuillez saisir un nom de classe."

    }
    console.log({des : this.serieClassProfsList});
    
  }
  //quatumsValues
  quatumsValues(filiere: boolean, serie : boolean, indexClasse: number, indexFiliere: number, indexDisc: number, event: any) {
    // console.log({iF: indexFiliere, iD : indexDisc, quant : event.target.value});
    let qValue: QuantumValues = new QuantumValues()
    qValue.idF = indexFiliere
    qValue.idD = indexDisc
    qValue.quantum = parseInt(event.target.value)
    if (filiere && ! serie)
      this.quantumsValuesListFilieres.push(qValue)
      
    if(filiere && serie)
      this.quantumsValuesListSeries.push(qValue)
    
    if(!filiere && !serie) {
      qValue.idC = indexClasse
      this.quantumsValuesListClasses.push(qValue)
    }
    if(!filiere && serie) {
      qValue.idC = indexClasse
      this.quantumsValuesListClassesSerie.push(qValue)
    }

  }
  addQuantumValues(listFiliereDisc: FiliereDiscipline[], quantumVal: QuantumValues[]) {
    let i = 0;
    for (let filier of listFiliereDisc) {
      let qV = quantumVal.filter(q => q.idF == i)
      let j = 0
      for (let disc of filier.disciplineQuantums) {
        let quantD = qV.find(dq => dq.idD == j)
        if (quantD)
          listFiliereDisc[i].disciplineQuantums[j].quantum = quantD?.quantum

        j++
      }
      i++
    }
  }
  addQuantumValuesClass(listClasses: ClasseProfDiscipline[], quantumVal: QuantumValues[]) {
    let k = 0;
    for (let cl of listClasses) {
      let cQunt = quantumVal.filter(a => a.idC == k)
      let i = 0;
      for (let profD of cl.profDiscipline) {
        let qV = cQunt.filter(q => q.idF == i)
        let j = 0
        for (let disc of profD.disciplineQuantums) {
          let quantD = qV.find(dq => dq.idD == j)
          if (quantD)
            listClasses[k].profDiscipline[i].disciplineQuantums[j].quantum = quantD?.quantum

          j++
        }
        i++
      }
      k++
    }
  }

  onTypeEtablissementChange() {
    this.fstSelected = this.selectedTypeEtablissement.includes('FST');
    this.fptSelected = this.selectedTypeEtablissement.includes('FPT');

    if (this.fstSelected && this.fptSelected) {
      this.fstSelected = true;
      this.fptSelected = true;
      this.tabGroupDispclines.selectedIndex = 0;
      this.tabGroupClasses.selectedIndex = 0;
      this.getNiveaauByCodeForm("FST")
      this.getNiveaauByCodeForm("FPT")
      this.formationPro = this.typeEtablissement
      
    } else if (this.fstSelected) {
      // Activer l'onglet Filière matière et désactiver l'onglet Séries
      this.fstSelected = false;
      this.fptSelected = true;
      this.tabGroupDispclines.selectedIndex = 1;
      this.tabGroupClasses.selectedIndex = 1;
      this.getNiveaauByCodeForm("FST")
      let etab = this.typeEtablissement.find((et : TypeEtablissement)=>et.code == "FST")
      if(etab)
        this.formationPro.push(etab)
    } else if (this.fptSelected) {
      // Activer l'onglet Séries et désactiver l'onglet Filière matière
      this.fstSelected = true;
      this.fptSelected = false;
      this.tabGroupDispclines.selectedIndex = 0;
      this.tabGroupClasses.selectedIndex = 0;
      this.getNiveaauByCodeForm("FPT")
      let etab = this.typeEtablissement.find((et : TypeEtablissement)=>et.code == "FPT")
      if(etab)
        this.formationPro.push(etab)
    }
    this.initializeSelectpicker();
  }

}
