import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {CredentialsService} from "../services/credentials.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private _credentialsService: CredentialsService, private router: Router) {

  }
  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean | UrlTree {
    const token: string | null = this._credentialsService.getCredentials();

    if (token != null) {
      if (this._credentialsService.isTokenExpired(token)) {
        this._credentialsService.clearCredentials();
      } else {
        return true;
      }
    }
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });

  }



}

export const IsAuthGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  return inject(AuthGuard).canActivate(route, state);
}

