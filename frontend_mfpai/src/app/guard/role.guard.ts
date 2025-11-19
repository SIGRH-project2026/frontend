import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, Router, RouterStateSnapshot} from '@angular/router';
import {CredentialsService} from "../services/credentials.service";
import {AlertService} from "../shared/commons/alert.service";




@Injectable()
export class RoleGuard {
  constructor(
    private credentialsService: CredentialsService,
    private alertService: AlertService,
    private router: Router
  ) {
  }

  canActivate( route: ActivatedRouteSnapshot,
               state: RouterStateSnapshot): boolean {
    const authorizedRoles = route?.data?.['role']; // role 


    const userRoles = this.credentialsService.userProfils[0];

    if (authorizedRoles.includes('*')) {
      return true;
    }

   // console.log(userRoles.includes(authorizedRoles))
   // console.log(authorizedRoles)
   // if (authorizedRoles.includes(userRoles[0])) {
    if (authorizedRoles.includes(userRoles)) {
      return true;
    } else {
      this.alertService.showAlert({
        status: 'ACCESS_DENIED',
        message: 'Vous n\'avez pas la permission d\'accéder à cette ressource !',
        titre: 'Autorisations'
      });

      this.router.navigateByUrl('/dashboard');
      return false;
    }
  }
}


export const IsRoleGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(RoleGuard).canActivate(route, state);
}
