import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import * as path from "node:path";
import {DemandeStageService} from "../../../services/demande-stage.service";
import {CourrierService} from "../../../services/courrier.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CredentialsService} from "../../../services/credentials.service";
import {ParametreService} from "../../../services/parametre.service";
import {DashboardComponent} from "../dashboard.component";
import {FormationService} from "../../../services/formation.service";

@Component({
  selector: 'app-dfc-dashboard',
  templateUrl: './dfc-dashboard.component.html',
  styleUrls: ['./dfc-dashboard.component.css']
})


export class DFCDASHBOARDComponent implements OnInit {
  items: any[] = [];
  constructor(private router: Router,private demandeStageService: DemandeStageService,
              private courrierService: CourrierService,
              private spinner: NgxSpinnerService, private credentialsService : CredentialsService,
              private parametreService: ParametreService,
              private credentialSercice: CredentialsService,
              private formationService: FormationService
  ) { }

  nombreDemandeStageAutoriserNonAutoriserEnregistrer: any;
  nombreDeCourrierTraiterEtNomTraiter: any;



  onItemClick(path: string, statut: string): void {
    switch(statut){
      case 'AUTORISER':
        sessionStorage.setItem("statutDemandeStage",'AUTORISER')
        break;
      case 'ENREGISTRER':
        sessionStorage.setItem("statutDemandeStage",'ENREGISTRER')
        break;
      case 'NONAUTORISER':
        sessionStorage.setItem("statutDemandeStage",'NONAUTORISER')
        break;
    }
    this.router.navigate([path]);
  }

  getBackgroundColor(title: string): string {
    if (title.toLowerCase().includes('formations')) {
      return 'background-pink';
    } else if (title.toLowerCase().includes('agents')) {
      return 'background-gray';
    } else if (title.toLowerCase().includes('demandes')) {
      return 'background-green';
    }
    return '';
  }

  getIconColor(title: string): string {
    if (title.toLowerCase().includes('formations')) {
      return 'rose';
    } else if (title.toLowerCase().includes('agents')) {
      return 'gray';
    } else if (title.toLowerCase().includes('demandes')) {
      return 'green';
    }
    return 'black';
  }

  userInfos: any;
  role: string | undefined;

  canSeeDFCCentral(){
    let roles = [
      'Chef-division-dfc',
      'Chef-division-das',
      'Directeur-DRH',
      'Chef-service',
      'Chef-division-dgcaa',
      'Chef-division-dgpeec',
    ]
    return roles.includes(this.role || '');
  }


  ngOnInit(): void {


    this.role = this.credentialSercice.getUserInfos()?.profil[0].code
    this.userInfos = this.credentialsService.getUserInfos();
    this.getData()
  }

  // recuperation donnees
  getData(){
    this.spinner.show()
    this.demandeStageService.nombreDemandeStageAutoriserNonAutoriserEnregistrer().subscribe((res)=>{
      this.nombreDemandeStageAutoriserNonAutoriserEnregistrer = res.payload
      this.formationService.getTrainingStatusCounts().subscribe((res)=>{
        let data: any = res
        this.items.push(
            { title: 'Formations ', count: data.plannedTrainings, statut: 'planifiées', path: '/formations/liste-des-formations', statutCode: ''},
            { title: 'Formations ', count: data.ongoingTrainings, statut: 'en cours', path: '/formations/liste-des-formations', statutCode: '' },
            { title: 'Formations ', count: data.closedTrainings, statut: 'clôturées', path: '/formations/liste-des-formations',  statutCode: '' },
            { title: 'Agents ', count: data.formedAgents, statut: 'formés', path: '/gpeec/personnel', statutCode: ''  },
            { title: 'Demandes de stages ', count: this.nombreDemandeStageAutoriserNonAutoriserEnregistrer.nombreDemandeStageEnregistrer, statut: 'enregistrées', path: '/formations/stages-internes', statutCode: 'ENREGISTRER' },
            { title: 'Demandes de stages ', count: this.nombreDemandeStageAutoriserNonAutoriserEnregistrer.nombreDemandeStageAutoriser, statut: 'autorisées', path: '/formations/stages-internes', statutCode: 'AUTORISER'},
            { title: 'Demandes de stages ', count: this.nombreDemandeStageAutoriserNonAutoriserEnregistrer.nombreDemandeStageNonAutoriser, statut: 'non autorisées', path: '/formations/stages-internes', statutCode: 'NONAUTORISER'},
        )

        this.spinner.hide()
      })

    })
  }

  canUserSeeDec(title: string){
    return this.isNotCentralUser() && (title.toLowerCase().includes('formations') || title.toLowerCase().includes('agents'))
  }

  canUserSeeCen(){
    return !this.isNotCentralUser()
  }

  isNotCentralUser(){
    //-Formations planifiées
    // -Formations en cours d'éxecution
    // -Formations Cloturées
    // -Nbre agents formés
    let roles = [
      'Chef-division-dfc',
      'Chef-division-das',
      'Directeur-DRH',
      'Chef-service',
      'Chef-division-dgcaa',
      'Chef-division-dgpeec',
    ]
    return !roles.includes(this.role || '');

  }

}
