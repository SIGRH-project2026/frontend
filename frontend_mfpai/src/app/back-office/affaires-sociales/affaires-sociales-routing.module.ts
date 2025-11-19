import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'mes-demandes',
    loadChildren: () => import('./mes-demandes/mes-demandes.module').then(mod => mod.MesDemandesModule)
  },
  {
    path: 'mes-demandes-dashboard/:statut',
    loadChildren: () => import('./mes-demandes/mes-demandes.module').then(mod => mod.MesDemandesModule)
  },
  {
    path: 'demandes-recues',
    loadChildren: () => import('./demandes-recues/demandes-recues.module').then(mod => mod.DemandesRecuesModule)
  },
  {
    path: 'dash-demandes-recues/:statut',
    loadChildren: () => import('./demandes-recues/demandes-recues.module').then(mod => mod.DemandesRecuesModule)
  },
  {
    path: 'dash-demandes-recues',
    loadChildren: () => import('./demandes-recues/demandes-recues.module').then(mod => mod.DemandesRecuesModule)
  },
  { path: '', redirectTo: 'mes-demandes', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffairesSocialesRoutingModule { }
