import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListPermutationComponent } from './components/list-permutation/list-permutation.component';
import { SingleMutationComponent } from './components/single-mutation/single-mutation.component';
import { EditPermutationComponent } from './components/edit-permutation/edit-permutation.component';
import { ViewPermutationComponent } from './components/view-permutation/view-permutation.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Mes demandes de permutations recues'
    },
    children: [
      // Routing list 
      {
        path: '',
        component: ListPermutationComponent,
        data: {
          breadcrumb: ''
        },
      },
      {
        path: '',
        component: SingleMutationComponent,
        data: {
          breadcrumb: ''
        },
        children: [
          {
            path: ':dataId/traitement-demande-permutation',
            component: EditPermutationComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          },
          {
            path: ':dataId/detail-permutation',
            component: ViewPermutationComponent,
            data: {
              breadcrumb: 'Détails'
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
export class MesDemandesPermutationRecuesRoutingModule { }
