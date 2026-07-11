import {Component, OnInit} from '@angular/core';
import {CredentialsService} from "../../../services/credentials.service";
import {CourrierService} from "../../../services/courrier.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";

@Component({
  selector: 'app-courrier-drh-daschboard',
  templateUrl: './courrier-drh-daschboard.component.html',
  styleUrls: ['./courrier-drh-daschboard.component.css']
})
export class CourrierDRHDaschboardComponent implements OnInit {
  items: any = [
  ];

  constructor(
      private credentialSercice: CredentialsService,
      private courrierService: CourrierService,
      private spinner: NgxSpinnerService,
      private router: Router
  ) {

  }

  nombreDeCourrierTraiterEtNomTraiter: any;

  getData(){
    this.spinner.show()
    this.courrierService.nombreDeCourrierTraiterEtNomTraiter().subscribe((res)=>{
      this.nombreDeCourrierTraiterEtNomTraiter = res.payload
      this.items.push(
          { title: 'Courriers ', count: this.nombreDeCourrierTraiterEtNomTraiter.nombreCourrierNonTraiter, statut: 'enregistrées', path: '/courriers', statutCode: 'NONTRAITER' },
          { title: 'Courriers ', count: this.nombreDeCourrierTraiterEtNomTraiter.nombreCourrierTraiter, statut: 'traitées', path: '/courriers', statutCode: 'TRAITER' },
      )
      this.spinner.hide()
    })


  }

  onItemClick(path: string, statut: string): void {
    switch(statut){
      case 'TRAITER':
        sessionStorage.setItem("statutCourrier",'TRAITER')
        break;
      case 'NONTRAITER':
        sessionStorage.setItem("statutCourrier",'NONTRAITER')
        break;
    }
    this.router.navigate([path]);
  }

  role: string | undefined;
  isCentralUser(){

    let roles = [
      'ADMIN-DRH',
      'Chef-division-dfc',
      'Chef-division-das',
      'Directeur-DRH',
      'Chef-service',
      'Chef-division-dgcaa',
      'Chef-division-dgpeec',
    ]
    return roles.includes(this.role || '');

  }
  getBackgroundColor(title: string): string {
    if (title.toLowerCase().includes('courriers')) {
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

  ngOnInit(): void {
    this.role = this.credentialSercice.getUserInfos()?.profil[0].code
    this.getData()

  }
}
