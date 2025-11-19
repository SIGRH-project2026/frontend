import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourriersRoutingModule } from './courriers-routing.module';
import { ListCourrierComponent } from './components/list-courrier/list-courrier.component';
import { CreateCourrierComponent } from './components/create-courrier/create-courrier.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListCourrierComponent,
    CreateCourrierComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CourriersRoutingModule
  ]
})
export class CourriersModule { }
