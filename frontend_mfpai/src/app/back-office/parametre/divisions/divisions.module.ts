import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivisionsRoutingModule } from './divisions-routing.module';
import { ListeDivisionComponent } from './components/liste-division/liste-division.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListeDivisionComponent
  ],
  imports: [
    CommonModule,
    DivisionsRoutingModule,
    SharedModule,
  ]
})
export class DivisionsModule { }
