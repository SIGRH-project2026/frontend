import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PtaRoutingModule } from './pta-routing.module';
import { CreatePtaComponent } from './components/create-pta/create-pta.component';
import { EditPtaComponent } from './components/edit-pta/edit-pta.component';
import { ViewPtaComponent } from './components/view-pta/view-pta.component';
import { ListPtaComponent } from './components/list-pta/list-pta.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { ListSousActionsComponent } from './components/list-sous-actions/list-sous-actions.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SinglePtaComponent } from './components/single-pta/single-pta.component';


@NgModule({
  declarations: [
    CreatePtaComponent,
    EditPtaComponent,
    ViewPtaComponent,
    ListPtaComponent,
    ListSousActionsComponent,
    SinglePtaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDropzoneModule,
    MaterialUiModule,
    PtaRoutingModule
  ]
})
export class PtaModule { }
