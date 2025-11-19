import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NiveauDeconcentreRoutingModule } from './niveau-deconcentre-routing.module';
import { ListUtilisateurComponent } from './components/list-utilisateur/list-utilisateur.component';
import { CreateUtilisateurComponent } from './components/create-utilisateur/create-utilisateur.component';
import { EditUtilisateurComponent } from './components/edit-utilisateur/edit-utilisateur.component';
import { ViewUtilisateurComponent } from './components/view-utilisateur/view-utilisateur.component';
import { SingleUtilisateurComponent } from './components/single-utilisateur/single-utilisateur.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";


@NgModule({
  declarations: [
    ListUtilisateurComponent,
    CreateUtilisateurComponent,
    EditUtilisateurComponent,
    ViewUtilisateurComponent,
    SingleUtilisateurComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NiveauDeconcentreRoutingModule,
    NgxMaskDirective, NgxMaskPipe
  ],
  providers: [provideNgxMask()]

})
export class NiveauDeconcentreModule { }
