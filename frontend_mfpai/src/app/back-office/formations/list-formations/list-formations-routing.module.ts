import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListFormationComponent } from './components/list-formation/list-formation.component';
import { DetailViewFormationComponent } from './components/detail-view-formation/detail-view-formation.component';
import { CompleteFormationComponent } from './components/complete-formation/complete-formation.component';
import { EditFormationComponent } from './components/edit-formation/edit-formation.component';
import { EnvoyerFicheComponent } from './components/envoyer-fiche/envoyer-fiche.component';
import { EnvoyerOffresTechniquesComponent } from './components/envoyer-offres-techniques/envoyer-offres-techniques.component';
import { OffresComponent } from './components/offres/offres.component';
import { CreateFormationDiplomanteComponent } from './components/create-formation-diplomante/create-formation-diplomante.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Liste des formations'
    },
    children: [
      // Routing list mes formations
      {
        path: '',
        component: ListFormationComponent,
        data: {
          breadcrumb: ''
        },
      },
      {
        path: ':dataId/detail-view',
        component: DetailViewFormationComponent,
        data: {
          breadcrumb: 'Détail formation'
        },
      },
      {
        path: ':dataId/complete-formation',
        component: CompleteFormationComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: ':dataId/edit-formation',
        component: EditFormationComponent,
        data: {
          breadcrumb: 'Formulaire de modification'
        },
      },
      {
        path: 'create-formation-diplomante',
        component: CreateFormationDiplomanteComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: ':dataId/envoyer-fiche-canditature',
        component: EnvoyerFicheComponent,
        data: {
          breadcrumb: 'Formulaire de traitement'
        },
      },
      {
        path: ':dataId/envoyer-offres-techniques',
        component: EnvoyerOffresTechniquesComponent,
        data: {
          breadcrumb: 'Formulaire de traitement'
        },
      },
      {
        path: ':dataId/offres',
        component: OffresComponent,
        data: {
          breadcrumb: 'Formulaire de traitement'
        },
      },

      {
        path: ':dataId/demandes-de-formation',
        loadChildren: () => import('../demandes-formation/demandes-formation.module').then(mod => mod.DemandesFormationModule)
      },
      {
        path: 'tableau-suivi-formations',
        loadChildren: () => import('../tableau-suivi/tableau-suivi.module').then(mod => mod.TableauSuiviModule)
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFormationsRoutingModule { }
