import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListStatistiqueComponent } from './components/list-statistique/list-statistique.component';
import { SingleStatistiqueComponent } from './components/single-statistique/single-statistique.component';
import { CompetencesProfessionnellesComponent } from './components/competences-professionnelles/competences-professionnelles.component';
import { FormateursQualifiesComponent } from './components/formateurs-qualifies/formateurs-qualifies.component';
import { CompetencesMisesAJourComponent } from './components/competences-mises-a-jour/competences-mises-a-jour.component';
import { PersonnelEncadrementComponent } from './components/personnel-encadrement/personnel-encadrement.component';
import { PersonnelAdministratifComponent } from './components/personnel-administratif/personnel-administratif.component';
import { RenforcementCapacitesComponent } from './components/renforcement-capacites/renforcement-capacites.component';
import { GestionRationnelleComponent } from './components/gestion-rationnelle/gestion-rationnelle.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Statistiques'
    },
    children: [
      {
        path: '',
        component: ListStatistiqueComponent,
        data: {
          breadcrumb: ''
        },
      },
      {
        path: 'competences-professionnelles',
        component: CompetencesProfessionnellesComponent,
        data: {
          breadcrumb: 'Formulaire de statistique'
        },
      },
      {
        path: 'formateurs-qualifies',
        component: FormateursQualifiesComponent,
        data: {
          breadcrumb: 'Formulaire de statistique'
        },
      },
      {
        path: 'competences-mises-a-jour',
        component: CompetencesMisesAJourComponent,
        data: {
          breadcrumb: 'Formulaire de statistique'
        },
      },
      {
        path: 'personnel-encadrement',
        component: PersonnelEncadrementComponent,
        data: {
          breadcrumb: 'Formulaire de statistique'
        },
      },
      {
        path: 'personnel-administratif',
        component: PersonnelAdministratifComponent,
        data: {
          breadcrumb: 'Formulaire de statistique'
        },
      },
      {
        path: 'renforcement-capacites',
        component: RenforcementCapacitesComponent,
        data: {
          breadcrumb: 'Formulaire de statistique'
        },
      },
      {
        path: 'gestion-rationnelle',
        component: GestionRationnelleComponent,
        data: {
          breadcrumb: 'Formulaire de statistique'
        },
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatistiquesRoutingModule { }
