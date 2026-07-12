import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListMutationPermutationComponent } from './components/list-mutation-permutation/list-mutation-permutation.component';
import { SingleMutationComponent } from './components/single-mutation/single-mutation.component';
import { EditMutationComponent } from './components/edit-mutation/edit-mutation.component';
import { EditPermutationComponent } from './components/edit-permutation/edit-permutation.component';
import { ViewMutationComponent } from './components/view-mutation/view-mutation.component';
import { ViewPermutationComponent } from './components/view-permutation/view-permutation.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Traitement demande de mutation/permutation'
    },
    children: [
      // Routing list 
      {
        path: '',
        component: ListMutationPermutationComponent,
        data: {
          breadcrumb: 'Liste des demandes'
        },
      },
      {
        path: '',
        component: SingleMutationComponent,
        data: {
          breadcrumb: 'Liste des demandes'
        },
        children: [
          // Routing  
          {
            path: ':dataId/traitement-demande-mutation',
            component: EditMutationComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          },
          {
            path: ':dataId/traitement-demande-permutation',
            component: EditPermutationComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          },
          {
            path: ':dataId/detail-mutation',
            component: ViewMutationComponent,
            data: {
              breadcrumb: 'Détails'
            },
          },
          {
            path: ':idPermutation/detail-permutation',
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
export class DemandesMutationPermutationRecuesRoutingModule { }
