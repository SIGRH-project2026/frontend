import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesDemandesRoutingModule } from './mes-demandes-routing.module';
import { AddDemandeComponent } from './components/add-demande/add-demande.component';
import { DetailDemandeComponent } from './components/detail-demande/detail-demande.component';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditDemandeComponent } from './components/edit-demande/edit-demande.component';


@NgModule({
  declarations: [
    ListDemandeComponent,
    DetailDemandeComponent,
    AddDemandeComponent,
    EditDemandeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialUiModule,
    NgxDropzoneModule,
    MesDemandesRoutingModule
  ]
})
export class MesDemandesModule { }
