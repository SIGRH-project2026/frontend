import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDirectionsComponent } from './components/liste-directions/liste-directions.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Diréction'
    },
    children: [
      // Routing list expression
      {
        path: '',
        component: ListeDirectionsComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [ 'Chef-etablissement', 'Chef-division-dgpeec', 'Directeur-DRH', 'Admin-General'],
          breadcrumb : ''
        }
      },
   
      // Routing creation expression
  
      { path: '', redirectTo: 'actulite', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectionsRoutingModule { }
