import { environment } from './../../environments/environment';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';


export class AddHeaderInterceptor implements HttpInterceptor {

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('*********appConfig******* interce:' + environment._WEBGATEWAY_BASIC_URL_);
    // Clone the request to add the new header
    if (!this.checkUrlHaveToIgnoreAuthHeaders(req.url)) {
      const currentUser_ = localStorage.getItem('currentUser');
      const token = currentUser_ ? JSON.parse(currentUser_).access_token : 'none';
      const userName = currentUser_ ? JSON.parse(currentUser_).userName : 'none';
      if (environment.gateWayAuthorization) {
        // *** For Production ***********
        const reqCloned = this.handleBodyIn(req, token, 'token');
        const copiedReq = reqCloned;
        return next.handle(copiedReq);
      } else {
        /**  WARNING : use this block to connect without login gateway Or Auth Token */
        let reqCloned: HttpRequest<any> = this.handleBodyIn(req, userName, 'userName'); // WARNING for Testing ONly // this.handleBodyIn(req, 'vikas', 'userName');
        reqCloned = reqCloned.clone({
          headers: req.headers.set('userName', userName)
        });
        const copiedReq = reqCloned;
        return next.handle(copiedReq);
      }

      // Pass the cloned request instead of the original request to the next handle
      // return next.handle(clonedRequest);
    } else {
      const clonedRequest = req.clone();
      // Pass the cloned request instead of the original request to the next handle
      // let currentUser_ = sessionStorage.getItem('currentUser');
      // let token = currentUser_ ? JSON.parse(currentUser_).access_token : 'none';
      // const clonedRequest = req.clone({ headers: req.headers.set('token', token) });
      return next.handle(clonedRequest);
    }

  }

  public checkUrlHaveToIgnoreAuthHeaders(url) {
    let urlHaveToIgnore = false;
    const ignoreAuthHeadersURL_: String[] = environment._IgnoreAuthHeadersURL;
    ignoreAuthHeadersURL_.forEach(urlSegments => {
      if (url.indexOf(urlSegments) > -1) {
        urlHaveToIgnore = true;
      }
    });
    return urlHaveToIgnore;
  }

  handleBodyIn(req: HttpRequest<any>, tokenToAdd, tokenName) {
    if (req.method.toLowerCase() === 'post') {
      if (req.body instanceof FormData) {
        req = req.clone({
          body: req.body.append(tokenName, tokenToAdd),
        });
      } else {
        const foo = {};
        foo[tokenName] = tokenToAdd;
        req = req.clone({
          body: { ...req.body, ...foo }
        });
      }
    }
    if (req.method.toLowerCase() === 'get') {
      req = req.clone({
        params: req.params
          .set(tokenName, tokenToAdd)
      });
    }
    return req;
  }
}

