import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDesBesoinsRecusComponent } from './components/liste-des-besoins-recus/liste-des-besoins-recus.component';
import { DetailDemandeEnPersonnelRecusComponent } from './components/detail-demande-en-personnel-recus/detail-demande-en-personnel-recus.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Expressions de besoins en personnel reçus'
    },
    children : [
      {
        path: '',
        component : ListeDesBesoinsRecusComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [ 'ADMIN-DRH', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General'],
          breadcrumb : ''
        }
      },
      {

        path: ':Id/details-besoins-recus',
        component: DetailDemandeEnPersonnelRecusComponent,
        data: {
          breadcrumb: 'Détails  '
        },
      
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BesoinPersonnelRecusRoutingModule { }
