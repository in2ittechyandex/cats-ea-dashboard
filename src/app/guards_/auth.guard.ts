import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    /**
     *
     * @param route  current route object
     * @param state  route state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = localStorage.getItem('currentUser');
        if (environment.gateWayAuthorization) {
            // TODO : we will use gateway for authorization
            if (currentUser && JSON.parse(currentUser).access_token != '') {
                return true;
            }
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/auth/unauthorized'], { queryParams: { returnUrl: state.url } });
            return false;
        } else {
            // TODO : No Need to Use any Gateway <all request will proceeds with 'userName' provided inside interceptors>
            return true;
        }
    }

}
