import { Error401Component } from './error401-component/error401-component.component';
import { ErrorComponent } from './error-component/error-component.component';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
// import { SignupComponent } from './signup/signup.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { AuthServices } from './auth.services';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthServices],
  declarations: [
    LoginComponent,
    // SignupComponent,
    AuthComponent,
    AuthorizationComponent,
    ErrorComponent,
    Error401Component,
    LoginComponent],
    bootstrap: [AuthComponent]
}, )
export class AuthModule {}
