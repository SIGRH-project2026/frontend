import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from "./dashboard.component";
import { DFCDASHBOARDComponent } from './dfc-dashboard/dfc-dashboard.component';
import { DGPEECDASHBOARDComponent } from './dgpeec-dashboard/dgpeec-dashboard.component';
import { CourrierDRHDaschboardComponent } from './courrier-drh-daschboard/courrier-drh-daschboard.component';
import { DgcaaComponent } from './dgcaa/dgcaa.component';
import { AffairesSocialesComponent } from './affaires-sociales/affaires-sociales.component';
import { FormsModule } from '@angular/forms';
import { PtaComponent } from './pta/pta.component';



@NgModule({
  declarations: [
    DashboardComponent,
    DFCDASHBOARDComponent,
    DGPEECDASHBOARDComponent,
    CourrierDRHDaschboardComponent,
    DgcaaComponent,
    AffairesSocialesComponent,
    PtaComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule
  ]
})
export class DashboardModule { }
