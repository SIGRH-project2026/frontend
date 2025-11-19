import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BesoinPersonnelRecusRoutingModule } from './besoin-personnel-recus-routing.module';
import { ListeDesBesoinsRecusComponent } from './components/liste-des-besoins-recus/liste-des-besoins-recus.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailDemandeEnPersonnelRecusComponent } from './components/detail-demande-en-personnel-recus/detail-demande-en-personnel-recus.component';


@NgModule({
  declarations: [
    ListeDesBesoinsRecusComponent,
    DetailDemandeEnPersonnelRecusComponent
  ],
  imports: [
    CommonModule,
    BesoinPersonnelRecusRoutingModule,
    SharedModule,
  ]
})
export class BesoinPersonnelRecusModule { }
