import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListFormationsRoutingModule } from './list-formations-routing.module';
import { ListFormationComponent } from './components/list-formation/list-formation.component';
import { DetailViewFormationComponent } from './components/detail-view-formation/detail-view-formation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompleteFormationComponent } from './components/complete-formation/complete-formation.component';
import { PlanFormationModule } from "../plan-formation/plan-formation.module";
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { EditFormationComponent } from './components/edit-formation/edit-formation.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TagInputModule } from 'ngx-chips';
import { CreateFormationDiplomanteComponent } from './components/create-formation-diplomante/create-formation-diplomante.component';
import { EnvoyerFicheComponent } from './components/envoyer-fiche/envoyer-fiche.component';
import { EnvoyerOffresTechniquesComponent } from './components/envoyer-offres-techniques/envoyer-offres-techniques.component';
import { OffresComponent } from './components/offres/offres.component';


@NgModule({
    declarations: [
        ListFormationComponent,
        DetailViewFormationComponent,
        CompleteFormationComponent,
        EditFormationComponent,
        CreateFormationDiplomanteComponent,
        EnvoyerOffresTechniquesComponent,
        EnvoyerFicheComponent,
        OffresComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MaterialUiModule,
        NgxDropzoneModule,
        TagInputModule,
        ListFormationsRoutingModule,
        PlanFormationModule,
    ],
    exports: [
        DetailViewFormationComponent
    ]
})
export class ListFormationsModule { }
