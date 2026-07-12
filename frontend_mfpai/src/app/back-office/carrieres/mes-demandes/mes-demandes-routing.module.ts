import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDemandesComponent } from './components/liste-demandes/liste-demandes.component';
import { AddActeComponent } from './components/add-acte/add-acte.component';
import { SingleActeComponent } from './components/single-acte/single-acte.component';
import { ViewActeComponent } from './components/view-acte/view-acte.component';
import { EditActeComponent } from './components/edit-acte/edit-acte.component';

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Mes demandes'
    },
    children : [
      {
        path: '',
        component : ListeDemandesComponent,
        data: {
          breadcrumb: 'Liste des demandes'
        }
      },
      {
        path: 'ajout-acte',
        component : AddActeComponent,
        data: {
          breadcrumb : 'Formulaire de création'
        }
      },
       {
        path: '',
        component: SingleActeComponent,
        data: {
          breadcrumb: 'Liste des demandes'
        },
      /*   path: ':dataId',
        component: SingleActeComponent,
        data: {
          breadcrumb: ''
        }, */
        children: [
          // Routing edit utilisateur
          {
            path: ':dataId/detail-acte',
            component: ViewActeComponent,
            data: {
              breadcrumb: 'Détails Acte'
            },
          },
           {
            path: ':dataId/edit-acte',
            component: EditActeComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          }
        ]
      },
  
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesDemandesRoutingModule { }
