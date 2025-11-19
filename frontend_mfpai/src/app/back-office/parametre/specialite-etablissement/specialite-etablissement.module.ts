import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialiteEtablissementRoutingModule } from './specialite-etablissement-routing.module';
import { ListeSpecialiteEtablissementComponent } from './components/liste-specialite-etablissement/liste-specialite-etablissement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListeSpecialiteEtablissementComponent],
  imports: [
    CommonModule,
    SpecialiteEtablissementRoutingModule,
    TagInputModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SpecialiteEtablissementModule {}
