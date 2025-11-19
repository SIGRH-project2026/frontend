import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechercheGlobaleRoutingModule } from './recherche-globale-routing.module';
import { ListUtilisateurComponent } from './components/list-utilisateur/list-utilisateur.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeProfilComponent } from './components/change-profil/change-profil.component';


@NgModule({
  declarations: [
    ListUtilisateurComponent,
    ChangeProfilComponent
  ],
  imports: [
    CommonModule,
    RechercheGlobaleRoutingModule,
    SharedModule,
  ]
})
export class RechercheGlobaleModule { }
