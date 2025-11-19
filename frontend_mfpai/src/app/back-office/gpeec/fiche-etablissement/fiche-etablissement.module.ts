import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FicheEtablissementRoutingModule } from './fiche-etablissement-routing.module';
import { ListFicheComponent } from './components/list-fiche/list-fiche.component';
import { AddFicheComponent } from './components/add-fiche/add-fiche.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { TagInputModule } from 'ngx-chips';
import { AddFiliereComponent } from './components/add-filiere/add-filiere.component';
import { AddClasseComponent } from './components/add-classe/add-classe.component';


@NgModule({
  declarations: [
    ListFicheComponent,
    AddFicheComponent,
    AddFiliereComponent,
    AddClasseComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule,
    SharedModule,
    TagInputModule,
    FicheEtablissementRoutingModule
  ]
})
export class FicheEtablissementModule { }
