


import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
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
    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    constructor(private credentialsService: CredentialsService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.credentialsService.getCredentials();
        let clone = req;

        if (token) {
            clone = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        }

        return next.handle(clone).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    return this.handle401(clone, next);
                }
                return throwError(() => err);
            })
        );
    }

    private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.credentialsService.refreshAccessTokenBlacklist().pipe(
                switchMap(token => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token);
                    return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
                }),
                catchError(err => {
                    this.credentialsService.logout();
                    return throwError(() => err);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token =>
                    next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
                )
            );
        }
    }
}
