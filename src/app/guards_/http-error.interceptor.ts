import { Router } from '@angular/router';
import {
 HttpEvent,
 HttpInterceptor,
 HttpHandler,
 HttpRequest,
 HttpResponse,
 HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

 intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return next.handle(request)
     .pipe(
       retry(1),
       catchError((error: HttpErrorResponse) => {
         let errorMessage = '';
         if (error.error instanceof ErrorEvent) {
           // client-side error
           errorMessage = `Error: ${error.error.message}`;
         } else {
           // server-side error
           errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
         }
        //  window.alert(errorMessage);
        if (error.status === 401) {
           this.router.navigate(['/auth/unauthorized']);
        }
        // this.router.navigate(['/auth/not-found']);
         return throwError(errorMessage);
       })
     );
 }
}
