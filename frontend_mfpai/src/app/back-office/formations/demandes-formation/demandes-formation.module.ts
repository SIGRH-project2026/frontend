import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandesFormationRoutingModule } from './demandes-formation-routing.module';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { DetailViewDemandeComponent } from './components/detail-view-demande/detail-view-demande.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { JoindreDossierComponent } from './components/joindre-dossier/joindre-dossier.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SingleViewComponent } from './components/single-view/single-view.component';


@NgModule({
  declarations: [
    ListDemandeComponent,
    DetailViewDemandeComponent,
    JoindreDossierComponent,
    SingleViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDropzoneModule,
    DemandesFormationRoutingModule
  ]
})
export class DemandesFormationModule { }
