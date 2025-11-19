import { Component, OnInit } from '@angular/core';
import { MutationService } from '../../gpeec/demandes-mutation-permutation-recues/services/mutation.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { CredentialsService } from 'src/app/services/credentials.service';
import { IndicateurMutation } from '../models/IndicateurMutation';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { BesoinEnPersonnelService } from '../../gpeec/besoin-en-personnel/services/besoin-en-personnel.service';
import { ReferencesService } from 'src/app/services/references.service';
import { IndicateurIaIefEtab } from '../models/IndicateurIaIefEtab';
import { PermutationService } from '../../gpeec/mes-demandes-mutation-permutation/service/permutation.service';

@Component({
  selector: 'app-dgpeec-dashboard',
  templateUrl: './dgpeec-dashboard.component.html',
  styleUrls: ['./dgpeec-dashboard.component.css']
})
export class DGPEECDASHBOARDComponent implements OnInit{
  profileCode: any;
  userInfos: any;
  profilConnecte: any;
  indicateurMut !: IndicateurMutation;
  indicateurIaIefEta !: IndicateurIaIefEtab
  constructor(
    private readonly mutationService : MutationService,
    private readonly _credentialService: CredentialsService,
    private readonly spinner: NgxSpinnerService,
    private readonly router : Router, 
    private readonly besoinEnPersonService : BesoinEnPersonnelService,
    private readonly referenceService : ReferencesService,
    private readonly permutationService : PermutationService

  ){
    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profileCode = this.profilConnecte[0].code
  }
  ngOnInit(): void {
    this.indicateurMutation()
    this.indicateurBEP()
    this.indicateurIaIefEtab()
    this.indicateurPermutation()
  }


  items = [
    { title: "IA", count: 0, statut: 'Total', path: '/parametrage/ia', role :['Chef-division-dgpeec','Directeur-DRH'] },
    { title: "IEF", count: 0, statut: 'Total', path: '/parametrage/ief', role :['Chef-division-dgpeec','Directeur-DRH', 'Representant-IA'] },
    { title: "Établissement", count: 0, statut: 'Total', path: '/parametrage/etablissement', role :['Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
    { title: 'Demandes de besoins en personnel', count: 0, statut: ' besoins en personnel', path: '/gpeec/besoin-en-personnel-recues', role :['Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
    { title: 'Mutations ', count: 0, statut: 'Total', path: '/gpeec/dashboard-mutation-recues/all', role :['Chef-etablissement','Chef-EFF','Chef-cfp','Chef-service','Chef-division','Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
    { title: 'Mutations ', count: 0, statut: 'validées', path: '/gpeec/dashboard-mutation-recues/VALIDER', role :['Chef-etablissement','Chef-EFF','Chef-cfp','Chef-service','Chef-division','Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
    { title: 'Mutations ', count: 0, statut: 'non accordées', path: '/gpeec/dashboard-mutation-recues/REJETER', role :['Chef-etablissement','Chef-EFF','Chef-cfp','Chef-service','Chef-division','Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
    { title: 'Mutations ', count: 0, statut: 'En cours', path: '/gpeec/dashboard-mutation-recues/inProgress', role :['Chef-etablissement','Chef-EFF','Chef-cfp','Chef-service','Chef-division','Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
    { title: 'Permutations', count: 0, statut: 'Total', path: '/gpeec/dashboard-permutation-recues/all', role :['Chef-etablissement','Chef-EFF','Chef-cfp','Chef-service','Chef-division','Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF']},
    { title: 'Permutations', count: 0, statut: 'validées', path: '/gpeec/dashboard-permutation-recues/VALIDER', role :['Chef-etablissement','Chef-EFF','Chef-cfp','Chef-service','Chef-division','Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
    { title: 'Permutations', count: 0, statut: 'non accordées', path: '/gpeec/dashboard-permutation-recues/REJETER', role :['Chef-etablissement','Chef-EFF','Chef-cfp','Chef-service','Chef-division','Chef-division-dgpeec','Directeur-DRH','Representant-IA','Représentant-IEF'] },
   

  ];

  getBackgroundColor(title: string): string {
    if (title.toLowerCase().includes('mutations ')) {
      return 'background-pink';
    } else if (title.toLowerCase().includes('permutations')) {
      return 'background-gray';
    } else if (title.toLowerCase().includes('demandes')) {
      return 'background-green';
    }
    return 'background-green';
  }

  getIconColor(title: string): string {
    if (title.toLowerCase().includes('Actes')) {
      return 'rose';
    } else if (title.toLowerCase().includes('agents')) {
      return 'gray';
    } else if (title.toLowerCase().includes('demandes')) {
      return 'green';
    }
    return 'black';
  }

  indicateurMutation(){
    this.spinner.show()
    this.mutationService.indicateurMutation(this.profileCode)
        .subscribe({
          next : (data : ResponseApi2) => {
              if(data.status?.includes("OK")){
                this.spinner.hide()
                this.indicateurMut = data.payload
                this.items[4].count = this.indicateurMut.all
                this.items[5].count = this.indicateurMut.validated
                this.items[6].count = this.indicateurMut.rejected
                this.items[7].count = this.indicateurMut.inProgress
              }
          }
        })
  }
  indicateurBEP(){
    this.spinner.show()
    this.besoinEnPersonService.indicateur(this.profileCode)
        .subscribe({
          next : (data : ResponseApi2) => {
              if(data.status?.includes("OK")){
                this.spinner.hide()
                this.items[3].count = data.payload
                this.indicateurMut = data.payload
                
              }
          }
        })
  }

  indicateurIaIefEtab(){
    this.spinner.show()
    this.referenceService.indicateurIaIefEtab(this.profileCode)
        .subscribe({
          next : (data : ResponseApi2) => {
              if(data.status?.includes("OK")){
                this.spinner.hide()
                this.indicateurIaIefEta = data.payload
                this.items[0].count = this.indicateurIaIefEta.indIa
                this.items[1].count = this.indicateurIaIefEta.indIef
                this.items[2].count = this.indicateurIaIefEta.indEtab
              }
          }
        })
  }
  
  indicateurPermutation(){
    this.spinner.show()
    this.permutationService.indicateurPermutation(this.profileCode)
        .subscribe({
          next : (data : ResponseApi2) => {
              if(data.status?.includes("OK")){
                this.spinner.hide()
                this.indicateurMut = data.payload
                this.items[8].count = this.indicateurMut.all
                this.items[9].count = this.indicateurMut.validated
                this.items[10].count = this.indicateurMut.rejected
              }
          }
        })
  }
  goToList(item : any){
    this.router.navigateByUrl(item.path)

  }
  viewBox(item : any) : boolean{
    if((this.profileCode.includes("Chef-service") || this.profileCode.includes("Chef-division")) && this.profileCode !== 'Chef-division-dgpeec')
      if(this.profileCode.includes("Chef-service") )
        this.profileCode = "Chef-service"
      else this.profileCode = "Chef-division"

    let prof = item.role.find((pro : any) =>((pro === this.profileCode)))
    if(prof)
      return true
    return false
  }
}
