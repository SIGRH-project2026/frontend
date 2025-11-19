import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  // Niveau central

  {
    path: 'niveau-central',
    loadChildren: () => import('./niveau-central/niveau-central.module').then(mod => mod.NiveauCentralModule)
  },
  // Niveau Déconcentré
  {
    path: 'niveau-deconcentre',
    loadChildren: () => import('./niveau-deconcentre/niveau-deconcentre.module').then(mod => mod.NiveauDeconcentreModule)
  },
  {
    path: 'recherche-globale',
    loadChildren: () => import('./recherche-globale/recherche-globale.module').then(mod => mod.RechercheGlobaleModule)
  },
  // Paramétrages
  // {
  //   path: 'parametrage',
  //   loadChildren: () => import('./parametrage/corps-grade/corps-grade.module').then(mod => mod.CorpsGradeModule)
  // },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateursRoutingModule { }
