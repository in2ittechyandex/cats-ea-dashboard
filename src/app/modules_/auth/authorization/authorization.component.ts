import { UserService } from 'src/app/services_/user.services';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { LoggedUser } from 'src/app/models_/loggeduser';

@Component({
  selector: 'cats-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute,
    private router: Router, private userService_: UserService) {

  }

  ngOnInit() {
    localStorage.clear();
  }

  ngAfterViewInit() {
    this.loadInitData();
  }

  public loadInitData() {
    this.checkRouteParam_();
  }

  public checkRouteParam_() {
    this.route.params.subscribe((params: Params) => {
      this.validateRouteParam();
    });
  }


  public validateRouteParam() {
    const authorizationToken = this.route.snapshot.params['token'];
    if (authorizationToken && (authorizationToken != '' || authorizationToken != undefined)) {
      this.validateAuthToken(authorizationToken);
    } else {
      this.router.navigate(['/auth/not-found']);
    }
  }

  public setTokenToLocalStorage(token) {
    localStorage.setItem('currentUser', JSON.stringify({ 'access_token': token }));
  }

  public validateAuthToken(token) {
    // TODO : validate auth token here & redirect to url
    this.setTokenToLocalStorage(token);
    this.getLoggedUserDetails();

  }


  public getLoggedUserDetails() {
    this.userService_.getLoggedInUserDetails().subscribe(res => {
      if (res['status']) {
        const loggedUser: LoggedUser = new LoggedUser(res['data']);
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        this.router.navigate(['/dashboard/home']);
      } else {
        // TODO log error / mail
        this.router.navigate(['/dashboard/home']);
      }
    }, err => {
      this.router.navigate(['/dashboard/home']);
    });




}


}
