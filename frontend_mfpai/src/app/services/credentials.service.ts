import {Injectable, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import {Credentials, UserToken} from "../models/auth-response";

import { jwtDecode } from "jwt-decode";
import {environment} from "../../environments/environment";
import {AuthResponseApi} from "../models/response-api.model";
import {Observable, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class CredentialsService implements OnDestroy {
    private storageListener = this.handleStorageEvent.bind(this);
    constructor(private http: HttpClient, private router: Router) {
        window.addEventListener('storage', this.storageListener);
    }

    ngOnDestroy(): void {
        window.removeEventListener('storage', this.storageListener);
    }

    private handleStorageEvent(event: StorageEvent) {
        if (event.key === 'logout') {
            this.logout();
        }
    }
 private  readonly _credentials = "Token";
 private  readonly _refreshToken = "refreshToken";

 apiUrl: string = environment.apiUrl;

  setCredentials(token: string): void {
    localStorage.setItem(this._credentials, token);
  }

    refreshToken():     Observable<AuthResponseApi> {
      const refresh = this.getRefreshToken();
      const API_URL = `${this.apiUrl}auth/refresh-token`;
      return this.http.post<AuthResponseApi>(API_URL,  { refreshToken: refresh })
  }


    refreshAccessToken(): Observable<string> {
        const refresh = this.getRefreshToken();

        if (refresh==null || refresh=='') {
            // Optionnel : tu peux déclencher une déconnexion ici
            console.log("Refresh token not found");
            return throwError(() => new Error("Aucun refresh token disponible"));
        }

        const API_URL = `${this.apiUrl}auth/refresh-token`;

        return this.http.post<AuthResponseApi>(API_URL, { refreshToken: refresh }).pipe(
            map(res => {

                const newAccessToken = res?.payload?.refreshToken || res?.payload?.token || null;
                if (!newAccessToken) {
                    throw new Error("Nouveau accessToken non reçu");
                }
                return newAccessToken;
            })
        );
    }

    refreshAccessTokenBlacklist(): Observable<string> {
        const refresh = this.getRefreshToken();


        if (refresh==null || refresh=='') {
            // Optionnel : tu peux déclencher une déconnexion ici
            // console.log("Refresh token not found");
            return throwError(() => new Error("Aucun refresh token disponible"));
        }

        const API_URL = `${this.apiUrl}auth/refresh`;


        return this.http.post<AuthResponseApi>(API_URL, { refreshToken: refresh }).pipe(
            map(res => {

                const newAccessToken = res?.payload?.refreshToken || res?.payload?.token || null;
               // console.log('newAccessToken ', newAccessToken)
                if (!newAccessToken) {
                    throw new Error("Nouveau accessToken non reçu");
                }
                return newAccessToken;
            })
        );
    }



    setRefreshToken(refreshToken: string): void {
       localStorage.setItem(this._refreshToken, refreshToken);

    }


    getCredentials(): string | null {

    return localStorage.getItem(this._credentials);
  }

    getRefreshToken(): string | null {

        return localStorage.getItem(this._refreshToken);
    }

  clearCredentials(): void {
    localStorage.removeItem(this._credentials);
  }

    clearRefreshToken(): void {
        localStorage.removeItem(this._refreshToken);
    }





    notifyLogout() {
        // Met à jour une clé dans localStorage pour déclencher l'événement storage dans les autres onglets
        localStorage.setItem('logout', Date.now().toString());
    }



  decodeToken(jwtToken: string): any {
    try {
      if (!jwtToken) {
        return null;
      }
      return jwtDecode(jwtToken);
    } catch (error) {
      return null;
    }
  }

    getTokenExpirationTime(token: string): number {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000; // `exp` est en secondes
        } catch (e) {
            return 0;
        }
    }


  isTokenExpired(token:string|null): boolean {
    try {

      if (token==null) {
        return  false;
      }
      const decodedToken: any = this.decodeToken(token);
      const now = Date.now() / 1000;
      return decodedToken.exp && decodedToken.exp < now;
    } catch (error) {
      return true;
    }
  }

  getAuthorities(): string | null {
    try {
      const jwtToken = this.getCredentials();
      if (!jwtToken) {
        return null;
      }

      const decodedToken: any = jwtDecode(jwtToken);
      return JSON.stringify (decodedToken.authorities[0]);
    } catch (error) {
      return null;
    }
  }

  getUsername(): string | null {
    try {
      const jwtToken = this.getCredentials();
      if (!jwtToken) {
        return null;
      }
      const decodedToken: any = jwtDecode(jwtToken);
     //const username: string | undefined = decodedToken.username;
      const username: string | undefined = decodedToken?.infos?.login

      return username ?? null;
    } catch (error) {
      return null;
    }
  }

  get userMenus(): any | null {
        return this. getUserInfos()?.profil.map(pro => pro.menus);
    }

    get userProfils(): any | null {

        return this. getUserInfos()?.profil.map(pro => pro.code);
    }

  getUserInfos(): UserToken | null {
    try {
      const jwtToken = this.getCredentials();

      if (!jwtToken) {
        return null;
      }

      const decodedToken: any = jwtDecode(jwtToken);

      const userInfos: UserToken | null = decodedToken.infos;

      return userInfos ?? null;
    } catch (error) {
      return null;
    }
  }

    logout(): void {
        const API_URL = `${this.apiUrl}auth/logout`;
        this.http.post(API_URL, {  }).subscribe({
            next: () => {
                localStorage.clear();
                //this.router.navigate(['/auth/login']);
                this.notifyLogout()
            },
            error: (err) => {
                console.error('Erreur lors du logout', err);
                localStorage.clear();

            }
        });


    }


}
