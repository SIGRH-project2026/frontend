import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActualitesRoutingModule } from './actualites-routing.module';
import { ListActualiteComponent } from './components/list-actualite/list-actualite.component';
import { AddActualiteComponent } from './components/add-actualite/add-actualite.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    ListActualiteComponent,
    AddActualiteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDropzoneModule,
    ActualitesRoutingModule
  ]
})
export class ActualitesModule { }
