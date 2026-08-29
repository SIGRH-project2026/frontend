import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
   // path: 'mon-dossier/:idDossier',
    path: 'mon-dossier',
    loadChildren: () => import('./mon-dossier/mon-dossier.module').then(mod => mod.MonDossierModule),
    data: { breadcrumb: 'Mon dossier' },
    //data: {role: ['Agent-bureau','Agent-bureau']}
  },

  {
    path: 'mon-dossier/:idDossier',
    loadChildren: () => import('./mon-dossier/mon-dossier.module').then(m => m.MonDossierModule),
    data: { breadcrumb: 'Dossiers agents / Détail du dossier' }
  },
  {
    path: 'dossier-agents',
    loadChildren: () => import('./dossier-agent/dossier-agent.module').then(mod => mod.DossierAgentModule),
    //data: {role: ['Formateur']}
  },
  {
    path: 'mes-demandes',
    loadChildren: () => import('./mes-demandes/mes-demandes.module').then(mod => mod.MesDemandesModule)
  },
  {
    path: 'demandes-recues-dashboard/:type/:codeType/:statut',
    loadChildren: () => import('./demande-recus/demande-recus.module').then(mod => mod.DemandeRecusModule)
  },
   

  {
    path: 'demandes-recues',
    loadChildren: () => import('./demande-recus/demande-recus.module').then(mod => mod.DemandeRecusModule)
  },
    {
    path: 'sortie-temporaire',
    loadChildren: () => import('./sortie-temporaire/sortie-temporaire.module').then(mod => mod.SortieTemporaireModule)
  },
  {
    path: 'sortie-definitive',
    loadChildren: () => import('./sortie-definitive/sortie-definitive.module').then(mod => mod.SortieDefinitiveModule)
  },
  {
    path: 'inputation-bulletin',
    loadChildren: () => import('./inputation-bulletin-de-visite/inputation-bulletin-de-visite.module').then(mod => mod.InputationBulletinDeVisiteModule)
  },
  {
    path: 'dash-inputation-bulletin/:type',
    loadChildren: () => import('./inputation-bulletin-de-visite/inputation-bulletin-de-visite.module').then(mod => mod.InputationBulletinDeVisiteModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrieresRoutingModule { }
