import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametresRoutingModule } from './parametres-routing.module';
import { ListIndicateurComponent } from './components/list-indicateur/list-indicateur.component';
import { CreateIndicateurComponent } from './components/create-indicateur/create-indicateur.component';
import { ViewIndicateurComponent } from './components/view-indicateur/view-indicateur.component';
import { EditIndicateurComponent } from './components/edit-indicateur/edit-indicateur.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {MaterialUiModule} from "../../../shared/material-ui/material.module";
import {TagInputModule} from "ngx-chips";


@NgModule({
  declarations: [
    ListIndicateurComponent,
    CreateIndicateurComponent,
    ViewIndicateurComponent,
    EditIndicateurComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParametresRoutingModule,
    MaterialUiModule,
    TagInputModule,
  ]
})
export class ParametresModule { }
