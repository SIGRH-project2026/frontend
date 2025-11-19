import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListDemandeRecueComponent } from './components/list-demande-recue/list-demande-recue.component';
import { TraitementDemandeRecueComponent } from './components/traitement-demande-recue/traitement-demande-recue.component';
import { DetailDemandeRecueComponent } from './components/detail-demande-recue/detail-demande-recue.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Mes demandes reçues'
    },
    children: [
      {
        path: '',
        component: ListDemandeRecueComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [
                  'Chef-division-dfc',
                  'Chef-division-das',
                  'Directeur-DRH',
                  'Chef-service',
                  'Chef-etablissement',
                  'Representant-IA',
                  'Représentant-IEF',
                  'Chef-division-dgcaa',
                  'Chef-division-dgpeec',
                  'Directeur-CFP',
                  'Directeur-EFF',
          ],
          breadcrumb : ''
        }
      },
      {
        path: ':dataId/traitement-demande',
        component: TraitementDemandeRecueComponent,
        data: {
          breadcrumb: 'Formulaire de traitement'
        },
      },
      {
        path: ':dataId/detail-view',
        component: DetailDemandeRecueComponent,
        data: {
          breadcrumb: 'Détail demande'
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
export class DemandesRecuesRoutingModule { }
