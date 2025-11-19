import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { CredentialsService } from 'src/app/services/credentials.service';
import { FormationService } from 'src/app/services/formation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-view-formation',
  templateUrl: './detail-view-formation.component.html',
  styleUrls: ['./detail-view-formation.component.css']
})
export class DetailViewFormationComponent implements OnInit {
 
  @Input() status: "PUBLIEER" | "DEMARREER" = "DEMARREER";
  @Input() isPublished: boolean = false;
  
  headers: string[] = ['N° Demande', 'Matricule', 'Participant', 'Direction', 'Corps et grade', 'Type', 'Titre de la formation', 'Actions'];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  participantList!: any[];
  rapport: any;
  closeResult = '';
  commentaire = '';
  cahiercharge: any;
  userInfos:any;
  listSession: any[] = [];
  pjPVExamen: any[] = [];
  
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private readonly _credentialService: CredentialsService,
    public modalService: NgbModal = inject(NgbModal),
    private readonly formationService: FormationService
  ) {

    this.userInfos = this._credentialService.getUserInfos();
    if (this.userInfos)
      this.userInfos.id
   }
  

   FormationRef: string = "";
   tdr: string = "";
   convo: string = "";
   particip: string = "";
   demandeList!: any;
   convocations!: any;
   description: string = "";
   cout: string = "";
   debut: string = "";
   fin: string = "";
   theme: string = "";
   type: string = "";
   titre: string = "";
   duree: string = "";
   formateurs!: any[];
   fileParticipants: any;

  ngOnInit(): void {
    this.refreshData();
    this.route.params.subscribe(params => {
      this.FormationRef = params['dataId'];
      console.log(this.FormationRef);
    });

    this.getFormation(this.FormationRef);

   }

   getFormation(ref:string){

    this.formationService.getFormations(ref).subscribe((response)=>{
        console.log(response);
        this.demandeList=response;
        this.getConvocation(this.demandeList.id);
        this.getParticipant(this.demandeList.id);
        this.getRapport(this.demandeList.id);
        this.getSession(this.demandeList.id);
        this.getPvExamen(this.demandeList.id);
        this.cout==this.demandeList.cout;
        this.type==this.demandeList.typeFormation.libelle;
        this.titre==this.demandeList.intitule;
        this.duree==this.demandeList.duree;
        //console.log(this.duree);
        this.debut=this.demandeList.dateDebut;
        this.fin=this.demandeList.dateFin;
        this.theme=this.demandeList?.themeFormation?.libelle;
        this.description=this.demandeList.description;
        this.formateurs=this.demandeList.formateurs;
        if(this.demandeList.typeFormation.code=="DIPLOMANTE"){
          this.cahiercharge = this.demandeList.cahierCharge;
        }
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
    });

    // this.http.get(environment.apiUrl+"api/formations/reference/"+ref, {headers: {
    //   'content-type': 'application/json',
    //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
    // }}).subscribe(
    //   (response:any) => {
    //     console.log(response);
    //     this.demandeList=response;
    //     this.getConvocation(this.demandeList.id);
    //     this.getParticipant(this.demandeList.id);
    //     this.getRapport(this.demandeList.id);
    //     this.cout==this.demandeList.cout;
    //     this.type==this.demandeList.typeFormation.libelle;
    //     this.titre==this.demandeList.intitule;
    //     this.duree==this.demandeList.duree;
    //     //console.log(this.duree);
    //     this.debut=this.demandeList.dateDebut;
    //     this.fin=this.demandeList.dateFin;
    //     this.theme=this.demandeList.themeFormation.libelle;
    //     this.description=this.demandeList.description;
    //     this.formateurs=this.demandeList.formateurs;
    //     if(this.demandeList.typeFormation.code=="DIPLOMANTE"){
    //       this.cahiercharge = this.demandeList.cahierCharge;
    //     }
    //     console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
    //     //console.log(this.getThemeFormation(response[0].themeFormationId));
    //     //console.log(this.getThemeFormation(response[0].themeFormationId));
    //   },
    //   (error) => console.log(error)
    // )
  }

  getSession(id:string){

    this.formationService.getSessionByFormation(id).subscribe((response)=>{
      console.log(response.success);
        console.log(response.data);
        console.log(response);
        if(response.success==true){
        
          for(var i=0; i<response.data.length; i++){
            this.listSession.push({
              fileName: response.data[i]?.file?.originalName,
              commentaire: response.data[i]?.commentaire,
              dateDebut: response.data[i]?.dateDebut,
              dateFin: response.data[i]?.dateFin,
              generatedName: response.data[i]?.file?.generatedName
            });
          }
          
        }else {
  
        }
        
    }, 
    (error) => {
      console.log(error);
      console.log(error.status);
      
    }
  );
  
   }

   getPvExamen(id:string){
  
    this.formationService.getPvExamenByFormation(id).subscribe((response)=>{
      console.log(response.success);
      console.log(response.success);
        console.log(response.data);
        console.log(response);
        if(response.success==true){
          this.pjPVExamen=response.data;
          
          
        }else {
  
        }
        
    }, 
    (error) => {
      console.log(error);
      console.log(error.status);
      
    }
  );
  
   
   }

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

  getConvocation(ref:string){
    this.http.get(environment.apiUrl+"api/convocations/"+ref, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        this.convocations=response.data;
        this.tdr=this.convocations?.tdr.generatedName;
        this.convo=this.convocations.convocation.generatedName;
        this.particip=this.convocations.participants.generatedName;
        console.log(this.convocations);
      },
      (error) => console.log(error)
    )
  }

  getRapport(ref:string){
    this.http.get(environment.apiUrl+"api/rapports/by-formation/"+ref, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        this.rapport=response;
        this.commentaire=this.rapport.commentaire;
        //this.rapport=response.data;
        this.piecesJointesList=response.files;
        console.log(this.convocations);
      },
      (error) => console.log(error)
    )
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

   getParticipant(id:string){

    this.http.get(environment.apiUrl+"api/participants/formation/"+id, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        console.log(response.fileParticipant);
        this.fileParticipants=response.fileParticipant;
      },
      (error) => {
        console.log(error);
        console.log(error.status);
      }
    )
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
    this.participantList = DATA.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
    }
  
  goBack() {
    this.location.back();
  }

  onSearch() {
    console.log('Result');
  }

  onViewDemande(data: any) {
    this.router.navigate(['/formations/demandes-de-formation',data.num_demande,'detail-view'], { relativeTo: this.route });
  }
  convocationList:any[] = [
    {
      fileName: "Termes de référence",
      fileSize: 102
    },
    {
      fileName: "Convocation",
      fileSize: 907
    },
    {
      fileName: "Participants",
      fileSize: 312
    }
  ];
  
  piecesJointesList:any[] = [];
}

const DATA: any[] = [
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 2',
    grade: 'grade 2',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 1',
    corps: 'corps 1',
    grade: 'grade 1',
    titreFormation: 'Lorem'
  },
  {
    num_demande: 'DEM000',
    matricule: 'MAT00',
    prenom: 'Lorem',
    nom: 'ispum',
    typeDemande: 'type',
    direction: 'Direction 2',
    corps: 'corps 2',
    grade: 'grade 2',
    titreFormation: 'Lorem'
  },
]