import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListCorpsGradeComponent } from './components/list-corps-grade/list-corps-grade.component';
import { AddCorpsGradeComponent } from './components/add-corps-grade/add-corps-grade.component';
import { EditCorpsGradeComponent } from './components/edit-corps-grade/edit-corps-grade.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Paramétrage'
    },
    children: [
      {
        path: '',
        component: ListCorpsGradeComponent,
        data: {
          breadcrumb: 'Liste des corps et grades'
        },
      },
      {
        path: 'create-corps-grade',
        component: AddCorpsGradeComponent,
        data: {
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: ':dataId/edit-corps-grade',
        component: EditCorpsGradeComponent,
        data: {
          breadcrumb: 'Formulaire de modification'
        },
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorpsGradeRoutingModule { }
