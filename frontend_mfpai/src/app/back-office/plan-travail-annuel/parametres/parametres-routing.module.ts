import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListIndicateurComponent } from './components/list-indicateur/list-indicateur.component';
import { EditIndicateurComponent } from './components/edit-indicateur/edit-indicateur.component';
import { CreateIndicateurComponent } from './components/create-indicateur/create-indicateur.component';
import { ViewIndicateurComponent } from './components/view-indicateur/view-indicateur.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Paramètres'
    },
    children: [
      // Routing
      {
        path: '',
        component: ListIndicateurComponent,
        data: {

          breadcrumb: 'Liste des indicateurs'
        },
      },
      {
        path: 'create-indicateur',
        component: CreateIndicateurComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: 'edit-indicateur/:dataId',
        component: EditIndicateurComponent,
        data: {
          breadcrumb: 'Formulaire de modification'
        },
      },
      {
        path: 'detail-indicateur/:dataId',
        component: ViewIndicateurComponent,
        data: {
          breadcrumb: 'Détail indicateur'
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
export class ParametresRoutingModule { }
