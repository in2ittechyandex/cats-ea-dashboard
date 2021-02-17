import { AuthComponent } from './auth.component';
// import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { ErrorComponent } from './error-component/error-component.component';
import { Error401Component } from './error401-component/error401-component.component';

const routes: Routes = [
    {
        path: '', pathMatch: 'prefix',
        component: AuthComponent,
        children: [
            { path: 'login', component: LoginComponent },
            // { path: 'signup', component: SignupComponent },
            { path: 'authorization/:token', component: AuthorizationComponent },
            { path: 'not-found', component: ErrorComponent },
            { path: 'unauthorized', component: Error401Component },
            { path: '**', redirectTo: 'not-found' }
        ]
    }

];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})


export class AuthRoutingModule { }
