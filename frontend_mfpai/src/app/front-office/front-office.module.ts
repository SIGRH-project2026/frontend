import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { PortailComponent } from './portail/portail.component';
import { FormationContinueComponent } from './formation-continue/formation-continue.component';
import { FormationDiplomanteComponent } from './formation-diplomante/formation-diplomante.component';
import { ContactComponent } from './contact/contact.component';
import { RecrutementComponent } from './recrutement/recrutement.component';
import { PlanFormationComponent } from './plan-formation/plan-formation.component';
import { SingleFormationComponent } from './single-formation/single-formation.component';
import { SinglePlanFormationComponent } from './single-plan-formation/single-plan-formation.component';
import { SingleActualiteComponent } from './single-actualite/single-actualite.component';
import { ActualiteComponent } from './actualite/actualite.component';
import { SingleRecrutementComponent } from './single-recrutement/single-recrutement.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PortailComponent,
    FormationContinueComponent,
    FormationDiplomanteComponent,
    ContactComponent,
    RecrutementComponent,
    PlanFormationComponent,
    SingleFormationComponent,
    SinglePlanFormationComponent,
    SingleActualiteComponent,
    ActualiteComponent,
    SingleRecrutementComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    NgbCarouselModule,
    SharedModule,
    FrontOfficeRoutingModule
  ]
})
export class FrontOfficeModule { }
