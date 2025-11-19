import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { MonCompteComponent } from './mon-compte/mon-compte.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  // Actualites
  // {
  //   path: 'actualites',
  //   loadChildren: () => import('../parametre/actualites/actualites.module').then(mod => mod.ActualitesModule)
  // },
  // Mon compte
  {
    path: 'mon-compte',
    loadChildren: () => import('./mon-compte/mon-compte.module').then(mod => mod.MonCompteModule)
  },
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Notifications'
    },
    children:[
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: {
          breadcrumb: ''
        },
      },
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
