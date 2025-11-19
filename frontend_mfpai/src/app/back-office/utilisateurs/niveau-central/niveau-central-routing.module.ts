import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListUtilisateurComponent } from './components/list-utilisateur/list-utilisateur.component';
import { CreateUtilisateurComponent } from './components/create-utilisateur/create-utilisateur.component';
import { SingleUtilisateurComponent } from './components/single-utilisateur/single-utilisateur.component';
import { EditUtilisateurComponent } from './components/edit-utilisateur/edit-utilisateur.component';
import { ViewUtilisateurComponent } from './components/view-utilisateur/view-utilisateur.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Niveau Central'
    },
    children: [
      // Routing list utilisateurs
      {
        path: '',
        component: ListUtilisateurComponent,
        data: {
          breadcrumb: ''
        },
      },
      // Routing creation utilisateur
      {
        path: 'create-utilisateur',
        component: CreateUtilisateurComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: '',
        component: SingleUtilisateurComponent,
        data: {
          breadcrumb: ''
        },
        children: [
          // Routing edit utilisateur
          {
            path: ':userId/edit-utilisateur',
            component: EditUtilisateurComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          },
          {
            path: ':userId/detail-utilisateur',
            component: ViewUtilisateurComponent,
            data: {
              breadcrumb: 'Détails Utilisateur'
            },
          }
        ]
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NiveauCentralRoutingModule { }
