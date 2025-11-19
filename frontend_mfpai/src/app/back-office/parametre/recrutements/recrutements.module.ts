import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecrutementsRoutingModule } from './recrutements-routing.module';
import { ListeRecrutementComponent } from './components/liste-recrutement/liste-recrutement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddRecrutementComponent } from './components/add-recrutement/add-recrutement.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    ListeRecrutementComponent,
    AddRecrutementComponent
  ],
  imports: [
    CommonModule,
    RecrutementsRoutingModule,
    SharedModule,
    NgxDropzoneModule,

  ]
})
export class RecrutementsModule { }
