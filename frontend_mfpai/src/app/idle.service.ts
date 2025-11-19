import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from './services/credentials.service';
import Swal from "sweetalert2";

@Injectable({ providedIn: 'root' })
export class IdleService {
    private readonly timeoutInMs = 5 * 60 * 1000; // 5 minutes
    private readonly warningBeforeMs = 30 * 1000; // Alerte 30s avant
    private readonly checkInterval = 10 * 1000;   // Vérifie token chaque 10s

    private logoutTimer: any;
    private warningTimer: any;
    private checkTokenTimer: any;
    private lastActivity: number = Date.now();
    private alreadyLoggedOut = false;

    constructor(
        private router: Router,
        private credentialsService: CredentialsService
    ) {
        this.startWatchingUserActivity();
        this.startCheckingTokenExpirationBis();
    }

    /**
     * Écoute les événements de l'utilisateur
     */
    private startWatchingUserActivity(): void {
        ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event =>
            document.addEventListener(event, () => {
                this.lastActivity = Date.now();
                this.resetTimers();
            })
        );
    }

    /**
     * Réinitialise les timers d'inactivité
     */
    private resetTimers(): void {
        const token = this.credentialsService.getCredentials();

        if (token && !this.credentialsService.isTokenExpired(token)) {
            this.clearTimers();
            // Vérifier si le token expire bientôt (dans 30s) → forcer refresh
            const expirationTime = this.credentialsService.getTokenExpirationTime(token);
            const now = Date.now();

           // console.log("expirationTime", expirationTime)
            if (expirationTime - now <= this.warningBeforeMs) {
                this.credentialsService.refreshAccessTokenBlacklist().subscribe({
                    next: (newToken: string) => {
                        this.credentialsService.setCredentials(newToken);
                        this.lastActivity = Date.now();
                    },
                    error: () => this.logout()
                });
            }

            // Timer d’avertissement
            this.warningTimer = setTimeout(() => {
                this.showCountdownWarning();
            }, this.timeoutInMs - this.warningBeforeMs);

            // Timer de déconnexion
            this.logoutTimer = setTimeout(() => {
                this.logout();
            }, this.timeoutInMs);
        }
    }
    private startCheckingTokenExpirationBis(): void {
        this.checkTokenTimer = setInterval(() => {
            const token = this.credentialsService.getCredentials();

            if(typeof token === 'undefined') {
                console.warn("Aucun token trouvé. Déconnexion.");
                return;
            }

            if (!token) {
                return;
            }

            const isExpired = this.credentialsService.isTokenExpired(token);
            const isInactive = this.isUserInactive();

            if (isExpired) {
               // if (isInactive) {
                if (!isInactive) {
                    console.info("Token expiré et utilisateur inactif. Déconnexion.");
                    this.logout();
                } else {
                    this.credentialsService.refreshAccessTokenBlacklist().subscribe({
                        next: (newToken: string) => {
                            if (newToken) {
                                this.credentialsService.setCredentials(newToken);
                                this.lastActivity = Date.now();
                               // this.resetTimers();
                            } else {
                                this.logout();
                            }
                        },
                        error: (err) => {
                            this.logout();
                        }
                    });
                }
            }
        }, this.checkInterval);
    }
    /**
     * Vérifie régulièrement l’état du token
     */
    private startCheckingTokenExpiration(): void {
        this.checkTokenTimer = setInterval(() => {
            const token = this.credentialsService.getCredentials();
            const isExpired = this.credentialsService.isTokenExpired(token);
            const isInactive = this.isUserInactive();

            if (isExpired) {
                if (isInactive) {
                    this.logout();
                } else {
                    this.credentialsService.refreshAccessTokenBlacklist().subscribe({
                        next: (newToken: string) => {
                            this.credentialsService.setCredentials(newToken);
                            this.lastActivity = Date.now();
                            this.resetTimers();
                        },
                        error: () => this.logout()
                    });
                }
            }
        }, this.checkInterval);
    }

    private isUserInactive(): boolean {
        return (Date.now() - this.lastActivity) > this.timeoutInMs;
    }

    private clearTimers(): void {
        if (this.logoutTimer) clearTimeout(this.logoutTimer);
        if (this.warningTimer) clearTimeout(this.warningTimer);
    }

    private logout(): void {
        if (this.alreadyLoggedOut) return;
        this.alreadyLoggedOut = true;

        this.clearTimers();

        if (Swal.isVisible()) Swal.close();

        const token = this.credentialsService.getCredentials();

        if(typeof token === 'undefined') {
            console.warn("Aucun token trouvé. Déconnexion.");
            return;
        }
        this.credentialsService.logout();
        this.router.navigate(['/auth/login']);
    }

    private showCountdownWarning(): void {
        let countdown = 30;
        let interval: any;

        Swal.fire({
            icon: 'warning',
            title: 'Inactivité détectée',
            html: `<div style="font-size: 18px; margin-top: 10px;">
                Vous serez déconnecté dans <b style="color: red; font-size: 22px;">${countdown}</b> secondes.
            </div>`,
            timer: this.warningBeforeMs,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: true,
            confirmButtonText: 'Rester connecté',
            didOpen: () => {
                const b = Swal.getHtmlContainer()?.querySelector('b');
                interval = setInterval(() => {
                    countdown--;
                    if (b) b.textContent = countdown.toString();
                }, 1000);
            },
            willClose: () => clearInterval(interval)
        }).then(result => {
            if (result.isConfirmed) {
                this.lastActivity = Date.now();
                this.resetTimers();
            }
        });
    }
}
