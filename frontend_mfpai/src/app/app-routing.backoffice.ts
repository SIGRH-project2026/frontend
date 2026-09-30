import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('src/app/back-office/authentification/authentification.module').then(m => m.AuthentificationModule) },
  { path: '', canActivateChild: [AuthGuard], children: [
      { path: 'dashboard', loadChildren: () => import('src/app/back-office/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'courriers', loadChildren: () => import('src/app/back-office/formations/courriers/courriers.module').then(m => m.CourriersModule) },
      { path: 'formations', loadChildren: () => import('src/app/back-office/formations/formations.module').then(m => m.FormationsModule) },
      { path: 'carrieres', loadChildren: () => import('src/app/back-office/carrieres/carrieres.module').then(m => m.CarrieresModule) },
      { path: 'utilisateurs', loadChildren: () => import('src/app/back-office/utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule) },
      { path: 'gpeec', loadChildren: () => import('src/app/back-office/gpeec/gpeec.module').then(m => m.GpeecModule) },
      { path: 'affaires-sociales', loadChildren: () => import('src/app/back-office/affaires-sociales/affaires-sociales.module').then(m => m.AffairesSocialesModule) },
      { path: 'statistiques', loadChildren: () => import('src/app/back-office/statistiques/statistiques.module').then(m => m.StatistiquesModule) },
      { path: 'plan-travail-annuel', loadChildren: () => import('src/app/back-office/plan-travail-annuel/plan-travail-annuel.module').then(m => m.PlanTravailAnnuelModule) },
      { path: 'settings', loadChildren: () => import('src/app/back-office/settings/settings.module').then(m => m.SettingsModule) },
      { path: 'parametrage', loadChildren: () => import('src/app/back-office/parametre/parametre.module').then(m => m.ParametreModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
