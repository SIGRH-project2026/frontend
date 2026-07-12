import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListAgentComponent } from './components/list-agent/list-agent.component';
import { DetailsAgentComponent } from './components/details-agent/details-agent.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Sortie définitive'
    },
    children : [
      {
        path: '',
        component : ListAgentComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [
            'Chef-division-dgcaa',
            'ADMIN-DRH',
            'Directeur-DRH',
            'Admin-General',
            'Directeur-DRH'],
          breadcrumb: 'Liste des agents'
        }
      },
      {

        path: ':id/details-agent',
        component: DetailsAgentComponent,
        data: {
          breadcrumb: 'Détails Agent'
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
export class SortieDefinitiveRoutingModule { }
