import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {CredentialsService} from "./services/credentials.service";
/*
@Injectable({
    providedIn: 'root'
})*/
export class SessionTimeoutService {
    private timeout: any;
    //private readonly TIMEOUT_DURATION = 1 * 60 * 1000; // 1 minutes
    private readonly TIMEOUT_DURATION = 5 * 60 * 1000; // 1 minutes

    constructor(private router: Router, private ngZone: NgZone,
                private credentialsService: CredentialsService) {
    this.startTimer();
        this.listenUserActivity();
    }

    private startTimer() {
        this.clearTimer();
        this.timeout = setTimeout(() => {
          //  alert('Votre session a expiré. Vous allez être redirigé vers la page de connexion.');


            this.credentialsService.logout();
            this.router.navigate(['/auth/login']);
        }, this.TIMEOUT_DURATION);
    }

    private clearTimer() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    private listenUserActivity() {
        const events = ['mousemove', 'keydown', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => this.resetTimer());
        });
    }

    private resetTimer() {
        this.ngZone.run(() => this.startTimer());
    }
}
