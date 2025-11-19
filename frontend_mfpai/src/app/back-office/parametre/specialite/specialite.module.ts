import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialiteRoutingModule } from './specialite-routing.module';
import { ListeSpecialiteComponent } from './components/liste-specialite/liste-specialite.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListeSpecialiteComponent
  ],
  imports: [
    CommonModule,
    SpecialiteRoutingModule,
    SharedModule,
  ]
})
export class SpecialiteModule { }
