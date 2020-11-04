
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';

import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/app/services_/user.services';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CloudDevOpsService {



    constructor(private http: HttpClient, private userService: UserService
    ) { }


    public getSituations(state) {
        if (state == 'Open') {
            const url = 'https://run.mocky.io/v3/c0a83b0a-a68d-4dbf-871c-4a4c26b2661b';
            return this.http.get(url).map(res => <any>res);
        } else if (state == 'assigned') {
            const url = 'https://run.mocky.io/v3/d4540f30-8e4b-421a-b3e2-a98408ef0932';
            return this.http.get(url).map(res => <any>res);
        } else {
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_situation';
            const formData: FormData = new FormData();
            formData.append('state', state);
            return this.http.post(url, formData).map(res => <any>res);
        }







    }

}
