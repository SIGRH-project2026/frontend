import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListDesMatiereDeficitsComponent } from './components/list-des-matiere-deficits/list-des-matiere-deficits.component';
import { DetailHoraireProfesseurComponent } from './components/detail-horaire-professeur/detail-horaire-professeur.component';

const routes: Routes = [
  {
    path: '',
    component : MainComponent,
    data:{
      breadcrumb : 'Horaires-Professeurs'
    },
    children : [
      {
        path: '',
        component : ListDesMatiereDeficitsComponent,
        data: {
          breadcrumb : ''
        }
      },
      {

        path: ':Id/details-horaires-professeur',
        component: DetailHoraireProfesseurComponent,
        data: {
          breadcrumb: 'Détail Horaire '
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
export class HoraireProfesseursRoutingModule { }
