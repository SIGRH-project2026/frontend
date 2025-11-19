import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
