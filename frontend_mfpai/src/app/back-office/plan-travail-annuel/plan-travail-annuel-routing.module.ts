import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Plan Travail Annuel
  {
    path: 'pta',
    loadChildren: () => import('./pta/pta.module').then(mod => mod.PtaModule)
  },
  // Paramètres
  {
    path: 'parametres',
    loadChildren: () => import('./parametres/parametres.module').then(mod => mod.ParametresModule)
  },
  { path: '', redirectTo: 'parametres', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanTravailAnnuelRoutingModule { }
