import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDemandesRecusComponent } from './liste-demandes-recus/liste-demandes-recus.component';
import { ViewDemandeRecusComponent } from './view-demande-recus/view-demande-recus.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Demandes reçues'
    },
    children : [
      {
        path: '',
        component : ListeDemandesRecusComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [ 'Chef-division-dgcaa', 'ADMIN-DRH', 'Directeur-DRH','Chef-division-dfc','Chef-division-dgpeec' ,'Chef-division-das','Chef-service','Chef-etablissement','Chef-cfp','Chef-EFF','Representant-IA','Représentant-IEF'],
          breadcrumb : ''
        }
      },
      {
        path: ':demandeId/details',
        component : ViewDemandeRecusComponent,
        data: {
          breadcrumb : 'Détails de la demande'
        }
      },
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandeRecusRoutingModule { }
