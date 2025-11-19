import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortieTemporaireRoutingModule } from './sortie-temporaire-routing.module';
import { ListeDesAgentComponent } from './components/liste-des-agent/liste-des-agent.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailsAgentComponent } from './components/details-agent/details-agent.component';


@NgModule({
  declarations: [
    ListeDesAgentComponent,
    DetailsAgentComponent ,
  ],
  imports: [
    CommonModule,
    SortieTemporaireRoutingModule,
    SharedModule
  ]
})
export class SortieTemporaireModule { }
