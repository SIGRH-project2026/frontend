import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiplomeRoutingModule } from './diplome-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {DiplomeComponent} from "./components/diplome.component";


@NgModule({
  declarations: [
    DiplomeComponent
  ],
  imports: [
    CommonModule,
    DiplomeRoutingModule,
    SharedModule,
  ]
})
export class DiplomeModule { }
