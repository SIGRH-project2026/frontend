import { environment } from 'src/environments/environment';



import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, map, switchMap, take, finalize, shareReplay } from 'rxjs/operators';
import {CredentialsService} from "../services/credentials.service";


/*
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    constructor(

        private credentialsService: CredentialsService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.credentialsService.getCredentials();

        let clonedReq = req;
        if (accessToken) {
            clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }

        return next.handle(clonedReq).pipe(
            catchError(error => {
                console.log('error', error)
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    // Token expiré, on tente un refresh
                    console.log("Token expiré, on tente un refresh")
                    return this.handle401Error(clonedReq, next);
                }

                return throwError(() => error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.credentialsService.refreshAccessTokenBlacklist().pipe(
                switchMap((newToken: string) => {
                    this.isRefreshing = false;
                    this.credentialsService.setCredentials(newToken);
                    this.refreshTokenSubject.next(newToken);

                    return next.handle(
                        request.clone({
                            setHeaders: { Authorization: `Bearer ${newToken}` }
                        })
                    );
                }),
                catchError(err => {
                    this.isRefreshing = false;
                    this.credentialsService.logout();
                    return throwError(() => err);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token =>
                    next.handle(
                        request.clone({
                            setHeaders: { Authorization: `Bearer ${token}` }
                        })
                    )
                )
            );
        }
    }
}
*/


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private refreshRequest: Observable<string> | null = null;
    private refreshSessionToken: string | null = null;

    constructor(private credentialsService: CredentialsService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const target = new URL(req.url, window.location.origin);
        const api = new URL(environment.apiUrl, window.location.origin);
        if (target.origin !== api.origin || !target.pathname.startsWith(api.pathname)) {
            return next.handle(req);
        }
        const token = this.credentialsService.getCredentials();
        let clone = req;

        if (token && !req.headers.has('Authorization') && !/\/auth\/login(?:[/?]|$)/.test(req.url)) {
            clone = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        }

        return next.handle(clone).pipe(
            map(event => event instanceof HttpResponse
                ? event.clone({ body: this.normalizeResponse(event.body) })
                : event),
            catchError(err => {
                if (token && token === this.credentialsService.getCredentials() && this.requiresTokenRefresh(err, req)) {
                    return this.handle401(clone, next);
                }
                return throwError(() => err);
            })
        );
    }

    private requiresTokenRefresh(error: unknown, request: HttpRequest<any>): boolean {
        if (!(error instanceof HttpErrorResponse) || /\/auth\/(?:login|logout|refresh[^/?]*)(?:[/?]|$)/.test(request.url)) {
            return false;
        }

        const authenticationStatus = error.error?.status?.toString().toUpperCase();
        return error.status === 401
            || (error.status === 403 && authenticationStatus === 'UNAUTHORIZED');
    }

    /** Répare récursivement les chaînes UTF-8 anciennement décodées en Latin-1. */
    private normalizeResponse(value: any): any {
        if (typeof value === 'string') {
            return this.repairMojibake(value);
        }
        if (Array.isArray(value)) {
            return value.map(item => this.normalizeResponse(item));
        }
        if (value && typeof value === 'object' && !(value instanceof Blob)) {
            return Object.fromEntries(
                Object.entries(value).map(([key, item]) => [key, this.normalizeResponse(item)])
            );
        }
        return value;
    }

    private repairMojibake(value: string): string {
        if (!/[ÃÂâ]/.test(value)) {
            return value;
        }
        try {
            const bytes = Uint8Array.from(value, character => character.charCodeAt(0));
            return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        } catch {
            return value;
        }
    }

    private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const sessionToken = this.credentialsService.getCredentials();
        if (!this.refreshRequest || this.refreshSessionToken !== sessionToken) {
            this.refreshSessionToken = sessionToken;
            this.refreshRequest = this.credentialsService.refreshAccessTokenBlacklist().pipe(
                map(token => {
                    if (this.credentialsService.getCredentials() !== sessionToken) {
                        throw new Error('La session a changé pendant le renouvellement.');
                    }
                    this.credentialsService.setCredentials(token);
                    return token;
                }),
                catchError(err => {
                    if (this.credentialsService.getCredentials() === sessionToken) {
                        this.credentialsService.clearCredentials();
                        this.credentialsService.clearRefreshToken();
                        this.credentialsService.notifyLogout();
                    }
                    return throwError(() => err);
                }),
                finalize(() => {
                    if (this.refreshSessionToken === sessionToken) {
                        this.refreshRequest = null;
                        this.refreshSessionToken = null;
                    }
                }),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }
        return this.refreshRequest.pipe(switchMap(token => {
            if (this.credentialsService.getCredentials() !== token) {
                return throwError(() => new Error('La session a changé.'));
            }
            return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
        }));
    }
}
