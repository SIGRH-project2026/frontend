import { Component, TemplateRef, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FicheSynoptiqueService } from '../../../fiche-etablissement/services/fiche-synoptique.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { DisciplineDeficitaire } from '../../../horaire-professeurs/models/DisciplineDeficitaire';
import { ReferencesService } from 'src/app/services/references.service';
import { Etablissement } from 'src/app/models/utilisateur';

@Component({
  selector: 'app-detail-gap',
  templateUrl: './detail-gap.component.html',
  styleUrls: ['./detail-gap.component.css']
})
export class DetailGapComponent {
  headers!: string[];
  page = 1;
	pageSize = 10;
	collectionSize = 0;
	gapList!: any[];
  collapsed:boolean = false;
  text = '';
  closeResult = '';
  idDiscipline : any
  listDisciplineDeficitaire: DisciplineDeficitaire[] = [];
  allData: DisciplineDeficitaire[] = [];

  EtabHoraire: DisciplineDeficitaire[] = [];
  totaleHeureAttribuee : number = 0;
  totaleHeureDispensee : number = 0;

   constructor(
    private router: Router,
     private route: ActivatedRoute,
     public modalService: NgbModal = inject(NgbModal),
     private  location : Location,
     private readonly ficheService : FicheSynoptiqueService,
     private readonly referenceService : ReferencesService

   ) { 
      let id = this.route.snapshot.paramMap.get('Id')
      if(id)
        this.idDiscipline = parseInt(id)
   }
  
  

  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['Etablissement','Déficit'];
    //this.refreshData();
    // this.getDisciplineAyantDeficit()
    // this.getEtablissementHoraire()
    this.listEtablissementAyantDeficitSurUneDiscipline()

  }



  

  onViewGap(id: any) {
    this.router.navigate([id,'details-gap'], { relativeTo: this.route.parent })
  }
  


  goBack() {
    this.location.back()
  }

 
  // getDisciplineAyantDeficit(){
  //   this.ficheService.getDisciplineAyantDeficit(this.idDiscipline, this.page -1, this.pageSize, "")
  //          .subscribe(
  //           {
  //             next : (data : ResponseApi2)=>{
  //                 if(data.status?.includes("OK")){
  //                   this.listDisciplineDeficitaire = data.payload
  //                 }
  //               },
  //             error : (error) =>{
                
  //               console.error('Une erreur est survenue :', error);
  //             }
                    
  //          })
  // }
  listEtablissementAyantDeficitSurUneDiscipline(){
   this.listDisciplineDeficitaire = []
    
    this.ficheService.listEtablissementAyantDeficitSurUneDiscipline(this.page -1 , this.pageSize, this.idDiscipline)
  
           .subscribe(
            {
              next : (data : ResponseApi2)=>{
             
                  if(data.status?.includes("OK")){
                    this.listDisciplineDeficitaire = data.payload
                  
                  if(data.collectionSize)
                      this.collectionSize = data.collectionSize
                    let hd = 0
                    let ha = 0
                    //this.quantum = 0
                    this.totaleHeureAttribuee = 0
                    this.totaleHeureDispensee = 0
                    if(data.allData)
                      { this.allData = data.allData 
                        for(let listDisp of data.allData){
                          hd += listDisp.totalHeuresDispensee
                          ha += listDisp.totalHeuresAttribuees
                        }
                      }
                    this.totaleHeureDispensee = hd
                    this.totaleHeureAttribuee =  ha
                    
                  }
                },
              error : (error) =>{
                
                console.error('Une erreur est survenue :', error);
              }
                    
           })
  }
  // getEtablissementHoraire(){
  //   this.ficheService.getEtablissementHoraire(this.idDiscipline)
  //          .subscribe(
  //           {
  //             next : (data : ResponseApi2)=>{
  //                 if(data.status?.includes("OK")){
  //                   this.EtabHoraire = data.payload
  //                   console.log({et : this.EtabHoraire});
                    
  //                 }
  //               },
  //             error : (error) =>{
                
  //               console.error('Une erreur est survenue :', error);
  //             }
                    
  //          })
  // }
}



// }
