import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesDemandesMutationPermutationRoutingModule } from './mes-demandes-mutation-permutation-routing.module';
import { CreateMutationComponent } from './components/create-mutation/create-mutation.component';
import { EditMutationComponent } from './components/edit-mutation/edit-mutation.component';
import { ViewMutationComponent } from './components/view-mutation/view-mutation.component';
import { SingleMutationComponent } from './components/single-mutation/single-mutation.component';
import { EditPermutationComponent } from './components/edit-permutation/edit-permutation.component';
import { CreatePermutationComponent } from './components/create-permutation/create-permutation.component';
import { ViewPermutationComponent } from './components/view-permutation/view-permutation.component';
import { ListMutationPermutationComponent } from './components/list-mutation-permutation/list-mutation-permutation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { TraitementMutationComponent } from './components/traitement-mutation/traitement-mutation.component';
import { SearchPermutationPipe } from '../Pipes/Search.permutation.pipe';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PermutationPiecesJointesComponent } from '../shared-permutation/permutation-pieces-jointes/permutation-pieces-jointes.component';
import { PermutationSignatureComponent } from '../shared-permutation/permutation-signature/permutation-signature.component';

@NgModule({
  declarations: [
    CreateMutationComponent,
    EditMutationComponent,
    ViewMutationComponent,
    SingleMutationComponent,
    EditPermutationComponent,
    CreatePermutationComponent,
    ViewPermutationComponent,
    ListMutationPermutationComponent,
    TraitementMutationComponent,
    SearchPermutationPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialUiModule,
    NgxDropzoneModule,
    PermutationPiecesJointesComponent,
    PermutationSignatureComponent,
    MesDemandesMutationPermutationRoutingModule
  ]
})
export class MesDemandesMutationPermutationModule { }
