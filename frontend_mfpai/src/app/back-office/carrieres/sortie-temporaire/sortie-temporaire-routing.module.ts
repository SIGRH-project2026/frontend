import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDesAgentComponent } from './components/liste-des-agent/liste-des-agent.component';
import { ListDossierAgentComponent } from '../dossier-agent/components/list-dossier-agent/list-dossier-agent.component';
import { DetailsAgentComponent } from './components/details-agent/details-agent.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Sortie temporaire'
    },
    children : [
      {
        path: '',
        component :ListeDesAgentComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [ 'Chef-division-dgcaa', 'ADMIN-DRH', 'Directeur-DRH', 'Admin-General'],
          breadcrumb : ''
        }
      },
      {

        path: ':id/details-agent',
        component: DetailsAgentComponent,
        data: {
          breadcrumb: 'Details Agent'
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
export class SortieTemporaireRoutingModule { }
