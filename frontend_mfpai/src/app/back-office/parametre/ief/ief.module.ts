import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IEFRoutingModule } from './ief-routing.module';
import { ListeIefComponent } from './components/liste-ief/liste-ief.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListeIefComponent
  ],
  imports: [
    CommonModule,
    IEFRoutingModule,
    SharedModule
  ]
})
export class IEFModule { }
