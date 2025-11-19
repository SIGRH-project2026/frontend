import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivisionBureauxRoutingModule } from './division-bureaux-routing.module';
import { ListeDivisionBureauxComponent } from './components/liste-division-bureaux/liste-division-bureaux.component';
import { AddDivisionBureauxComponent } from './components/add-division-bureaux/add-division-bureaux.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListeDivisionBureauxComponent,
    AddDivisionBureauxComponent
  ],
  imports: [
    CommonModule,
    DivisionBureauxRoutingModule,
    SharedModule,
  ]
})
export class DivisionBureauxModule { }
