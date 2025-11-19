import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import {DiplomeComponent} from "./components/diplome.component";
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Diplome'
    },
    children: [
      {
        path: '',
        component: DiplomeComponent,
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
export class DiplomeRoutingModule { }
