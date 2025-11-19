import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortieDefinitiveRoutingModule } from './sortie-definitive-routing.module';
import { ListAgentComponent } from './components/list-agent/list-agent.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailsAgentComponent } from './components/details-agent/details-agent.component';


@NgModule({
  declarations: [
    ListAgentComponent,
    DetailsAgentComponent
  ],
  imports: [
    CommonModule,
    SortieDefinitiveRoutingModule,
    SharedModule
  ]
})
export class SortieDefinitiveModule { }
