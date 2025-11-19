import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NiveauCentralRoutingModule } from './niveau-central-routing.module';
import { SingleUtilisateurComponent } from './components/single-utilisateur/single-utilisateur.component';
import { EditUtilisateurComponent } from './components/edit-utilisateur/edit-utilisateur.component';
import { CreateUtilisateurComponent } from './components/create-utilisateur/create-utilisateur.component';
import { ListUtilisateurComponent } from './components/list-utilisateur/list-utilisateur.component';
import { ViewUtilisateurComponent } from './components/view-utilisateur/view-utilisateur.component';
import { SharedModule } from '../../../shared/shared.module';
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";


@NgModule({
  declarations: [
    SingleUtilisateurComponent,
    EditUtilisateurComponent,
    CreateUtilisateurComponent,
    ListUtilisateurComponent,
    ViewUtilisateurComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        NiveauCentralRoutingModule,
        NgxMaskDirective, NgxMaskPipe
    ],
    providers: [provideNgxMask()]
})
export class NiveauCentralModule { }
