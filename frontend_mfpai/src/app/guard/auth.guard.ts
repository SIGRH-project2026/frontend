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
      state: RouterStateSnapshot): boolean {
    const token: string | null = this._credentialsService.getCredentials();

    if (token != null) {
      if (this._credentialsService.isTokenExpired(token)) {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
        this._credentialsService.clearCredentials();
        return false;
      } else {
        return true;
      }
    }
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;

  }



}

export const IsAuthGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuard).canActivate(route, state);
}


