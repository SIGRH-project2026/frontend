import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDesImputationsBulletinComponent } from './components/liste-des-imputations-bulletin/liste-des-imputations-bulletin.component';
import { DetailsImputationBulletinComponent } from './components/details-imputation-bulletin/details-imputation-bulletin.component';
import { AddImputationBulletinComponent } from './components/add-imputation-bulletin/add-imputation-bulletin.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Imputation/Bulletin de visite '
    },
    children : [
      {
        path: '',
        component : ListeDesImputationsBulletinComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [

            'ADMIN-DRH',
            'Chef-division-das',
            'Directeur-DRH',
            'Representant-IA',
            'Représentant-IEF',
            'Agent-bureau-das',
            'Chef-bureau-das',
             //Rajoutons ceci
            'Chef-division-dfc',
            //'Chef-division-das',
            //'Directeur-DRH',
            'Chef-service',
            'Chef-etablissement',
            //'Representant-IA',
            //'Représentant-IEF',
            'Chef-division-dgcaa',
            'Chef-division-dgpeec',
            'Directeur-CFP',
            'Directeur-EFF',

           ],
          breadcrumb : ''
        }
      },
      {

        path: 'details-imputation-bulletin/:id',
        component: DetailsImputationBulletinComponent ,
        data: {
          role: [

            'ADMIN-DRH',
            'Chef-division-das',
            'Directeur-DRH',
            'Representant-IA',
            'Représentant-IEF',
            'Agent-bureau-das',
            'Chef-bureau-das',

    ],
          breadcrumb: 'Détails Agent'
        },
      
      },
      {
        path: 'add-imputation-bulletion/:matricule',
        component : AddImputationBulletinComponent,
        data: {
          role: [

            'ADMIN-DRH',
            'Chef-division-das',
            'Directeur-DRH',
            'Representant-IA',
            'Représentant-IEF',
            'Agent-bureau-das',
            'Chef-bureau-das',



           ],
          breadcrumb : 'Formulaire de création'
        }
      },
      
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputationBulletinDeVisiteRoutingModule { }
