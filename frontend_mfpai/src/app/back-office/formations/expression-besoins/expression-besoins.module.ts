import { NgModule } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';

import { ExpressionBesoinsRoutingModule } from './expression-besoins-routing.module';
import { EditCreateCampagneComponent } from './components/edit-create-campagne/edit-create-campagne.component';
import { ListCampagneComponent } from './components/list-campagne/list-campagne.component';
import { SingleCampagneComponent } from './components/single-campagne/single-campagne.component';
import { ViewCampagneComponent } from './components/view-campagne/view-campagne.component';
import { SoumettreExpressionComponent } from './components/soumettre-expression/soumettre-expression.component';
import { TraiterExpressionComponent } from './components/traiter-expression/traiter-expression.component';
import { SingleExpressionComponent } from './components/single-expression/single-expression.component';
import { ViewExpressionComponent } from './components/view-expression/view-expression.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { FormTraitementExpressionComponent } from './components/form-traitement-expression/form-traitement-expression.component';
import {EditExpressionComponent} from "./components/edit-expression/edit-expression.component";
import {NgxDropzoneModule} from "ngx-dropzone";


@NgModule({
  declarations: [
    EditCreateCampagneComponent,
    ListCampagneComponent,
    SingleCampagneComponent,
    ViewCampagneComponent,
    SoumettreExpressionComponent,
    TraiterExpressionComponent,
    SingleExpressionComponent,
    ViewExpressionComponent,
    FormTraitementExpressionComponent,
      EditExpressionComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        ExpressionBesoinsRoutingModule,
        NgxDropzoneModule,
    ]
})
export class ExpressionBesoinsModule { }
