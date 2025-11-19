import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IARoutingModule } from './ia-routing.module';
import { ListIaComponent } from './components/list-ia/list-ia.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListIaComponent
  ],
  imports: [
    CommonModule,
    IARoutingModule,
    SharedModule,

  ]
})
export class IAModule { }
