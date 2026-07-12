import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePlanFormationComponent } from './components/create-plan-formation/create-plan-formation.component';
import { CreateThemeFormationComponent } from './components/create-theme-formation/create-theme-formation.component';
import { EditPlanFormationComponent } from './components/edit-plan-formation/edit-plan-formation.component';
import { ListPlanFormationComponent } from './components/list-plan-formation/list-plan-formation.component';
import { ViewPlanFormationComponent } from './components/view-plan-formation/view-plan-formation.component';
import { ViewThemeFormationComponent } from './components/view-theme-formation/view-theme-formation.component';
import { SinglePlanFormationComponent } from './components/single-plan-formation/single-plan-formation.component';
import { SingleThemeFormationComponent } from './components/single-theme-formation/single-theme-formation.component';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { CreateFormationComponent } from './components/create-formation/create-formation.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Plan de formation'
    },
    children: [
      // Routing list plan de formation
      {
        path: '',
        component: ListPlanFormationComponent,
        data: {
          breadcrumb: 'Liste des plans de formation'
        },
      },
      // Routing creation plan de formation
      {
        path: 'create-plan-formation',
        component: CreatePlanFormationComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: ':planId',
        component: SinglePlanFormationComponent,
        data: {
          breadcrumb: ''
        },
        children: [
          // Routing edit plan de formation
          {
            path: 'edit-plan-formation',
            component: EditPlanFormationComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          },
          // Routing create theme de formation
          {
            path: 'create-theme-formation',
            component: CreateThemeFormationComponent,
            data: {
              breadcrumb: 'Formulaire de création'
            },
          },
          // Routing detail plan de formation
          {
            path: 'detail-plan-formation',
            component: SingleThemeFormationComponent,
            data: {
              breadcrumb: 'Détails plan de formation'
            },
            children: [
              // Liste des themes de formation
              {
                path: '',
                component: ViewPlanFormationComponent,
                data: {
                  breadcrumb: ''
                },
              },
              // Detail d'un theme de formation
              {
                path: ':themeId/detail-theme-formation',
                component: ViewThemeFormationComponent,
                data: {
                  breadcrumb: 'Détails thème de formation'
                },
              },
              // Créer une formation
              {
                path: ':themeId/create-formation',
                component: CreateFormationComponent,
                data: {
                  breadcrumb: 'Formulaire de création'
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
export class PlanFormationRoutingModule { }
