import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListFicheComponent } from './components/list-fiche/list-fiche.component';
import { AddFicheComponent } from './components/add-fiche/add-fiche.component';
import { AddFiliereComponent } from './components/add-filiere/add-filiere.component';
import { AddClasseComponent } from './components/add-classe/add-classe.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Fiche établissement'
    },
    children: [
      // Routing list des fiches établissements
      {
        path: '',
        component: ListFicheComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [
            'Chef-etablissement',
          ],
          breadcrumb : ''
        }
      },
      // Routing Nouvelle fiche établissement
      {
        path: 'create-fiche',
        component: AddFicheComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: 'add-filiere/:idFiche/:typeFormation',
        component: AddFiliereComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: 'add-classe/:idFiche/:codeEtab/:typeFormation',
        component: AddClasseComponent,
        data: {
          breadcrumb: 'Formulaire de création'
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
export class FicheEtablissementRoutingModule { }
