import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonDossierRoutingModule } from './mon-dossier-routing.module';
import { MonDossierComponent } from './mon-dossier.component';
import { MaterialUiModule } from '../../../../app/shared/material-ui/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Search2Pipe } from '../Pipes/Search2.pipe';


@NgModule({
  declarations: [
    MonDossierComponent,
    Search2Pipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialUiModule,
    MonDossierRoutingModule
  ]
})
export class MonDossierModule { }
