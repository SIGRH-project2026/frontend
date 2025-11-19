import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonCompteRoutingModule } from './mon-compte-routing.module';
import { MonCompteComponent } from './mon-compte.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MonCompteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MonCompteRoutingModule
  ]
})
export class MonCompteModule { }
