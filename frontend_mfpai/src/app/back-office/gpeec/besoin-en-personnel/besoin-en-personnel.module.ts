import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BesoinEnPersonnelRoutingModule } from './besoin-en-personnel-routing.module';
import { CreateExpressionComponent } from './components/create-expression/create-expression.component';
import { ListExpressionComponent } from './components/list-expression/list-expression.component';
import { EditExpressionComponent } from './components/edit-expression/edit-expression.component';
import { ViewExpressionComponent } from './components/view-expression/view-expression.component';
import { SingleExpressionComponent } from './components/single-expression/single-expression.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CreateExpressionComponent,
    ListExpressionComponent,
    EditExpressionComponent,
    ViewExpressionComponent,
    SingleExpressionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BesoinEnPersonnelRoutingModule
  ]
})
export class BesoinEnPersonnelModule { }
