import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListPtaComponent } from './components/list-pta/list-pta.component';
import { CreatePtaComponent } from './components/create-pta/create-pta.component';
import { EditPtaComponent } from './components/edit-pta/edit-pta.component';
import { ViewPtaComponent } from './components/view-pta/view-pta.component';
import { ListSousActionsComponent } from './components/list-sous-actions/list-sous-actions.component';
import { SinglePtaComponent } from './components/single-pta/single-pta.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Plan Travail Annuel'
    },
    children: [
      {
        path: '',
        component: ListPtaComponent,
        data: {
          breadcrumb: 'Liste des PTA'
        },
      },
      {
        path: 'create-pta/:dataId',
        component: SinglePtaComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
        children: [
          {
            path: '',
            component: CreatePtaComponent,
            data: {
              breadcrumb: ''
            },
          },
          {
            path: 'sous-action/:dataId',
            component: ListSousActionsComponent,
            data: {
              breadcrumb: 'Sous Action'
            },
          }
        ]
      },
      {
        path: 'edit-pta/:dataId',
        component: SinglePtaComponent,
        data: {
          breadcrumb: 'Formulaire de modification'
        },
        children: [
          {
            path: '',
            component: EditPtaComponent,
            data: {
              breadcrumb: ''
            },
          },
          {
            path: 'sous-action/:dataId',
            component: ListSousActionsComponent,
            data: {
              breadcrumb: 'Sous Action'
            },
          }
        ]
      },
      {
        path: 'view-pta/:dataId',
        component: SinglePtaComponent,
        data: {
          breadcrumb: 'Détail Plan Travail'
        },
        children: [
          {
            path: '',
            component: ViewPtaComponent,
            data: {
              breadcrumb: ''
            },
          },
          {
            path: 'sous-action/:dataId',
            component: ListSousActionsComponent,
            data: {
              breadcrumb: 'Sous Action'
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
export class PtaRoutingModule { }
