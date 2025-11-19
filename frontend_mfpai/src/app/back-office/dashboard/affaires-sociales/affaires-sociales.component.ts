import { Component } from '@angular/core';
import { IndicateursPec } from '../models/das/indicateursPec';
import { DemandePecService } from 'src/app/services/demandePecService';
import { CredentialsService } from 'src/app/services/credentials.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { ImputationOuBulletinService } from '../../carrieres/services/ImputationOuBulletin/ImputationOuBulletin.service';
import { IndicateursImpBul } from '../models/das/indicateursImpBul';
import { Router } from '@angular/router';
import { DemandePecDTO } from '../../affaires-sociales/models/DemandePecDTO';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-affaires-sociales',
  templateUrl: './affaires-sociales.component.html',
  styleUrls: ['./affaires-sociales.component.css']
})
export class AffairesSocialesComponent {
  profileCode: any;
  userInfos: any;
  profilConnecte: any;
  statPec !: IndicateursPec;
  statImpBul !: IndicateursImpBul;
  imputations!:number;
  bulletins!:number;
  allPec!:number;
  validPec!:number;
  rejectedPec!:number;
  items:any[]=[];
  item:any;
  demandePecList:DemandePecDTO[]=[];

  constructor(
    private readonly pecService : DemandePecService,
    private readonly impBulService : ImputationOuBulletinService,
    private readonly _credentialService: CredentialsService,
    private router: Router,
    private readonly spinner: NgxSpinnerService,

  ){
    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profileCode = this.profilConnecte[0].code
  }
  ngOnInit(): void {
    
   // console.log({role:this.userInfos.profil})
    this.remplirTableauItems(this.profileCode);
  }

 
  getBackgroundColor(title: string): string {
    if (title.toLowerCase().includes('formations')) {
      return 'background-pink';
    } else if (title.toLowerCase().includes('prise en charge')) {
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




  async remplirTableauItems(profil: string) {
    // Appel des deux fonctions statistiques en parallèle
    await Promise.all([
      this.statistiquesPec(profil),
      this.statistiquesImpBul(profil)
    ]);
  
    // Remplissage du tableau une fois les données récupérées
    this.items = [
      { title: "Demandes d'imputations ", count: this.statImpBul?.imputation, statut: 'enregistrées', path: '/carrieres/dash-inputation-bulletin/Imputation'},
      { title: 'Demandes de bulletin de visite', count: this.statImpBul?.bulletin, statut: 'enregistrées', path: '/carrieres/dash-inputation-bulletin/Bulletin'},
      { title: 'Demandes de prise en charge ', count: this.statPec?.allPec, statut: 'reçues', path: '/affaires-sociales/dash-demandes-recues' },
      { title: 'Demandes de prise en charge ', count: this.statPec?.validPec, statut: 'validées', path: '/affaires-sociales/dash-demandes-recues/VALIDEE'},
      { title: 'Demandes de prise en charge ', count: this.statPec?.rejectedPec, statut: 'rejetées', path: '/affaires-sociales/dash-demandes-recues/REJETEE'}
    ];
  
  //  console.log(this.items); // Pour vérifier le contenu du tableau
  }




  async statistiquesPec(profil: string) {
    this.spinner.show()
    return new Promise<void>((resolve, reject) => {
      this.pecService.statPec(profil)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.spinner.hide();
              this.statPec = data.payload;
             // console.log({ PEC: this.statPec });
              resolve(); // Résolution de la promesse une fois terminé
            }
          },
          error: (err) => reject(err)
        });
    });
  }
  
  async statistiquesImpBul(profil: string) {
    this.spinner.show()
    return new Promise<void>((resolve, reject) => {
      this.impBulService.indicateurImputationEtBulletin(profil)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.spinner.hide();  
              this.statImpBul = data.payload;
            //  console.log({ ImputationsBulletins: this.statImpBul });
              resolve(); // Résolution de la promesse une fois terminé
            }
          },
          error: (err) => reject(err)
        });
    });
  }

  navigateTo(path: string) {
       this.router.navigateByUrl(path)
  }
}

