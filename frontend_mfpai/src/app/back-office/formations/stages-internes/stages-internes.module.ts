import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StagesInternesRoutingModule } from './stages-internes-routing.module';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { NouvelleDemandeComponent } from './components/nouvelle-demande/nouvelle-demande.component';
import { ImputerDemandeComponent } from './components/imputer-demande/imputer-demande.component';
import { DonnerAvisDemandeComponent } from './components/donner-avis-demande/donner-avis-demande.component';
import { EnregisterRapportStageComponent } from './components/enregister-rapport-stage/enregister-rapport-stage.component';
import { EnregisterAttestationStageComponent } from './components/enregister-attestation-stage/enregister-attestation-stage.component';
import { DetailDemandeComponent } from './components/detail-demande/detail-demande.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditDemandeComponent } from './components/edit-demande/edit-demande.component';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";
import { AutorisationStageComponent } from './components/autorisation-stage/autorisation-stage.component';


@NgModule({
  declarations: [
    ListDemandeComponent,
    NouvelleDemandeComponent,
    ImputerDemandeComponent,
    DonnerAvisDemandeComponent,
    EnregisterRapportStageComponent,
    EnregisterAttestationStageComponent,
    DetailDemandeComponent,
    EditDemandeComponent,
    AutorisationStageComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule,
    SharedModule,
    NgxDropzoneModule,
    StagesInternesRoutingModule,
    NgxMaskDirective, NgxMaskPipe
  ],
  providers: [provideNgxMask()]
})
export class StagesInternesModule { }
