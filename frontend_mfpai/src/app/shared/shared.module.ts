import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { MainguestComponent } from './layouts/mainguest/mainguest.component';
import { MainComponent } from './layouts/main/main.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MaterialUiModule } from './material-ui/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StatusDirective } from './helpers/directives/status.directive';
import { MainPortailComponent } from './layouts/main-portail/main-portail.component';
import { FooterPortailComponent } from './layouts/footer-portail/footer-portail.component';
import { CanProcessDirective } from './helpers/directives/can-process.directive';

@NgModule({
  declarations: [
    SidebarComponent,
    MainguestComponent,
    MainComponent,
    LoadingSpinnerComponent,
    BreadcrumbComponent,
    StatusDirective,
    MainPortailComponent,
    FooterPortailComponent,
    CanProcessDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbAccordionModule,
    RouterModule,
    MaterialUiModule,
    NgxSpinnerModule
  ],
    exports: [
    SidebarComponent,
    MainComponent,
    MainguestComponent,
    BreadcrumbComponent,
    StatusDirective,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbAccordionModule,
    NgxSpinnerModule,
      LoadingSpinnerComponent,
    FooterPortailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
