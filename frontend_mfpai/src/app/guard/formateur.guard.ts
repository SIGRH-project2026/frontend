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
export class FormateurGuard  {

  constructor(private _credentialsService: CredentialsService, private router: Router) {

  }
  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
    const allowedRoles = ['Formatteur'];
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

export const IsFormateurGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(FormateurGuard).canActivate(route, state);
}


