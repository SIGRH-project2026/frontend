import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtablissementRoutingModule } from './etablissement-routing.module';
import { ListEtablissementComponent } from './components/list-etablissement/list-etablissement.component';
import { AddEtablissementComponent } from './components/add-etablissement/add-etablissement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditEtablissementComponent } from './components/edit-etablissement/edit-etablissement.component';


@NgModule({
  declarations: [
    ListEtablissementComponent,
    AddEtablissementComponent,
    EditEtablissementComponent
  ],
  imports: [
    CommonModule,
    EtablissementRoutingModule,
    SharedModule
  ]
})
export class EtablissementModule { }
