import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { AddDemandeComponent } from './components/add-demande/add-demande.component';
import { DetailDemandeComponent } from './components/detail-demande/detail-demande.component';
import { EditDemandeComponent } from './components/edit-demande/edit-demande.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Mes demandes'
    },
    children: [
      {
        path: '',
        component: ListDemandeComponent,

        data: {
          breadcrumb : ''
        }
      },
      {
        path: 'create-demande',
        component: AddDemandeComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: ':dataId/edit-demande',
        component: EditDemandeComponent,
        data: {
          breadcrumb: 'Formulaire de modification'
        },
      },
      {
        path: ':dataId/detail-view',
        component: DetailDemandeComponent,
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
export class MesDemandesRoutingModule { }
