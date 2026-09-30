import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandesMutationPermutationRecuesRoutingModule } from './demandes-mutation-permutation-recues-routing.module';
import { EditMutationComponent } from './components/edit-mutation/edit-mutation.component';
import { ViewMutationComponent } from './components/view-mutation/view-mutation.component';
import { SingleMutationComponent } from './components/single-mutation/single-mutation.component';
import { EditPermutationComponent } from './components/edit-permutation/edit-permutation.component';
import { ViewPermutationComponent } from './components/view-permutation/view-permutation.component';
import { ListMutationPermutationComponent } from './components/list-mutation-permutation/list-mutation-permutation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PermutationPiecesJointesComponent } from '../shared-permutation/permutation-pieces-jointes/permutation-pieces-jointes.component';


@NgModule({
  declarations: [
    EditMutationComponent,
    ViewMutationComponent,
    SingleMutationComponent,
    EditPermutationComponent,
    ViewPermutationComponent,
    ListMutationPermutationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialUiModule,
    NgxDropzoneModule,
    PermutationPiecesJointesComponent,
    DemandesMutationPermutationRecuesRoutingModule
  ]
})
export class DemandesMutationPermutationRecuesModule { }
