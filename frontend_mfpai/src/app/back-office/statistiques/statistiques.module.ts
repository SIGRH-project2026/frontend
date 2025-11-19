import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatistiquesRoutingModule } from './statistiques-routing.module';
import { ListStatistiqueComponent } from './components/list-statistique/list-statistique.component';
import { SingleStatistiqueComponent } from './components/single-statistique/single-statistique.component';
import { CompetencesProfessionnellesComponent } from './components/competences-professionnelles/competences-professionnelles.component';
import { FormateursQualifiesComponent } from './components/formateurs-qualifies/formateurs-qualifies.component';
import { CompetencesMisesAJourComponent } from './components/competences-mises-a-jour/competences-mises-a-jour.component';
import { PersonnelEncadrementComponent } from './components/personnel-encadrement/personnel-encadrement.component';
import { PersonnelAdministratifComponent } from './components/personnel-administratif/personnel-administratif.component';
import { RenforcementCapacitesComponent } from './components/renforcement-capacites/renforcement-capacites.component';
import { GestionRationnelleComponent } from './components/gestion-rationnelle/gestion-rationnelle.component';

import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
@NgModule({
  declarations: [
    ListStatistiqueComponent,
    SingleStatistiqueComponent,
    CompetencesProfessionnellesComponent,
    FormateursQualifiesComponent,
    CompetencesMisesAJourComponent,
    PersonnelEncadrementComponent,
    PersonnelAdministratifComponent,
    RenforcementCapacitesComponent,
    GestionRationnelleComponent
  ],
  imports: [
    CommonModule,
    CanvasJSAngularChartsModule,
    StatistiquesRoutingModule
  ]
})
export class StatistiquesModule { }
