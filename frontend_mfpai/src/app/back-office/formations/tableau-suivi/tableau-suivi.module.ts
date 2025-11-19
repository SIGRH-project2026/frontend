import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableauSuiviRoutingModule } from './tableau-suivi-routing.module';
import { TableauSuiviComponent } from './components/tableau-suivi/tableau-suivi.component';
import { ViewDetailComponent } from './components/view-detail/view-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateTableauSuiviComponent } from './components/create-tableau-suivi/create-tableau-suivi.component';
import { SingleViewComponent } from './components/single-view/single-view.component';


@NgModule({
  declarations: [
    TableauSuiviComponent,
    ViewDetailComponent,
    CreateTableauSuiviComponent,
    SingleViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TableauSuiviRoutingModule
  ]
})
export class TableauSuiviModule { }
