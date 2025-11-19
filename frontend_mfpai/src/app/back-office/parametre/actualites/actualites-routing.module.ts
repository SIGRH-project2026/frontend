import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListActualiteComponent } from './components/list-actualite/list-actualite.component';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { AddActualiteComponent } from './components/add-actualite/add-actualite.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Paramètres - Actualités'
    },
    children: [
      {
        path: '',
        component: ListActualiteComponent,
        data: {
          breadcrumb: ''
        },
      },
       {
        path: 'create-actualite',
        component: AddActualiteComponent,
        data: {
          breadcrumb: 'Formulaire de création'
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
export class ActualitesRoutingModule { }
