import { Component, OnInit } from '@angular/core';
import { DossierAgentService } from '../services/dossier-agent/dossier-agent.service';
import { DossierAgent } from '../models/dossier-agent/dossier-agent';
import { Diplome } from '../models/dossier-agent/diplome';
import { Avancement } from '../models/dossier-agent/avancement';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SearchPipe } from '../Pipes/Search.pipe';
import { EtatCivil } from '../models/dossier-agent/etatCivil';
import {NgxSpinnerService} from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import {CredentialsService} from "../../../services/credentials.service";


@Component({
  selector: 'app-mon-dossier',
  templateUrl: './mon-dossier.component.html',
  styleUrls: ['./mon-dossier.component.css']
})
export class MonDossierComponent implements OnInit {

  headersSituation!: string[];
  headersDiplome!: string[];
  headersEtatCivile: string[] = ["Nom fichier", 'Fichier'];
  page = 1;
  pageSize = 10;
  collectionSize1 = 0;
  collectionSize2 = 0;
  collectionSize3 = 0;
  situationList: any;
  diplomeList!: Diplome[];
  collapsed: boolean = false;
  utilisateur: any;
  matricule!: string;
  dossier !: DossierAgent;
  apiUrl: string = environment.apiUrl;
  searchTextDiplome: any;
  searchTextAvancement: any;
  EtatCivilList: EtatCivil[] = [];
  idDossier : any
  idDossierUser : any
  userInfos: any;

  dossierAgent!: DossierAgent;

  constructor(
      private dossierAgentService: DossierAgentService,
      private _httpClient: HttpClient,
      private credentialsService: CredentialsService,
      private route : ActivatedRoute,
      private spinner: NgxSpinnerService,
  ) {
    this.idDossierUser = this.route.snapshot.params['idDossier'];
  }

  ngOnInit(): void {
    // Initialize data and headers
    this.headersSituation = ["Numéro Acte","Date acte", "Type acte", "acte","Pièce jointes"];
    this.headersDiplome = ["Date d'obtention", "Nom diplôme", "Pièces jointes"];
    this.refreshData();
    this.getIdDossier()

    //this.getDiplomes();
  }

  getIdDossier(){
    this.userInfos = this.credentialsService.getUserInfos();
    // console.log("idDossier",this.userInfos);

    // this.idDossier = this.userInfos?.id;


    if(this.idDossierUser) {

      this.dossierAgentService.get(this.idDossierUser).subscribe({
        next: (res) => {

          localStorage.setItem("idDossier", JSON.stringify(res));

          this.idDossier =  res?.payload
          this.spinner.hide();

          this.getDossierCurrentUser();

        },
        error: (err) => {

          this.spinner.hide();

          this.dossierAgentService.showSwal('error', err?.error?.message);
        }
      });
    }else {
      this.dossierAgentService.getDossierUserId(this.userInfos?.id).subscribe({
        next: (res) => {

          localStorage.setItem("idDossier", JSON.stringify(res));

          this.idDossier =  res?.payload
          this.spinner.hide();

          this.getDossierCurrentUser();

        },
        error: (err) => {

          this.spinner.hide();

          this.dossierAgentService.showSwal('error', err?.error?.message);
        }
      });
    }


  }

  getDossierCurrentUser(){
    this.spinner.show();

    if(this.idDossier == 0){

      this.dossierAgentService.getDossierCurrentUser().subscribe((res)=>{

          this.dossier = res.payload;
          this.utilisateur = res.payload.utilisateur;
          this.situationList = res.payload.situationAdministrative;
          this.matricule = res.payload.utilisateur.matricule;
          this.EtatCivilList = res.payload.etatCivil
          //this.avancementList = res.payload.avancements;
          //this.diplomeList = res.payload.diplomes;
        
          //this.collectionSize2 = this.diplomeList.length;
          this.diplomeList = this.dossier.diplomes;
        this.spinner.hide();
      })
    }else{
      this.dossierAgentService.get(this.idDossier?.id).subscribe({
        next : ((data) => {

          this.dossier = data.payload
          this.utilisateur = data.payload.utilisateur;
          this.situationList = data.payload.situationAdministrative;
          this.matricule = data.payload.utilisateur.matricule;
          this.EtatCivilList = data.payload.etatCivil
          this.diplomeList = this.dossier.diplomes;


         // console.log("ddf",  this.diplomeList)

          this.spinner.hide();

        })
      })
    }
   
  }

  getDiplomes = () => {
    console.log("dans getDiplomes");
    if(this.matricule){
      console.log("dans getDiplomes 222");
      this.dossierAgentService.getDiplomes(this.matricule,this.page,this.pageSize).subscribe({
        next : (res : any) =>{
          console.log("les données diplomes ++++ ", res)
          this.diplomeList = res.data[0];
          this.collectionSize2 = res.data[0].length;
          }
      })
    }          
  }

  Telecharger(filename:string){
    
    this._httpClient.get(`${this.apiUrl}file/download/${filename}`, {
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


  refreshData() {
    this.situationList = []
    this.diplomeList = []
    this.EtatCivilList =   []
  }

}



