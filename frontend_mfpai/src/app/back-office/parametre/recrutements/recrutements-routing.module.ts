import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeRecrutementComponent } from './components/liste-recrutement/liste-recrutement.component';
import { AddRecrutementComponent } from './components/add-recrutement/add-recrutement.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Recrutement'
    },
    children: [
      {
        path: '',
        component: ListeRecrutementComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [ 'Chef-etablissement', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General'],
          breadcrumb: 'Liste des recrutements'
        }
      },
      {
        path: 'add-recrutement',
        component: AddRecrutementComponent,
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
export class RecrutementsRoutingModule { }
