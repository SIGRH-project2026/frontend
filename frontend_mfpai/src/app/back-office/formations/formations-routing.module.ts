import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IsRoleGuard} from "../../guard/role.guard";

const routes: Routes = [
  // Expression des besoins
  {
    path: 'expression-besoins',
    loadChildren: () => import('./expression-besoins/expression-besoins.module').then(mod => mod.ExpressionBesoinsModule),

  },
  // Plan de formation
  {
    path: 'plan-formation',
    loadChildren: () => import('./plan-formation/plan-formation.module').then(mod => mod.PlanFormationModule)
  },
  // Liste des formations
  {
    path: 'liste-des-formations',
    loadChildren: () => import('./list-formations/list-formations.module').then(mod => mod.ListFormationsModule)
  },
  // Mes formations
  {
    path: 'mes-formations',
    loadChildren: () => import('./mes-formations/mes-formations.module').then(mod => mod.MesFormationsModule)
  },
  // Demandes de formation
  {
    path: 'demandes-de-formation',
    loadChildren: () => import('./demandes-formation/demandes-formation.module').then(mod => mod.DemandesFormationModule)
  },
   // Tableau de suivi des Formations
  {
    path: 'tableau-suivi-formations',
    loadChildren: () => import('./tableau-suivi/tableau-suivi.module').then(mod => mod.TableauSuiviModule)
  },
  // Courriers
  // {
  //   path: 'courriers',
  //   loadChildren: () => import('./courriers/courriers.module').then(mod => mod.CourriersModule)
  // },
  // Stages internes
  {
    path: 'stages-internes',
    loadChildren: () => import('./stages-internes/stages-internes.module').then(mod => mod.StagesInternesModule),

  },
  { path: '', redirectTo: 'plan-formation', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationsRoutingModule { }
