import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {TokenInterceptor} from "./guard/token.interceptor";

import {NgxSpinnerModule} from "ngx-spinner";
import {AuthGuard} from "./guard/auth.guard";
import {RoleGuard} from "./guard/role.guard";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    // MatInputModule,
    // MatFormFieldModule

    SharedModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
    },
 AuthGuard, RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
