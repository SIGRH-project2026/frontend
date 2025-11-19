import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonnelRoutingModule } from './personnel-routing.module';
import { ListPersonnelComponent } from './components/list-personnel/list-personnel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewPersonnelComponent } from './components/view-personnel/view-personnel.component';


@NgModule({
  declarations: [
    ListPersonnelComponent,
    ViewPersonnelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PersonnelRoutingModule
  ]
})
export class PersonnelModule { }
