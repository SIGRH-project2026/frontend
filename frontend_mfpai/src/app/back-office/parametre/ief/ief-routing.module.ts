import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeIefComponent } from './components/liste-ief/liste-ief.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'IEF'
    },
    children: [
      {
        path: '',
        component: ListeIefComponent,
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
export class IEFRoutingModule { }
