import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Fiche etablissement
  {
    path: 'fiche-etablissement',
    loadChildren: () => import('./fiche-etablissement/fiche-etablissement.module').then(mod => mod.FicheEtablissementModule)
  },
  // Expressions de besoins en personnel
  {
    path: 'besoin-en-personnel',
    loadChildren: () => import('./besoin-en-personnel/besoin-en-personnel.module').then(mod => mod.BesoinEnPersonnelModule)
  },
    // Expressions de besoins en personnel reçu
  {
    path: 'besoin-en-personnel-recues',
    loadChildren: () => import('./besoin-personnel-recus/besoin-personnel-recus.module').then(mod => mod.BesoinPersonnelRecusModule)
  },
    {
    path: 'besoin-en-nombre-gap',
    loadChildren: () => import('./besoin-nombre-gap/besoin-nombre-gap.module').then(mod => mod.BesoinNombreGapModule)
  },
  {
    path: 'horaire-professeur',
    loadChildren: () => import('./horaire-professeurs/horaire-professeurs.module').then(mod => mod.HoraireProfesseursModule)
  },
    {
    path: 'mes-demandes-mutation-permutation',
    loadChildren: () => import('./mes-demandes-mutation-permutation/mes-demandes-mutation-permutation.module').then(mod => mod.MesDemandesMutationPermutationModule)
  },
     {
    path: 'demande-mutation-permutation-recues',
    loadChildren: () => import('./mes-demandes-mutation-permutation/mes-demandes-mutation-permutation.module').then(mod => mod.MesDemandesMutationPermutationModule)
 
   // loadChildren: () => import('./demandes-mutation-permutation-recues/demandes-mutation-permutation-recues.module').then(mod => mod.DemandesMutationPermutationRecuesModule)
  },
// pour le dashboard mutations
  {
    path: 'dashboard-mutation-recues/:statut',
    loadChildren: () => import('./mes-demandes-mutation-permutation/mes-demandes-mutation-permutation.module').then(mod => mod.MesDemandesMutationPermutationModule)
   },
   // pour le dashboard permutations
  {
    path: 'dashboard-permutation-recues/:statut',
    loadChildren: () => import('./mes-demandes-mutation-permutation/mes-demandes-mutation-permutation.module').then(mod => mod.MesDemandesMutationPermutationModule)
   },
   {
    path: 'mes-demande-permutation-recues',
    loadChildren: () => import('./mes-demandes-permutation-recues/mes-demandes-permutation-recues.module').then(mod => mod.MesDemandesPermutationRecuesModule)
  },
// Personnel
  {
    path: 'personnel',
    loadChildren: () => import('./personnel/personnel.module').then(mod => mod.PersonnelModule)
  },
  { path: '', redirectTo: 'expression-besoins', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GpeecRoutingModule { }
