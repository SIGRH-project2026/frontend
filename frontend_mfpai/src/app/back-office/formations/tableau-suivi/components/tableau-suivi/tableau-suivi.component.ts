import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormationService } from 'src/app/services/formation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tableau-suivi',
  templateUrl: './tableau-suivi.component.html',
  styleUrls: ['./tableau-suivi.component.css']
})
export class TableauSuiviComponent  implements OnInit {

  headers: string[] = ['N° Référence', 'Titre de la formation', 'Date Début', 'Date Fin','Nbr de sessions','Présences','Abscences','Action'];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  dataList!: any[];
  tableauList!: any;
  closeResult = '';
  FormationId: string = "";

  formation: any;
  dateDebut: string="";
      dateFin: string="";
      intitule: string="";
      typeFormation: string="";
      cout: string="";
      description: string="";
      theme: string="";
      duree: string="";
      prestataires: string="";

  constructor(
    private http: HttpClient,
    private readonly formationService: FormationService,
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal)
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.FormationId = params['dataId'];
      console.log(this.FormationId);
    });

    localStorage.setItem("idFormCreateTableauSuivi", this.FormationId);

    this.getFormation(this.FormationId);

    this.getTableauSuivi();

    this.refreshData();
  }

  getFormation(id:string){
   this.http.get(environment.apiUrl+"api/formations/"+id, {headers: {
     'content-type': 'application/json',
     'Authorization': `Bearer ${localStorage.getItem("Token")}`
   }}).subscribe(
     (response:any) => {
       console.log(response);
       this.formation=response;
       this.dateDebut=this.formation.dateDebut;
       this.dateFin=this.formation.dateFin;
       this.cout=this.formation.cout;
       this.description=this.formation.description;
       this.intitule=this.formation.intitule;
       
       this.duree=this.formation.duree;
       
       //this.selectedFormateurs=this.form
       console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
       


     },
     (error) => console.log(error)
   )
 }

  getTableauSuivi(){

    this.formationService.getTableauSuiviByFormation(this.FormationId).subscribe((response)=>{
      console.log(response.success);
        console.log(response.data);
        this.tableauList=response;
        console.log(response);
        if(response.success==true){
          
          
        }else {
  
        }
        
    }, 
    (error) => {
      console.log(error);
      console.log(error.status);
      
    }
  );
    
   }

  refreshData() {
    this.dataList = this.tableauList.map((data: any, i: any) => ({ id: i + 1, ...data })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }


  onCreateTableauSuivi() {
    this.router.navigate(['create-tableau-suivi'],{ relativeTo: this.route });
  }

  onViewDetail(data: any) {
    this.router.navigate([data.id, 'detail-view'],{ relativeTo: this.route });
  }

}

const DATA: any[] = [
  {
    reference: 'ref000',
    titreFormation:'Lorem ipsum',
    dateDebut:'Lorem ipsum',
    dateFin:'Lorem ipsum',
    nbrSessions:'Lorem ipsum',
    presences:'Lorem ipsum',
    absences:'Lorem ipsum'
  },
  {
    reference: 'ref000',
    titreFormation:'Lorem ipsum',
    dateDebut:'Lorem ipsum',
    dateFin:'Lorem ipsum',
    nbrSessions:'Lorem ipsum',
    presences:'Lorem ipsum',
    absences:'Lorem ipsum'
  },
  {
    reference: 'ref000',
    titreFormation:'Lorem ipsum',
    dateDebut:'Lorem ipsum',
    dateFin:'Lorem ipsum',
    nbrSessions:'Lorem ipsum',
    presences:'Lorem ipsum',
    absences:'Lorem ipsum'
  },
  {
    reference: 'ref000',
    titreFormation:'Lorem ipsum',
    dateDebut:'Lorem ipsum',
    dateFin:'Lorem ipsum',
    nbrSessions:'Lorem ipsum',
    presences:'Lorem ipsum',
    absences:'Lorem ipsum'
  }
]


