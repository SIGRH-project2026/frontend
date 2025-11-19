import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { CredentialsService } from 'src/app/services/credentials.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FicheSynoptiqueService } from '../../../fiche-etablissement/services/fiche-synoptique.service';
import { DeconectedDTO } from 'src/app/models/utilisateur';
import { HoraireProfs } from '../../models/HoraireProfs';
import { ActivatedRoute } from '@angular/router';
import { ClasseDisciplinesForProf } from '../../models/ClasseDisciplinesForProf';

@Component({
  selector: 'app-detail-horaire-professeur',
  templateUrl: './detail-horaire-professeur.component.html',
  styleUrls: ['./detail-horaire-professeur.component.css']
})
export class DetailHoraireProfesseurComponent {
  headers!: string[];
  page = 1;
	pageSize = 10;
	collectionSize = 0;
	elementList!: any[];
  collapsed:boolean = false;
  text = '';
  closeResult = '';
  horaireListe: any[] = [
    {
      NomClasse: 'classe A',
      disciplines: [
        {
          nomDiscipline: 'Math',
          quantumHorairedispense: 1,
        },
        {
          nomDiscipline: 'SVT',
          quantumHorairedispense: 1,
        },
      ]
    },
    {
      NomClasse: 'classe A',
      disciplines: [
        {
          nomDiscipline: 'Math',
          quantumHorairedispense: 1,
        },
        {
          nomDiscipline: 'SVT',
          quantumHorairedispense: 1,
        },
      ]
    },
    {
      NomClasse: 'classe B',
      disciplines: [
        {
          nomDiscipline: 'Math',
          quantumHorairedispense: 1,
        }
      ]
    },
  ];
  userInfos : any
  idProf : any
  user: DeconectedDTO = new DeconectedDTO();
  listHoraireProfs: HoraireProfs[] = [];
  profHoraire : HoraireProfs = new HoraireProfs()
   constructor(

     public modalService: NgbModal = inject(NgbModal),
     private  location : Location,
     private readonly _credentialService: CredentialsService,
     private readonly _userService : UtilisateurService,
     private readonly ficheService : FicheSynoptiqueService,
     private readonly activatedRoute : ActivatedRoute
   ) {
     this.userInfos = this._credentialService.getUserInfos();
     if(this.userInfos)
       this.userInfos.id
       this.getUserDetail()
      
      this.idProf = this.activatedRoute.snapshot.paramMap.get('Id')
    }
  

  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['Nom classe','Discipline','Heures dispensées' ];
   // this.refreshData();
    this.getUserDetail()
  }

  countRows(classe: any): number {
    let total = 0;
    classe.professeurs.forEach((professeur: any) => {
      total += professeur.disciplines.length;
    });
    return total;
  }

  countRows2(classe:ClasseDisciplinesForProf):number {
    let totalRows =0; 
    classe.disciplineQuantum.forEach(() => {
      totalRows +=1;
    });
    totalRows +=1;
    return totalRows;
  }


  getUserDetail(){
    this._userService.getOneUser(this.userInfos.id)
                     .subscribe({
                      next : (data : any) =>{
                          this.user = data.data
                         // console.log({user :this.user});
                         this.getProfsHoraires()
                       
                      }
                     })
  }

 

  refreshData() {
		// this.elementList = DATA.map((user:any, i:any) => ({ id: i + 1, ...user })).slice(
		// 	(this.page - 1) * this.pageSize,
		// 	(this.page - 1) * this.pageSize + this.pageSize,
		// );
  }

  goBack() {
    this.location.back()
  } 
  getProfsHoraires(){
    this.ficheService.getHoraireProfsByCodeEtab(this.user.etablissement.code, 0,1000, "", "")
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
                  if(data.status?.includes("OK")){
                    this.listHoraireProfs = data.payload
                    let p = this.listHoraireProfs.find((ProfH : HoraireProfs) => ProfH.professeur.id == this.idProf)
                    if(p)
                      this.profHoraire = p
                    console.log({pro : this.profHoraire});
                    
                  }
                },
              error : (error) =>{
                
                console.error('Une erreur est survenue :', error);
              }
                    
           })
  }
}



