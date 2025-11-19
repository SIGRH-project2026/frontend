import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { BesoinEnPersonnelService } from '../../services/besoin-en-personnel.service';
import { FiliereService } from '../../services/Filiere/filiere.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { BEPFiliereDiscipline } from '../../models/BEPFiliereDiscipline';
import { Filiere } from '../../models/filiere';
import { BesoinEnPersonnel } from '../../models/besoinEnPersonnel';
import { CredentialsService } from 'src/app/services/credentials.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ResponseApi } from 'src/app/models/response-api';

import { UserDTOs } from 'src/app/models/UserDTOs';
import { FicheSynoptique } from '../../../fiche-etablissement/models/FicheSynoptique';
import { FicheSynoptiqueService } from '../../../fiche-etablissement/services/fiche-synoptique.service';
import { Discipline } from '../../../fiche-etablissement/models/Discipline';
import { ReferencesService } from 'src/app/services/references.service';
import { CorpsGrade, DeconectedDTO, Etablissement, Grade, Ia, Ief, Region, Utilisateur } from 'src/app/models/utilisateur';
import { BesoinEnNombreDiscipline } from '../../models/BesoinEnNombreDiscipline';
import { QuantumValues } from '../../../fiche-etablissement/models/QuatumsValues';
import { DisciplineDeficitaire } from '../../../horaire-professeurs/models/DisciplineDeficitaire';
import { DisciplineQuantum } from '../../../fiche-etablissement/models/DisciplineQuantum';

declare var $: any;
// export interface Filiere {
//   specialite: string;
//   nbrPersonnels: string;
// }

@Component({
  selector: 'app-create-expression',
  templateUrl: './create-expression.component.html',
  styleUrls: ['./create-expression.component.css']
})
export class CreateExpressionComponent implements OnInit,AfterContentChecked {

  //headersFiliere: string[] = ['Nom filière', 'Discipline', 'Nbr personne à recruter', 'Action'];
  headersFiliere: string[] = ['Discipline', 'Nbr personne à recruter', 'Action'];


    etablissement : Etablissement[] = [];
    ia: Ia[] = [];
    ief : Ief[] = []
    iefC !: Ief ;
    gradeC !: Grade
    corpsC !: CorpsGrade
    etablissementC !: Etablissement;
    iaC !: Ia;
    regionC !: Region

    filiereInfo = ""
    etablissementInfo = ""
    valDefault = 1
  
  expressionForm!: FormGroup;
  filieresList: any[] = [];
  //filiereModel!: BesoinEnPersonnelFiliere;
  filiereForm!: FormGroup;
  listFilieres: Filiere[] = [];
  userInfos: any;
  idUser : any
  user : UserDTOs  = new UserDTOs()
  ficheSnoptique: FicheSynoptique = new FicheSynoptique();
  listDisciplines: Discipline[] =[];
  listDisciplinesUsed: Discipline[] =[];
  region: any;
  corps: CorpsGrade[] = [];
  allCorps : any
  grade: any;
  quantum: number = 0;
  listProfs: DeconectedDTO[] = [];
  deficit : number = 0;
  filiereDisciplinesForm !: FormGroup;
  filiereDisciplines: BEPFiliereDiscipline[] = [];
  quantumsValuesListFilieres: QuantumValues[] = [];
  noFiche = false
  listDisciplineDeficitaire: DisciplineDeficitaire[] = [];
  totaleHeureAttribuee = 0
  totaleHeureDispensee = 0
  canSave = true
  isUserDeconcentred = false
  deficitError = ""
  disciplineError: string = "";
  filiereError: string = "";
  constructor(
    private readonly router: Router,
    private fb: FormBuilder,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private readonly besoinEnPersonnelService : BesoinEnPersonnelService,
    private readonly filiereService : FiliereService,
    private readonly _credentialService: CredentialsService,
    private readonly _userService: UtilisateurService,
    private readonly ficheService : FicheSynoptiqueService,
    private readonly referenceService : ReferencesService,
    
  ) {
      this.userInfos = this._credentialService.getUserInfos();
      if(this.userInfos)
        this.userInfos.id  
  }

  ngOnInit(): void {
    this.filiereForm = this.createFiliereItem();
//this.initForm();
    this.getAllFiliere()
    this.getUserDetail();
    this.initForm();
  
    this.getListDiscplines()
    //this.getListRegion()
    //this.getListCorps()
    this.initFormFiliereDiscp()
  }

