 
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
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_situation';
        var formData:FormData=new FormData();
        formData.append("state",state)
        return this.http.post(url, formData).map(res => <any>res);
    }
 
}
