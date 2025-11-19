import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeDesFonctionsComponent } from './components/liste-des-fonctions/liste-des-fonctions.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Fonctions'
    },
    children: [
      {
        path: '',
        component: ListeDesFonctionsComponent,
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
export class FonctionRoutingModule { }
