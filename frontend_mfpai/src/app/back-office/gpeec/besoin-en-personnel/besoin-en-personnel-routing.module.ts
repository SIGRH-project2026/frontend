import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListExpressionComponent } from './components/list-expression/list-expression.component';
import { CreateExpressionComponent } from './components/create-expression/create-expression.component';
import { SingleExpressionComponent } from './components/single-expression/single-expression.component';
import { EditExpressionComponent } from './components/edit-expression/edit-expression.component';
import { ViewExpressionComponent } from './components/view-expression/view-expression.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Expressions de besoins en personnel'
    },
    children: [
      // Routing list expression
      {
        path: '',
        component: ListExpressionComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [ 'ADMIN-DRH', 'Chef-etablissement', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General','Représentant-IEF','Representant-IA'],
          breadcrumb : ''
        }
      },
      // Routing creation expression
      {
        path: 'create-expression',
        component: CreateExpressionComponent,

        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: '',
        component: SingleExpressionComponent,
        data: {
          breadcrumb: ''
        },
        children: [
          // Routing edit expression
          {
            path: ':dataId/edit-expression',
            component: EditExpressionComponent,
            data: {
              breadcrumb: 'Formulaire de modification'
            },
          },
          {
            path: ':dataId/detail-expression',
            component: ViewExpressionComponent,
            data: {
              breadcrumb: 'Détails Expression'
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
export class BesoinEnPersonnelRoutingModule { }
