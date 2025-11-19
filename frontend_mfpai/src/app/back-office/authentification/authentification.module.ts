import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthentificationRoutingModule } from './authentification-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthentificationRoutingModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class AuthentificationModule { }
