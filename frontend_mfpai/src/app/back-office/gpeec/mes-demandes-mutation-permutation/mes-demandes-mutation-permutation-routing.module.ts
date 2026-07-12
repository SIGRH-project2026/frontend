import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListMutationPermutationComponent } from './components/list-mutation-permutation/list-mutation-permutation.component';
import { CreateMutationComponent } from './components/create-mutation/create-mutation.component';
import { CreatePermutationComponent } from './components/create-permutation/create-permutation.component';
import { SingleMutationComponent } from './components/single-mutation/single-mutation.component';
import { EditMutationComponent } from './components/edit-mutation/edit-mutation.component';
import { EditPermutationComponent } from './components/edit-permutation/edit-permutation.component';
import { ViewMutationComponent } from './components/view-mutation/view-mutation.component';
import { ViewPermutationComponent } from './components/view-permutation/view-permutation.component';
import { TraitementMutation } from '../demandes-mutation-permutation-recues/models/traitementMutation';
import { TraitementMutationComponent } from './components/traitement-mutation/traitement-mutation.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Mes demandes de mutation/permutation'
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
      // Routing creation
      {
        path: 'create-mutation',
        component: CreateMutationComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
       {
        path: 'create-permutation/:matricule2',
        component: CreatePermutationComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: '',
        component: SingleMutationComponent,
        data: {
          breadcrumb: 'Liste des demandes'
        },
        children: [
          // Routing edit 
          {
            path: ':dataId/edit-mutation',
            component: EditMutationComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          },
          {
            path: ':idPermutation/edit-permutation',
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
          },
          {
            path: ':dataId/traitement-demande-mutation',
            component: TraitementMutationComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
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
export class MesDemandesMutationPermutationRoutingModule { }
