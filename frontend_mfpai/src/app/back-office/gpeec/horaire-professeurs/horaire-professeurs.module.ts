import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HoraireProfesseursRoutingModule } from './horaire-professeurs-routing.module';
import { ListDesMatiereDeficitsComponent } from './components/list-des-matiere-deficits/list-des-matiere-deficits.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { DetailHoraireProfesseurComponent } from './components/detail-horaire-professeur/detail-horaire-professeur.component';


@NgModule({
  declarations: [
    ListDesMatiereDeficitsComponent,
    DetailHoraireProfesseurComponent
  ],
  imports: [
    CommonModule,
    HoraireProfesseursRoutingModule,
    SharedModule,
    MaterialUiModule,
  ]
})
export class HoraireProfesseursModule { }
