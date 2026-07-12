import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListDossierAgentComponent } from './components/list-dossier-agent/list-dossier-agent.component';
import { AddDossierAgentComponent } from './components/add-dossier-agent/add-dossier-agent.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Dossiers agents'
    },
    children : [
      {
        path: '',
        component : ListDossierAgentComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [
              'Chef-division-dgcaa',
              'Chef-bureau-dgcaa',
              'ADMIN-DRH',
              'Directeur-DRH',
              'Assistant-DRH'],
          breadcrumb: 'Liste des dossiers'
        }
      },
      {
        path: 'create-dossier-agent/:matricule',
        component : AddDossierAgentComponent,
        data: {
          breadcrumb : 'Formulaire de création'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DossierAgentRoutingModule { }
