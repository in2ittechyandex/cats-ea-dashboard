import { LoggedUser } from './../models_/loggeduser';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPermissionGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('CustomPermissionGuard Working canActivate');
    // We use this f/n to manage permission for parent route
    // TODO : get role we mentioned inside routing.ts
    const toBeAllowedFor = <Array<any>>(next.data['rolesPerm'] ? next.data['rolesPerm'] : []);

    // TODO : get role list from backend / localStorage
    let loggedUser: LoggedUser;
    if (localStorage.getItem('loggedUser') != null) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }

    const dbRoles = (loggedUser && loggedUser.perm_) ? loggedUser.perm_ : [];

    // const matchedPermission = toBeAllowedFor.filter(elm => {
    //   return (dbRoles.indexOf(elm) > -1);
    // });

    // TODO : if role is valid then go
    // const allowAccess = (matchedPermission.length == toBeAllowedFor.length); // (toBeAllowedFor.indexOf(dbRole) > -1);

    // if (allowAccess) {
    //   return true;
    // } else {
    //   this.router.navigate(['auth/unauthorized']);
    // }

    // otherwise return
    //WARNING :Hardcode
    return true;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('CustomPermissionGuard Working CanActivateChild');
    // We use this f/n to manage permission for child route
    // TODO : get role we mentioned inside routing.ts
    const toBeAllowedFor = <Array<any>>(next.data['rolesPerm'] ? next.data['rolesPerm'] : []);

    // TODO : get role list from backend / localStorage
    let loggedUser: LoggedUser;
    if (localStorage.getItem('loggedUser') != null) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    const dbRoles = (loggedUser && loggedUser.perm_) ? loggedUser.perm_ : []; // per/sub perm

    // const matchedPermission = toBeAllowedFor.filter(elm => {
    //   return (dbRoles.indexOf(elm) > -1);
    // });
    // TODO : if role is valid then go
    // const allowAccess = (matchedPermission.length == toBeAllowedFor.length);
    // if (allowAccess) {
    //   return true;
    // } else {
    //   this.router.navigate(['auth/unauthorized']);
    // }

    // WARNING hardcode
    return true;

  }
}
