import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view-plan-formation',
  templateUrl: './view-plan-formation.component.html',
  styleUrls: ['./view-plan-formation.component.css']
})
export class ViewPlanFormationComponent implements OnInit {

  headers!: string[];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  demandeList!: any[];
  planFormation: [] = [];
  files: [] = [];
  collapsed: boolean = false;
  text = '';
  closeResult = '';
  themeFormationList: any[] = [];
  titre ="";
  dateDebut="";
  dateFin="";
  statut="";
  ref="";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public modalService: NgbModal = inject(NgbModal)
  ) { }

  ngOnInit(): void {
    // Initialize data and headers
    console.log(localStorage.getItem("idPlan"));

    this.http.get(environment.apiUrl+"plan-formation/"+localStorage.getItem("idPlan"), {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        this.planFormation= response["data"];

        console.log(this.planFormation);
        this.ref=response["data"]["reference"];
        this.titre = response["data"]["titre"];
        this.dateDebut=response["data"]["dateDebut"];
        this.dateFin=response["data"]["dateFin"];
        this.statut=response["data"]["statutPlanFormation"]["libelle"];
        this.files=response["data"]["files"];

        console.log(response["data"]["reference"]);


        this.http.get(environment.apiUrl+"themeformations/byPlanFormation/"+localStorage.getItem("idPlan"), {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {
            console.log(response);
            console.log("hhhhhhhhhhhhhhhhhhhhhhhh");
            this.themeFormationList=response;
            
            
          },
          (error) => console.log(error)
        )


        
      },
      (error) => console.log(error)
    )

    this.headers = ['Type de formation', 'Thème', 'Cibles', 'Durée', 'Direction responsable', 'Budget','Action'];
    this.refreshData();
   
  }

  // downloadFile(filename: string){
    
  //   this.http.get(environment.apiUrl+"files/download?filename="+filename, 
  //   {headers: {
  //     'accept': '*/*',
  //     'Authorization': `Bearer ${localStorage.getItem("Token")}`
  //   }}).subscribe(
  //     (response:any) => {
  //       console.log(response);
        
        
  //     },
  //     (error) => console.log(error)
  //   )
  // }

  downloadFile(filename: string): void {
    this.http.get(environment.apiUrl + "files/download?filename=" + filename, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${localStorage.getItem("Token")}`
      },
      responseType: 'blob' // traiter la réponse comme un blob
    }).subscribe(
      (response: Blob) => {
        // Créer une URL pour le contenu blob afin de pouvoir l'ouvrir dans une nouvelle fenêtre ou le télécharger
        const blobUrl = URL.createObjectURL(response);

        // Créer un élément d'ancrage invisible dans le document
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        document.body.appendChild(anchor);

        // Définir l'URL de l'ancrage sur l'URL blob et déclencher un clic
        anchor.href = blobUrl;
        anchor.download = filename; // Nom de fichier par défaut lors du téléchargement
        anchor.click();

        // Supprimer l'ancrage du document
        document.body.removeChild(anchor);

        // Libérer l'URL blob pour libérer la mémoire
        URL.revokeObjectURL(blobUrl);
      },
      (error) => console.log(error)
    );
  }

  getDirection(cibles: any){

    var ha="";
    if(cibles.length!=0){
      for(let cible of cibles){
        if(cibles.length =1){
          ha = ha +cible.code;
        }else {
          ha = ha + ", " +cible.code;
        }
       
      }
    }else{

    }

    return ha;
    
  }

  getCibles(profils: any){
  
    let labelsString = "";
profils.forEach((profil:any, index:any) => {
    // Ajoutez le label du profil actuel à la chaîne de caractères
    labelsString += profil.label;

    // Ajoutez une virgule si ce n'est pas le dernier élément du tableau
    if (index < profils.length - 1) {
        labelsString += ", ";
    }
});
console.log(labelsString);

return labelsString;


    
  }

  	openModalSearch(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg', centered: true }).result.then(
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
    this.demandeList = DATA.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }


  onViewDemande(user: any) {
    this.router.navigate([user.id, 'detail-theme-formation'], { relativeTo: this.route.parent })
  }

  onSearch() {
    console.log('Result');
  }

   onCreateFormation(theme: any) {
    localStorage.setItem("themeId", theme.id);
    localStorage.setItem("themeLibelle", theme.libelle);
    this.router.navigate([theme.id, 'create-formation'], { relativeTo: this.route.parent });
    sessionStorage.setItem("actionClick", 'CreatedFormation');
  }

}

const DATA: any[] = [
  { id: 10001, typeFormation: 'Continue', theme: 'Theme XX', duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1','Cible 2','Cible 3','Cible 4'],budget: "Budget XX" },
  { id: 10002, typeFormation: 'Diplômante', theme: 'Theme XX', duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1','Cible 2'],budget: "Budget YY" },
  { id: 10003, typeFormation: 'Continue', theme: 'Theme XX',duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1','Cible 2'],budget: "Budget YY" },
  { id: 10004, typeFormation: 'Diplômante', theme: 'Theme XX', duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1'],budget: "Budget XX" },
  { id: 10005, typeFormation: 'Continue', theme: 'Theme XX', duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1','Cible 2'],budget: "Budget YY" },
  { id: 10006, typeFormation: 'Diplômante', theme: 'Theme XX', duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1','Cible 2'],budget: "Budget YY" },
  { id: 10007, typeFormation: 'Continue', theme: 'Theme XX', duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1','Cible 2'],budget: "Budget YY" },
  { id: 10008, typeFormation: 'Continue', theme: 'Theme XX', duree: "Duree 1", directionRes: 'Direction XX', cibles:['Cible 1','Cible 2'],budget: "Budget XX" }
]