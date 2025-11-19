import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListeSpecialiteEtablissementComponent } from './components/liste-specialite-etablissement/liste-specialite-etablissement.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Specialité/Etablissement'
    },
    children: [
      {
        path: '',
        component: ListeSpecialiteEtablissementComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [ 'ADMIN-DRH', 'Directeur-DRH', 'Admin-General'],
          breadcrumb: ''
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
export class SpecialiteEtablissementRoutingModule { }
