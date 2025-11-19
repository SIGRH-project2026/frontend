import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DossierAgentRoutingModule } from './dossier-agent-routing.module';
import { ListDossierAgentComponent } from './components/list-dossier-agent/list-dossier-agent.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddDossierAgentComponent } from './components/add-dossier-agent/add-dossier-agent.component';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../Pipes/Search.pipe';


@NgModule({
  declarations: [
    ListDossierAgentComponent,
    AddDossierAgentComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    DossierAgentRoutingModule,
    MaterialUiModule,
    NgxDropzoneModule,
    FormsModule,
  ]
})
export class DossierAgentModule { }
