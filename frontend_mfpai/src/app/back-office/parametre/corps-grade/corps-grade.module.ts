import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorpsGradeRoutingModule } from './corps-grade-routing.module';
import { ListCorpsGradeComponent } from './components/list-corps-grade/list-corps-grade.component';
import { AddCorpsGradeComponent } from './components/add-corps-grade/add-corps-grade.component';
import { EditCorpsGradeComponent } from './components/edit-corps-grade/edit-corps-grade.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputModule } from 'ngx-chips';


@NgModule({
  declarations: [
    ListCorpsGradeComponent,
    AddCorpsGradeComponent,
    EditCorpsGradeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TagInputModule,
    CorpsGradeRoutingModule
  ]
})
export class CorpsGradeModule { }
