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
export class TraitementExpressionDeBesoinGuard  {

  constructor(private _credentialsService: CredentialsService, private router: Router) {

  }
  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
    const allowedRoles = ['Chef-division-dfc', 'Chef-bureau-dfc', 'Agent-bureau-dfc'];
    let  role = this._credentialsService.getUserInfos()?.profil[0].code;
    if (!allowedRoles.includes(role!)) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false
    }
    return true;
  }



}

export const IsTraitementExpressionDeBesoinGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(TraitementExpressionDeBesoinGuard).canActivate(route, state);
}


