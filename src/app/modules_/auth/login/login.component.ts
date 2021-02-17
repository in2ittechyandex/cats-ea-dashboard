import { UserService } from './../../../services_/user.services';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import pageSettings from '../../../config/page-settings';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { AuthServices } from '../auth.services';

@Component({
  selector: 'cats-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  pageSettings = pageSettings;

  constructor(
    private titleService: Title,
    private router: Router,
    private renderer: Renderer2,
    private userService: UserService,
    private authService: AuthServices
  ) {
    const title = 'CatsDashboardV2';
    this.titleService.setTitle(title);
    this.pageSettings.pageEmpty = true;
    this.renderer.addClass(document.body, 'bg-white');
  }

  public lStr = {
    userName: '',
    password: ''
  };
  public checked = false;



  ngOnInit() {
    if (localStorage.getItem('remember')) {
      const remember: any = localStorage.getItem('remember');
      localStorage.clear();
      localStorage.setItem('remember', remember);

      this.checked = true;
      const Credential = JSON.parse(remember);
      this.lStr.userName = Credential.userName;
      this.lStr.password = Credential.password;
    } else {
      this.checked = false;
      this.lStr.userName = '';
      this.lStr.password = '';
      localStorage.clear();
    }
  }

  ngOnDestroy() {
    this.pageSettings.pageEmpty = false;
    this.renderer.removeClass(document.body, 'bg-white');
  }


  // formSubmit(f: NgForm) {
  //   if ((f.controls['userName'].value === 'cats') && (f.controls['password'].value === 'cats@123')) {
  //     if (f.controls['remember'].value !== '' && f.controls['remember'].value === true) {
  //       const rememberMe = { 'userName': f.controls['userName'].value, 'password': f.controls['password'].value };
  //       localStorage.setItem('remember', JSON.stringify(rememberMe));
  //     } else {
  //       localStorage.removeItem('remember');
  //     }
  //     const currentUser = {
  //       access_token: f.controls['userName'].value + '-' + f.controls['password'].value
  //     };
  //     localStorage.setItem('currentUser', JSON.stringify(currentUser));
  //     this.router.navigate(['services']);
  //   } else {
  //     swal('Invalid Credential', '', 'warning');
  //   }
  // }

  formSubmit(f: NgForm) {

    if ((f.controls['userName'].value.trim() !== '') && (f.controls['password'].value.trim() !== '')) {
      if (f.controls['remember'].value !== '' && f.controls['remember'].value === true) {
        const rememberMe = { 'userName': f.controls['userName'].value, 'password': f.controls['password'].value };
        localStorage.setItem('remember', JSON.stringify(rememberMe));
      } else {
        localStorage.removeItem('remember');
      }

      this.authService.login(f.controls['userName'].value, f.controls['password'].value)
        .subscribe(res => {
          if (res['status'] == true) {
            // TODO : parse response
            const currentUser = {
              access_token: res['data']['token'],
              userName : res['data']['userName']
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.router.navigate(['dashboard/home']);
          } else {
            // TODO : get handled error mszz
          }
          console.log(res);
        }, err => {

        })


    } else {
      swal('Invalid Credential', '', 'warning');
    }
  }



  // Toggle password view
  viewPassword() {
    const type = document.getElementById('password').attributes['type'].value;
    $('#crossEye').toggleClass('fa-eye-slash');  // Cross over eye icon
    if (type === 'password') {
      document.getElementById('password').attributes['type'].value = 'text';
    } else {
      document.getElementById('password').attributes['type'].value = 'password';
    }
  }


}
