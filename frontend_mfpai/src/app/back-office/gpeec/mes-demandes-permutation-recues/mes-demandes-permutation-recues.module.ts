import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesDemandesPermutationRecuesRoutingModule } from './mes-demandes-permutation-recues-routing.module';
import { SingleMutationComponent } from './components/single-mutation/single-mutation.component';
import { EditPermutationComponent } from './components/edit-permutation/edit-permutation.component';
import { ViewPermutationComponent } from './components/view-permutation/view-permutation.component';
import { ListPermutationComponent } from './components/list-permutation/list-permutation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Search2PermutationPipe } from '../Pipes/Search2.permutation.pipe';
import { PermutationPiecesJointesComponent } from '../shared-permutation/permutation-pieces-jointes/permutation-pieces-jointes.component';
import { PermutationSignatureComponent } from '../shared-permutation/permutation-signature/permutation-signature.component';


@NgModule({
  declarations: [
    SingleMutationComponent,
    EditPermutationComponent,
    ViewPermutationComponent,
    ListPermutationComponent,
    Search2PermutationPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialUiModule,
    NgxDropzoneModule,
    PermutationPiecesJointesComponent,
    PermutationSignatureComponent,
    MesDemandesPermutationRecuesRoutingModule
  ]
})
export class MesDemandesPermutationRecuesModule { }
