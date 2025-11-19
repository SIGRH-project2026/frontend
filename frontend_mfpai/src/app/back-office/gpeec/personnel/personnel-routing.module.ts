import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListPersonnelComponent } from './components/list-personnel/list-personnel.component';
import { ViewPersonnelComponent } from './components/view-personnel/view-personnel.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Personnel'
    },
    children: [
      {
        path: '',
        component: ListPersonnelComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: ':userId/detail-utilisateur',
        component: ViewPersonnelComponent,
        data: {
          breadcrumb: 'Détails Utilisateur'
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
export class PersonnelRoutingModule { }
