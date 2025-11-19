import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { TableauSuiviComponent } from './components/tableau-suivi/tableau-suivi.component';
import { ViewDetailComponent } from './components/view-detail/view-detail.component';
import { CreateTableauSuiviComponent } from './components/create-tableau-suivi/create-tableau-suivi.component';
import { SingleViewComponent } from './components/single-view/single-view.component';

const routes: Routes = [
  {
    path: ':dataId',
    component: SingleViewComponent,
    data: {
      breadcrumb: 'Tableau suivi des formations'
    },
    children: [
      {
        path: '',
        component: TableauSuiviComponent,
        data: {
          breadcrumb: ''
        },
      },
      {
        path: 'create-tableau-suivi',
        component: CreateTableauSuiviComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: ':dataId/detail-view',
        component: ViewDetailComponent,
        data: {
          breadcrumb: 'Détail'
        },
      },
      { path: '', redirectTo: ':dataId', pathMatch: 'full' },
    ]
  },

  

  // {
  //   path: '',
  //   component: MainComponent,
  //   data: {
  //     breadcrumb: 'Tableau suivi des formations'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       component: TableauSuiviComponent,
  //       data: {
  //         breadcrumb: ''
  //       },
  //     },
  //     {
  //       path: 'create-tableau-suivi',
  //       component: CreateTableauSuiviComponent,
  //       data: {
  //         breadcrumb: 'Formulaire de création'
  //       },
  //     },
  //     {
  //       path: ':dataId/detail-view',
  //       component: ViewDetailComponent,
  //       data: {
  //         breadcrumb: 'Détail'
  //       },
  //     },
  //     { path: '', redirectTo: '', pathMatch: 'full' },
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableauSuiviRoutingModule { }
