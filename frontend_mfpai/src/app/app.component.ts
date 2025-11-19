import {Component, OnInit} from '@angular/core';
import {ReferencesService} from "./services/references.service";
import {SessionTimeoutService} from "./session-timeout.service";
import {IdleService} from "./idle.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend_mfpai';

  constructor(
     // private sessionTimeoutService: SessionTimeoutService,
      private idleService: IdleService,
  ) {
  }


}
