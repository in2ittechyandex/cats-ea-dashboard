import { CustomPermissionGuard } from './guards_/custom-permission.guard';

import { AppRoutingModule } from './app.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule, MatTableModule } from '@angular/material';

// Main Component
import { AppComponent } from './app.component';

// Alert Directive
import { AlertDirective } from './directives_/alert.directive';

// Configurations
// import * as global from './config/globals';

// App LayOuts
import { LayoutsModule } from './modules_/layouts/layouts.module';

// Page Loader
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { AuthGuard } from './guards_/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedServices } from './shared_/shared.services';
import { SharedModule } from './shared_/shared.module';
import { HttpErrorInterceptor } from './guards_/http-error.interceptor';
import { AddHeaderInterceptor } from './guards_/headers.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from './config/app.config';

// import {DragDropModule} from '@angular/cdk/drag-drop';


export function initConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    AlertDirective,

  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    SlimLoadingBarModule.forRoot(),
    LayoutsModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    NgbModule,
    // DragDropModule
  ],

  providers: [
    Title,
    AuthGuard,
    CustomPermissionGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true
    },
    SharedServices,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    }
  ], // , ReportService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(private router: Router, private titleService: Title, private route: ActivatedRoute) {
  //   router.events.subscribe((e) => {
  //     if (e instanceof NavigationEnd) {
  //       var title = 'CATS User | ' + this.route.snapshot.data['title'];
  //       this.titleService.setTitle(title);
  //     }
  //   });
  // }
}