  // get filieres(): FormControl[] {
  //   return (this.expressionForm.get('filieres') as FormArray).controls as FormControl[];
  // }

  createFiliereItem(): FormGroup {
    return this.fb.group({
      filiere: [''],
      nombreDePersonne: [0]
    });
  }

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


  // addFiliere($event: Event): void {
  //   $event.preventDefault();
    
  //   for (const control of this.filieres) {
  //     if (control instanceof FormGroup) {
  //       this.filiereModel = control.value;
  //       console.log(this.filiereModel);
  //     }
  //   }
  
  //   this.filieresList.push(this.filiereModel);
 
  //   const filieresFormArray = this.expressionForm.get('filieres') as FormArray;
  //   const lastItemIndex = filieresFormArray.length - 1;
  //   filieresFormArray.get([lastItemIndex])?.get('filiere')?.setValue('');
  //   filieresFormArray.get([lastItemIndex])?.get('nombreDePersonne')?.setValue(0);
  // }

  removeFiliere(index: number): void {
    this.filieresList.splice(index, 1);
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
          $('#selectDisciplineFiliere').selectpicker("refresh");
        }
      });
  }
  initForm(): void {
    this.expressionForm = this.fb.group({
       matricule: [{ value: this.user.prenom, disabled: true }],
      prenom: [{ value: this.user.prenom, disabled: true }],
       nom: [{ value: this.user.nom, disabled: true }],
      region: [],
      //departement: [{ value: 'Lorem ipsum' , disabled: true }],
      ia: [],
      ief: [],
      etablissement: [],

   //   etablissement: [{ value: this.user.etablissement.label, disabled: true }],
     // userId: [{ value: 0 }],
      annee : [''],
      corps: [],
      grade: [],
      commentaire: [''],
    //  disciplines : [],
     // filieres: this.fb.array([this.filiereForm])
    });
    this.getListRegion()
    this.getListCorps()
  }

  onSaveExpression(): void {
    let demande : BesoinEnPersonnel = new BesoinEnPersonnel()
    this.addQuantumValues(this.filiereDisciplines, this.quantumsValuesListFilieres)
    demande.userId = this.userInfos.id
    demande.commentaire = this.expressionForm.value.commentaire
    demande.etablissement = this.etablissementC
    if(!this.isUserDeconcentred){
      let reg = this.region.find(( rg : any) => rg.code = this.expressionForm.value.region) 
            if(reg)
              this.regionC = reg  
      let _ia = this.ia.find(ia => ia.code = this.expressionForm.value.ia) 
          if(_ia)
            this.iaC = _ia     
      let _ief = this.ief.find(ief => ief.code = this.expressionForm.value.ief) 
          if(_ief)
            this.iefC = _ief
    }
      let cor = this.corps.find(cp  => cp.code = this.expressionForm.value.corps) 
            if(cor)
              this.corpsC = cor
    
    demande.ia = this.iaC
    demande.ief = this.iefC
    demande.region = this.regionC
    demande.corps =  this.corpsC
    demande.grade = this.gradeC
    
    demande.bepFiliereDisciplines = this.filiereDisciplines
    let respectDiscipline = true
    let nbr = 0
    for(let dmd of demande.bepFiliereDisciplines){
      for(let dpl of dmd.besoinEnNombreDisciplines ){
        if((dpl.nombreDePersonne > this.calculDeficitParDiscipline(dpl.discipline) )|| dpl.nombreDePersonne == 0)
         { respectDiscipline = false
          if(dpl.nombreDePersonne > 0)
            this.deficitError = "Vous ne pouvez pas récruter plus de " + this.calculDeficitParDiscipline(dpl.discipline)+ " professeur(s) de "+dpl.discipline.libelle + "."
          else if(dpl.nombreDePersonne == 0)
          this.deficitError = "Veuillez choisir au moins 1 professeur de " + dpl.discipline.libelle + "."
        }
        nbr += dpl.nombreDePersonne  
      }   
    }
    demande.deficit = nbr
    console.log({dmm : demande});
    
    if(respectDiscipline)
      this.besoinEnPersonnelService.post(demande)
        .subscribe({
          next : (data : ResponseApi2) => {
          //  console.log({data : data});
            if(data.status?.includes("OK"))
              {
                this.filiereInfo = ""
              this.etablissementInfo = ""
              this.deficitError = ""
                Swal.fire({
                  icon: 'success',
                  html: 'La demande d\'expression de besoins a été soumise avec succès.',
                  showConfirmButton: false,
                  timer: 2000
                }).then(() => {
                  this.router.navigate(['gpeec/besoin-en-personnel']);
                });
              }
          }
        })
  }

  onReset(): void {
    this.location.back();
  }

  getAllFiliere(){
    this.filiereService.getAll().subscribe({
      next : (data : ResponseApi2)=>{
        if(data.status?.includes("OK"))
        this.listFilieres = data.payload

      }
    })
  }

  getFiliere(idFiliere : any){
    let id = parseInt(idFiliere);
    let filiere = this.listFilieres.find((item: any) => {
      return item.id === id;
    });
    return filiere
  }

  getUserDetail(){
    this._userService.getOneUser(this.userInfos.id)
                     .subscribe({
                      next : (data : any) =>{
                          this.user = data.data
                          if(this.user.typeUser === 'DEC')
                          {
                            this.etablissementC = this.user.etablissement
                            this.iaC = this.user.ia
                            this.iefC = this.user.ief
                            this.regionC = this.user.region
                            
                           this.getFicheEtablissement()
                            this.getProfByCodeEtablissement()
                            this.getDisciplineAyantDeficit()
                            this.isUserDeconcentred = true
                          } 
                       // this.initForm()
                      }
                     })
  }

  getFicheEtablissement(){
    this.noFiche = !this.noFiche
    this.ficheService.getFicheByCodeEtab(this.etablissementC.code)
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
                  if(data.status?.includes("OK")){
                    this.ficheSnoptique = data.payload
                   // console.log({fiche : this.ficheSnoptique});
                   // console.log({userFic :this.user});
                  // this.calculerDeficit()
                  this.getDisciplineAyantDeficit() 
                    this.noFiche = false
                  }else{
                    //this.getUserDetail()
                    this.noFiche = true
                  }
              },
              error : (error) =>{
                
                console.error('Une erreur est survenue :', error);
              }
                    
           })
  }

  calculerDeficit() {
    
    this.deficit = 0
    let totalesHeuresDisp  = 0 
    let quantumProfs = 0
    for(let Classe of this.ficheSnoptique.classeProfDisciplines){
      for(let professeur of Classe.profDiscipline){
        for(let discipline of professeur.disciplineQuantums){
           // if(discipline.discipline.id = idDiscipline)
              totalesHeuresDisp += discipline.quantum        
        }

      }
    }
    for(let prof of this.listProfs){
      quantumProfs += prof.quantumHoraire
    }
    if(this.quantum > 0)
    { let def = (totalesHeuresDisp - quantumProfs) / this.quantum
    let deficit = Math.round(def)
    if(def > deficit)
      deficit += 1
    if(deficit)
    this.deficit = deficit
  }
  else
    this.deficit = 0
   // console.log({q: this.quantum, dis: totalesHeuresDisp, qP: quantumProfs, tot : deficit});
    
  }
  // calculerDeficit( idDiscipline : number) {
  //   //nombre Total  d'heures que la que la discipline est dispensée dans ll'etablissement
  //   let totalesHeuresDisp  = 0 
  //   let quantumProfs = 0
  //   for(let Classe of this.ficheSnoptique.classeProfDisciplines){
  //     for(let professeur of Classe.profDiscipline){
  //       for(let discipline of professeur.disciplineQuantums){
  //           if(discipline.discipline.id = idDiscipline)
  //             totalesHeuresDisp += discipline.quantum
  //       }

  //     }
  //   }
  //   console.log({tot : totalesHeuresDisp});
    
  // }
  getProfByCodeEtablissement(){

    this._userService.listProfParEtablissement(this.etablissementC.code)
      .subscribe(response => {
        if (response.success) {
          this.listProfs = response.data
        //  console.log({pr : this.listProfs});

        }
      });
  }
    
  getListEF(code: any): void {
    this.etablissement = []
    this.referenceService.listIEFByCode(code)
        .subscribe(response => {

          if (response.success) {

             this.ief = response.data;
            // let i = this.ia.find(ia => ia.code = code) 
            // if(i)
            //   this.iaC = i            
          }
        });
  }

  getListIA(event: any): void {
    let code  = event.target.value
    
    this.referenceService.listIAByCode(code)
        .subscribe(response => {

          if (response.success) {
            this.ia = response.data;
           this.getListEF("")
            // console.log({ia : this.ia});
            
            // let i = this.region.find(( rg : any) => rg.code = code) 
            // if(i)
            //   this.regionC = i  
          }
        });
  }

  getListEtablissement(code: any): void {

    this.referenceService.listEtablissementByCode(code)
        .subscribe(response => {

          if (response.success) {
            this.etablissement = response.data;
            // let i = this.ief.find(ief => ief.code = code) 
            // if(i)
            //   this.iefC = i
            
          }
        });
  }
  get f(): { [p: string]: AbstractControl } {
    return this.expressionForm!.controls;
  }

  getChoosedEtablissement(code : any){
    let i = this.etablissement.find(et => et.code = code) 
    if(i)
      {
        this.etablissementC = i   
        this.getFicheEtablissement()   
     }
  }
  getChoosedGrade(code : any){
    let i = this.grade.find((gde : any ) => gde.code = code) 
    if(i)
      this.gradeC = i
  }

  getListRegion(){
    this.referenceService.listRegion().subscribe(response => {
      if(response.success)
        this.region = response.data;
       
    });
  }
