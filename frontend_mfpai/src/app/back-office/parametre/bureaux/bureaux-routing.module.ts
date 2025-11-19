import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListBureauxComponent } from './components/list-bureaux/list-bureaux.component';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Bureaux'
    },
    children: [
      {
        path: '',
        component: ListBureauxComponent,
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
export class BureauxRoutingModule { }
