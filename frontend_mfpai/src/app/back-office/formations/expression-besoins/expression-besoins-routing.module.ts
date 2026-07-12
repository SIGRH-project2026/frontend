import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListCampagneComponent } from './components/list-campagne/list-campagne.component';
import { SingleCampagneComponent } from './components/single-campagne/single-campagne.component';
import { SoumettreExpressionComponent } from './components/soumettre-expression/soumettre-expression.component';
import { SingleExpressionComponent } from './components/single-expression/single-expression.component';
import { ViewCampagneComponent } from './components/view-campagne/view-campagne.component';
import { ViewExpressionComponent } from './components/view-expression/view-expression.component';
import { TraiterExpressionComponent } from './components/traiter-expression/traiter-expression.component';
import { EditExpressionComponent } from './components/edit-expression/edit-expression.component';
import {IsTraitementExpressionDeBesoinGuard} from "../../../guard/traitement-expression-de-besoin.guard";
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Expression des besoins'
    },
    children: [
      // Routing list campagnes
      {
        path: '',
        component: ListCampagneComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [
            'Chef-division-dfc',
              'Chef-division-dgcaa',
            'Chef-division-dgpeec',
            'Chef-division-das',
            'ADMIN-DRH',
            'Directeur-DRH'],
          breadcrumb: 'Liste des campagnes',

        },
      },
      {
        path: '',
        component: SingleCampagneComponent,
        data: {
          breadcrumb: 'Liste des campagnes'
        },
        children: [
          // Routing soumettre expression de besoins
          {
            path: 'soumettre-expression/:campagneId',
            component: SoumettreExpressionComponent,
            data: {
              breadcrumb: 'Formulaire de création'
            },

          },
          // Routing detail expression de besoins
          {
            path: 'traitement-expression/:campagneId',
            component: SingleExpressionComponent,
            // guard pour traitement expression de besoin
            canActivate: [IsTraitementExpressionDeBesoinGuard],
            data: {
              breadcrumb: 'Traitement des expression des besoins'
            },

            children: [
              // Liste des expressions de besoins
              {
                path: '',
                component: TraiterExpressionComponent,
                data: {
                  breadcrumb: ''
                },
              },
              // Detail d'une expression de besoins
              {
                path: 'edit-expression/:themeId',
                component: EditExpressionComponent,
                data: {
                  breadcrumb: 'Traitement d\'une expression des besoins'
                },
              },
              // Detail d'une expression de besoins
              {
                path: ':themeId/detail-theme-formation',
                component: ViewExpressionComponent,
                data: {
                  breadcrumb: 'Détails expression de besoins'
                },
              },
            ]
          },
           // Routing detail expression de besoins
          {
            path: 'detail-expression/:campagneId',
            component: SingleExpressionComponent,
            data: {
              breadcrumb: 'Détails campagne'
            },
            children: [
              // Liste des expressions de besoins
              {
                path: '',
                component: ViewCampagneComponent,
                data: {
                  breadcrumb: ''
                },
              },
              // Detail d'une expression de besoins
              {
                path: 'detail-theme-formation/:themeId',
                component: ViewExpressionComponent,
                data: {
                  breadcrumb: 'Détails expression de besoins'
                },
              },
            ]
          },
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
export class ExpressionBesoinsRoutingModule { }