getListCorps(){
  
  this.referenceService.listcorpsGrade().subscribe(response => {
    if(response.success)
       this.allCorps = response.data;
    let corpsProfs = ['PES', 'PEPS','PEM', 'PEAM', 'PCS', "PCEMG", "MEPS","MEAM","METP", "PCI", "CCC"]
    for(let cp of corpsProfs)
      {
        let corpdFind = this.allCorps.find((cor : CorpsGrade) => cor.code === cp)
        if(corpdFind)
          this.corps.push(corpdFind)
      }
    //console.log({cp : this.corps});
    
  });
}
getGradeFromCorps(code: any) {

  this.referenceService.listGradeByCode(code)
      .subscribe(response => {

          if (response.success) {
              this.grade = response.data;
              // let i = this.corps.find((cp : any) => cp.code = code) 
              // if(i)
              //   this.corpsC = i

               // this.calculerDeficit()
                this.getDisciplineAyantDeficit() 
          }
      });
}

checkQuatum(qtum: any) {
  switch (qtum) {
      case 'PES':
      case 'PEPS':
      case 'PEM':
      case 'PEAM':
      case 'PCS':
          this.quantum = 525
        //  this.calculerDeficit()       
          break;
      case "PCEMG":
      case "MEPS":
      case "MEAM":
      case "METP":
      case "PCI":
      case "CCC":
          this.quantum = 625
          //this.calculerDeficit()
          break;

      case "VACATAIRE":
          {this.quantum = 500
          //  this.calculerDeficit()
          }
          break;

      default:
        this.quantum = 0



  }


}

// filiere disciplines nombre à recruter
  //ajouter une filiere et ses disciplines
  addFiliereDiscipline() {

    let filiereDisc: BEPFiliereDiscipline = new BEPFiliereDiscipline()
    // let fil = this.listFilieres.find((fil: Filiere) => fil.id == parseInt(this.filiereDisciplinesForm.value.filiere))
    // if (fil)
    //   filiereDisc.filiere = fil

    let disciplineNbre: BesoinEnNombreDiscipline[] = []
    let filDisc = this.filiereDisciplinesForm.value.disciplines
    //if(filDisc && fil)
    if(filDisc )
     {  
      this.filiereError = ""
      this.disciplineError = ""
      for (let dp of this.filiereDisciplinesForm.value.disciplines) {
          let d: Discipline = new Discipline()
          d.id = dp.id
          d.libelle = dp.libelle
          let existedDis = false
          let discp = this.listDisciplinesUsed.find((l : Discipline) => l.id == dp.id)
          if(discp)
            existedDis = true

          let discQ: BesoinEnNombreDiscipline = new BesoinEnNombreDiscipline()
          discQ.discipline = d
          let disDef = this.listDisciplineDeficitaire.find((l : DisciplineDeficitaire) => l.discipline.id == dp.id)
      
          if(disDef && this.quantum > 0)
              { 
                let def = (disDef.totalHeuresDispensee - disDef.totalHeuresAttribuees) / this.quantum
                let deficit = Math.round(def)

                if(def > deficit)
                  deficit += 1

                discQ.nombreDePersonne = deficit
            }
          this.listDisciplinesUsed.push(d)

          if(!existedDis)
            disciplineNbre.push(discQ)
        }
        filiereDisc.besoinEnNombreDisciplines = disciplineNbre
        this.filiereDisciplines.push(filiereDisc)

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
      }
      else {
            // if(!fil && !filDisc)
            //   {
            //     this.filiereError = "Veuillez choisir une filiére."
            //     this.disciplineError = "Veuillez choisir au moins une discipline."
                
            //   }else if(!fil){
            //     this.filiereError = "Veuillez choisir une filiére."
            //     this.disciplineError = ""
            //   }
            // else {
                  this.disciplineError = "Veuillez choisir au moins une discipline."
                  this.filiereError = ""
                // }
          }

          
  }
