import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'actualites',
    loadChildren: () => import('./actualites/actualites.module').then(mod => mod.ActualitesModule)
  },
  {
    path: 'recrutement',
    loadChildren: () => import('./recrutements/recrutements.module').then(mod => mod.RecrutementsModule)
  },
  {
    path: 'directions',
    loadChildren: () => import('./directions/directions.module').then(mod => mod.DirectionsModule)
  },
  {
    path: 'division-bureaux',
    loadChildren: () => import('./division-bureaux/division-bureaux.module').then(mod => mod.DivisionBureauxModule)
  },
  {
    path: 'ia',
    loadChildren: () => import('./ia/ia.module').then(mod => mod.IAModule)
  },
  {
    path: 'ief',
    loadChildren: () => import('./ief/ief.module').then(mod => mod.IEFModule)
  },
  {
    path: 'etablissement',
    loadChildren: () => import('./etablissement/etablissement.module').then(mod => mod.EtablissementModule)
  },
  {
    path: 'specialite',
    loadChildren: () => import('./specialite/specialite.module').then(mod => mod.SpecialiteModule)
  },
  {
    path: 'fonction',
    loadChildren: () => import('./fonction/fonction.module').then(mod => mod.FonctionModule)
  },
  {
    path: 'specialite-etablissement',
    loadChildren: () => import('./specialite-etablissement/specialite-etablissement.module').then(mod => mod.SpecialiteEtablissementModule)
  },
  {
    path: 'corp-grade',
    loadChildren: () => import('./corps-grade/corps-grade.module').then(mod => mod.CorpsGradeModule)
  },
  {
    path: 'divisions',
    loadChildren: () => import('./divisions/divisions.module').then(mod => mod.DivisionsModule)
  },
  {
    path: 'bureaux',
    loadChildren: () => import('./bureaux/bureaux.module').then(mod => mod.BureauxModule)
  },

  {
    path: 'diplome',
    loadChildren: () => import('./diplome/diplome.module').then(mod => mod.DiplomeModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametreRoutingModule { }
