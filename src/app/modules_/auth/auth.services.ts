import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class AuthServices {

  constructor(private httpClient_: HttpClient
    ) { }

    public validateAuthToken() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + '/login';
        return this.httpClient_.post(url, '').map(res => <any>res);
    }

    public getLoggedInUserDetails() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'getuserdetail';
        return this.httpClient_.get(url); // .map(res=><any>res);
    }

    loadAllPops() {
        const url = 'https://api.myjson.com/bins/lwjo7';
        return this.httpClient_.get(url).map(res => <any>res);
    }

    public convertToBinary(encodedString) {
        return atob(encodedString);
    }

    public login(userName,password){
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'user/kpi/login';
        let formData:FormData = new FormData();
        formData.append('userName',userName);
        formData.append('password',password);
        return this.httpClient_.post(url , formData); // .map(res=><any>res);
    }


}
