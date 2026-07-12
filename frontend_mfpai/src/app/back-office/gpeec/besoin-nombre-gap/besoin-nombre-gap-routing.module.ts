import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeBesoinEnNbrGapComponent } from './components/liste-besoin-en-nbr-gap/liste-besoin-en-nbr-gap.component';
import { DetailGapComponent } from './components/detail-gap/detail-gap.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Besoin en nombre gap'
    },
    children : [
      {
        path: '',
        component : ListeBesoinEnNbrGapComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [ 'ADMIN-DRH', 'Chef-etablissement', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General','Representant-IA'],
          breadcrumb: 'Liste des besoins'
        }
      },
      {

        path: ':Id/details-gap',
        component: DetailGapComponent,
        data: {
          breadcrumb: 'Détails GAP'
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
export class BesoinNombreGapRoutingModule { }
