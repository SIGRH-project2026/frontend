import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FonctionRoutingModule } from './fonction-routing.module';
import { ListeDesFonctionsComponent } from './components/liste-des-fonctions/liste-des-fonctions.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListeDesFonctionsComponent
  ],
  imports: [
    CommonModule,
    FonctionRoutingModule,
    SharedModule
  ]
})
export class FonctionModule { }
