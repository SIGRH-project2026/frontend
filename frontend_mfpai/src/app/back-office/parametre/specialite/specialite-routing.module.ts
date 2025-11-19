import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeSpecialiteComponent } from './components/liste-specialite/liste-specialite.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Spécialité'
    },
    children: [
      {
        path: '',
        component: ListeSpecialiteComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [ 'Chef-etablissement', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General'],
          breadcrumb : ''
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
export class SpecialiteRoutingModule { }
