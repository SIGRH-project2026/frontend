import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDivisionBureauxComponent } from './components/liste-division-bureaux/liste-division-bureaux.component';
import { AddDivisionBureauxComponent } from './components/add-division-bureaux/add-division-bureaux.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Divisions / Bureaux'
    },
    children: [
      {
        path: '',
        component: ListeDivisionBureauxComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [ 'Chef-etablissement', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General'],
          breadcrumb : ''
        }
      },
      {
        path: 'add-division-bureaux',
        component: AddDivisionBureauxComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [ 'Chef-etablissement', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General'],
          breadcrumb: 'Formulaire de création'
        }
      },
   
  
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionBureauxRoutingModule { }
