import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandesRecuesRoutingModule } from './demandes-recues-routing.module';
import { ListDemandeRecueComponent } from './components/list-demande-recue/list-demande-recue.component';
import { DetailDemandeRecueComponent } from './components/detail-demande-recue/detail-demande-recue.component';
import { TraitementDemandeRecueComponent } from './components/traitement-demande-recue/traitement-demande-recue.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListDemandeRecueComponent,
    DetailDemandeRecueComponent,
    TraitementDemandeRecueComponent
  ],
  imports: [
    CommonModule,
    DemandesRecuesRoutingModule,
    SharedModule,
    MaterialUiModule,
    NgxDropzoneModule,
  ],
  exports: [
    DetailDemandeRecueComponent
  ]
})
export class DemandesRecuesModule { }
