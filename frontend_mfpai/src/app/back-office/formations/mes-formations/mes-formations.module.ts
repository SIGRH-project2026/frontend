import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesFormationsRoutingModule } from './mes-formations-routing.module';
import { ListMesFormationsComponent } from './components/list-mes-formations/list-mes-formations.component';
import { DetailViewMesFormationsComponent } from './components/detail-view-mes-formations/detail-view-mes-formations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { ListFormationsModule } from "../list-formations/list-formations.module";
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
    declarations: [
        ListMesFormationsComponent,
        DetailViewMesFormationsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MaterialUiModule,
        NgxDropzoneModule,
        MesFormationsRoutingModule,
        ListFormationsModule
    ]
})
export class MesFormationsModule { }
