import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListMesFormationsComponent } from './components/list-mes-formations/list-mes-formations.component';
import { DetailViewMesFormationsComponent } from './components/detail-view-mes-formations/detail-view-mes-formations.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Mes formations'
    },
    children: [
      // Routing list mes formations
      {
        path: '',
        component: ListMesFormationsComponent,
        data: {
          breadcrumb: ''
        },
      },
      {
        path: ':dataId/detail-view',
        component: DetailViewMesFormationsComponent,
        data: {
          breadcrumb: 'Détail formation'
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
export class MesFormationsRoutingModule { }
