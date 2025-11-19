import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesDemandesRoutingModule } from './mes-demandes-routing.module';
import { ListeDemandesComponent } from './components/liste-demandes/liste-demandes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddActeComponent } from './components/add-acte/add-acte.component';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ViewActeComponent } from './components/view-acte/view-acte.component';
import { SingleActeComponent } from './components/single-acte/single-acte.component';
import { EditActeComponent } from './components/edit-acte/edit-acte.component';


@NgModule({
  declarations: [
    ListeDemandesComponent,
    AddActeComponent,
    ViewActeComponent,
    SingleActeComponent,
    EditActeComponent
  ],
  imports: [
    CommonModule,
    MesDemandesRoutingModule,
    SharedModule,
    NgxDropzoneModule
  ]
})
export class MesDemandesModule { }
