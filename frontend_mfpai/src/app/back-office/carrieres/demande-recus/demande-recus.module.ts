import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandeRecusRoutingModule } from './demande-recus-routing.module';
import { ListeDemandesRecusComponent } from './liste-demandes-recus/liste-demandes-recus.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ViewDemandeRecusComponent } from './view-demande-recus/view-demande-recus.component';


@NgModule({
  declarations: [
    ListeDemandesRecusComponent,
    ViewDemandeRecusComponent
  ],
  imports: [
    CommonModule,
    DemandeRecusRoutingModule,
    SharedModule,
    MaterialUiModule,
    NgxDropzoneModule
  ]
})
export class DemandeRecusModule { }
