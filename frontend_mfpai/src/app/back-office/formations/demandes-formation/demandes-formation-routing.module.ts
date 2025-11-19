import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { DetailViewDemandeComponent } from './components/detail-view-demande/detail-view-demande.component';
import { JoindreDossierComponent } from './components/joindre-dossier/joindre-dossier.component';
import { SingleViewComponent } from './components/single-view/single-view.component';

const routes: Routes = [
  {
    path: '',
    component: SingleViewComponent,
    data: {
      breadcrumb: 'Demandes de formation'
    },
    children: [
      {
        path: '',
        component: ListDemandeComponent,
        data: {
          breadcrumb: ''
        },
      },
      {
        path: ':dataId/detail-view',
        component: DetailViewDemandeComponent,
        data: {
          breadcrumb: 'Détail participant'
        },
      },
      {
        path: ':dataId/joindre-dossier',
        component: JoindreDossierComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }, 
  // {
  //   path: '',
  //   component: MainComponent,
  //   data: {
  //     breadcrumb: 'Demandes de formation'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       component: ListDemandeComponent,
  //       data: {
  //         breadcrumb: ''
  //       },
  //     },
  //     {
  //       path: ':dataId/detail-view',
  //       component: DetailViewDemandeComponent,
  //       data: {
  //         breadcrumb: 'Détail participant'
  //       },
  //     },
  //     {
  //       path: ':dataId/joindre-dossier',
  //       component: JoindreDossierComponent,
  //       data: {
  //         breadcrumb: 'Formulaire de création'
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
export class DemandesFormationRoutingModule { }
