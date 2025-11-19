import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListCourrierComponent } from './components/list-courrier/list-courrier.component';
import { CreateCourrierComponent } from './components/create-courrier/create-courrier.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Courrier DRH'
    },
    children: [
      // Routing list courrier
      {
        path: '',
        component: ListCourrierComponent,
        data: {
          breadcrumb: ''
        },
      },
      {
        path: 'create-courrier',
        component: CreateCourrierComponent,
        data: {
          breadcrumb: 'Formulaire d’enregistrement'
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
export class CourriersRoutingModule { }
