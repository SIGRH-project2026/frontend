import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { MonCompteComponent } from './mon-compte.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Mon compte'
    },
    children: [
      {
        path: '',
        component: MonCompteComponent,
        data: {
          breadcrumb: ''
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
export class MonCompteRoutingModule { }
