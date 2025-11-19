import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanFormationRoutingModule } from './plan-formation-routing.module';

import { CreatePlanFormationComponent } from './components/create-plan-formation/create-plan-formation.component';
import { CreateThemeFormationComponent } from './components/create-theme-formation/create-theme-formation.component';
import { EditPlanFormationComponent } from './components/edit-plan-formation/edit-plan-formation.component';
import { EditThemeFormationComponent } from './components/edit-theme-formation/edit-theme-formation.component';
import { ListPlanFormationComponent } from './components/list-plan-formation/list-plan-formation.component';
import { ViewPlanFormationComponent } from './components/view-plan-formation/view-plan-formation.component';
import { ViewThemeFormationComponent } from './components/view-theme-formation/view-theme-formation.component';
import { SinglePlanFormationComponent } from './components/single-plan-formation/single-plan-formation.component';
import { SingleThemeFormationComponent } from './components/single-theme-formation/single-theme-formation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSelectModule } from '@angular/material/select';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { CreateFormationComponent } from './components/create-formation/create-formation.component';
import { TagInputModule } from 'ngx-chips';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';

@NgModule({
  declarations: [
    CreatePlanFormationComponent,
    EditPlanFormationComponent,
    ListPlanFormationComponent,
    ViewPlanFormationComponent,
    CreateThemeFormationComponent,
    ViewThemeFormationComponent,
    EditThemeFormationComponent,
    SinglePlanFormationComponent,
    SingleThemeFormationComponent,
    CreateFormationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDropzoneModule,
    PlanFormationRoutingModule,
    MatSelectModule,
    NgxDropzoneModule,
    TagInputModule,
MaterialUiModule
  ],
   exports: [
    CreateFormationComponent
  ]
})
export class PlanFormationModule { }