//initialisation formulaire
initFormFiliereDiscp(): void {
  this.filiereDisciplinesForm = this.fb.group({

    filiere: [new Filiere()],
    disciplines: []
  });
}

    //quatumsValues
    quatumsValues( indexFiliere : number, indexDisc : number, event : any){
       console.log({iF: indexFiliere, iD : indexDisc, quant : event.target.value});
       let qValue : QuantumValues = new QuantumValues()
       qValue.idF = indexFiliere
       qValue.idD = indexDisc

       let indexExistingQuant = this.quantumsValuesListFilieres.findIndex((q : QuantumValues) => q.idF == indexFiliere && q.idD == indexDisc)
   
       if(indexExistingQuant >= 0)
          this.quantumsValuesListFilieres[indexExistingQuant].nombreDePersonne = parseInt(event.target.value)
       else  
          {
            qValue.nombreDePersonne = parseInt(event.target.value)
            this.quantumsValuesListFilieres.push(qValue)
          }

         console.log({quan : this.quantumsValuesListFilieres});
      
     }

     addQuantumValues(listFiliereDisc : BEPFiliereDiscipline[], quantumVal: QuantumValues[] ){
      let i = 0;
      for(let filier of listFiliereDisc){
        let qV = quantumVal.filter(q => q.idF == i)
        let j = 0
        for(let disc of filier.besoinEnNombreDisciplines){
          let quantD = qV.find(dq => dq.idD == j)
          if(quantD)
            listFiliereDisc[i].besoinEnNombreDisciplines[j].nombreDePersonne = quantD?.nombreDePersonne
    
          j++
        }
        i++
      }
    }

    /// les disciplines déficitaires
    getDisciplineAyantDeficit(){
      console.log({avant : 'avant',q: this.quantum, dis: this.totaleHeureDispensee, att: this.totaleHeureAttribuee, def : this.deficit});
    
      this.ficheService.getDisciplineAyantDeficit(this.etablissementC.code, 0, 50, "")
             .subscribe(
              {
                next : (data : ResponseApi2)=>{
                    if(data.status?.includes("OK")){
                      this.listDisciplineDeficitaire = data.payload
                
                      let hd = 0
                      let ha = 0
                      //this.quantum = 0
                      this.totaleHeureAttribuee = 0
                      this.totaleHeureDispensee = 0
                      for(let listDisp of this.listDisciplineDeficitaire){
                        hd += listDisp.totalHeuresDispensee
                        ha += listDisp.totalHeuresAttribuees
                      }
                      this.totaleHeureDispensee = hd
                      this.totaleHeureAttribuee =  ha
                      if( this.quantum > 0)
                      {
                        let def = (this.totaleHeureDispensee - this.totaleHeureAttribuee) / this.quantum

                        let deficit = Math.round(def)
                        if(def > deficit)
                          deficit += 1
                        if(deficit)
                        this.deficit = deficit
                      }
                      else this.deficit = 0
                  //    console.log({apres: 'apres', q: this.quantum, dis: this.totaleHeureDispensee, att: this.totaleHeureAttribuee, def : this.deficit});

                    }
                  },
                error : (error) =>{
                  
                  console.error('Une erreur est survenue :', error);
                }
                      
             })
    }
    //maxValues disciplines
    calculDeficitParDiscipline(discipline : Discipline) : number{
      let nbr = 0
      let disDef = this.listDisciplineDeficitaire.find((l : DisciplineDeficitaire) => l.discipline.id == discipline.id)
      if(disDef && this.quantum > 0)
          { 
            let def = (disDef.totalHeuresDispensee - disDef.totalHeuresAttribuees) / this.quantum
          let deficit = Math.round(def)
          if(def > deficit)
            deficit += 1
          nbr = deficit 
        }
        return nbr
    }

    //suppression

    onDelete(indFiliere : number, disciplineQunt : BesoinEnNombreDiscipline[], idDisc : number) {
      if(disciplineQunt.length == 1)
      this.filiereDisciplines.splice(indFiliere, 1)
      else{
          let index = disciplineQunt.findIndex((dq : BesoinEnNombreDiscipline) => dq.discipline.id === idDisc);
          disciplineQunt.splice(index, 1)
        }
  
   }
}
