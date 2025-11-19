import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputationBulletinDeVisiteRoutingModule } from './inputation-bulletin-de-visite-routing.module';
import { ListeDesImputationsBulletinComponent } from './components/liste-des-imputations-bulletin/liste-des-imputations-bulletin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailsImputationBulletinComponent } from './components/details-imputation-bulletin/details-imputation-bulletin.component';
import { MaterialUiModule } from 'src/app/shared/material-ui/material.module';
import { AddImputationBulletinComponent } from './components/add-imputation-bulletin/add-imputation-bulletin.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SearchImputationPipe } from '../Pipes/Search.imputation.pipe';


@NgModule({
  declarations: [
    ListeDesImputationsBulletinComponent,
    DetailsImputationBulletinComponent,
    AddImputationBulletinComponent,
    SearchImputationPipe
  ],
  imports: [
    CommonModule,
    InputationBulletinDeVisiteRoutingModule,
    SharedModule,
    MaterialUiModule,
    NgxDropzoneModule,
  ]
})
export class InputationBulletinDeVisiteModule { }
