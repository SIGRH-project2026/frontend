import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPortailComponent } from '../shared/layouts/main-portail/main-portail.component';
import { PortailComponent } from './portail/portail.component';
import { ContactComponent } from './contact/contact.component';
import { RecrutementComponent } from './recrutement/recrutement.component';
import { FormationContinueComponent } from './formation-continue/formation-continue.component';
import { FormationDiplomanteComponent } from './formation-diplomante/formation-diplomante.component';
import { PlanFormationComponent } from './plan-formation/plan-formation.component';
import { SingleFormationComponent } from './single-formation/single-formation.component';
import { SinglePlanFormationComponent } from './single-plan-formation/single-plan-formation.component';
import { ActualiteComponent } from './actualite/actualite.component';
import { SingleActualiteComponent } from './single-actualite/single-actualite.component';
import { SingleRecrutementComponent } from './single-recrutement/single-recrutement.component';

const routes: Routes = [
  {
        path: '', component: MainPortailComponent,
        children: [
          { path: '', component: PortailComponent },

          { path: 'contact', component: ContactComponent },

          { path: 'formations/formation-continue', component: FormationContinueComponent },
          { path: 'formations/formation-diplomante', component: FormationDiplomanteComponent },
          { path: 'formations/formation-continue/:dataId', component: SingleFormationComponent },
          { path: 'formations/formation-diplomante/:dataId', component: SingleFormationComponent },
          

          { path: 'formations/plan-de-formation', component: PlanFormationComponent },
          { path: 'formations/plan-de-formation/:dataId', component: SinglePlanFormationComponent },

          { path: 'actualites', component: ActualiteComponent },
          { path: 'actualites/:dataId', component: SingleActualiteComponent },

          { path: 'recrutement', component: RecrutementComponent },
          { path: 'recrutement/:dataId', component: SingleRecrutementComponent },

          { path: '', redirectTo: '', pathMatch: 'full' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
