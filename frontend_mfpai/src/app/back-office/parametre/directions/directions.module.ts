import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectionsRoutingModule } from './directions-routing.module';
import { ListeDirectionsComponent } from './components/liste-directions/liste-directions.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListeDirectionsComponent
  ],
  imports: [
    CommonModule,
    DirectionsRoutingModule,
    SharedModule,
  ]
})
export class DirectionsModule { }
