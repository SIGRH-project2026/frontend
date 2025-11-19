import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BureauxRoutingModule } from './bureaux-routing.module';
import { ListBureauxComponent } from './components/list-bureaux/list-bureaux.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListBureauxComponent
  ],
  imports: [
    CommonModule,
    BureauxRoutingModule,
    SharedModule,
  ]
})
export class BureauxModule { }
