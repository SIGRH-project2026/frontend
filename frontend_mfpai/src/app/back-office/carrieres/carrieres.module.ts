import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarrieresRoutingModule } from './carrieres-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule,
    CarrieresRoutingModule,
NgxDropzoneModule
  ]
})
export class CarrieresModule { }
