import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BesoinNombreGapRoutingModule } from './besoin-nombre-gap-routing.module';
import { ListeBesoinEnNbrGapComponent } from './components/liste-besoin-en-nbr-gap/liste-besoin-en-nbr-gap.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailGapComponent } from './components/detail-gap/detail-gap.component';


@NgModule({
  declarations: [
    ListeBesoinEnNbrGapComponent,
    DetailGapComponent
  ],
  imports: [
    CommonModule,
    BesoinNombreGapRoutingModule,
    SharedModule,
  ]
})
export class BesoinNombreGapModule { }
