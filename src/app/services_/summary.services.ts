import { APIResponse } from './../models_/response_';
import { UserTab, Report } from './../models_/tab';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UserService } from './user.services';
import { BehaviorSubject } from 'rxjs';

import 'rxjs/add/operator/map';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class SummaryService {


    constructor(private http: HttpClient, private userService: UserService
        ) { }

        public getTechnologyList() {
            // const url = "https://run.mocky.io/v3/e783f340-b4cf-4d4d-b344-af906eb6787c";
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_technology_list';
            return this.http.post(url, '').map(res => <any>res);
            // return this.http.get(url).map(res => <any>res);
        }

        public getNMSList() {
            // const url = "https://run.mocky.io/v3/e783f340-b4cf-4d4d-b344-af906eb6787c";
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_nms_list';
            return this.http.post(url, '').map(res => <any>res);
            // return this.http.get(url).map(res => <any>res);
        }

        public loadReportList() {
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_home_reports';
            const fData: FormData = new FormData();
            fData.append('tabId', '1');
            return this.http.post(url, fData).map(res => <any>res);
        }

        public getTechnologyWidgetData() {
            const url = 'https://run.mocky.io/v3/2df0aaba-40a6-4f4a-9910-e2a392346957';
            return this.http.get(url).map(res => <any>res);
        }

        public getSummaryBlocksData() {
            const url = 'https://run.mocky.io/v3/a3607622-efe8-4910-b142-a9c2325ff59f';
            return this.http.get(url).map(res => <any>res);
        }


        public loadUserTabFilter(tabId: Number) {
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/get-main-filter';
            const formData: FormData = new FormData();
            formData.append('tabId', '' + tabId);
            return this.http.post(url, formData).map(res => <any>res);
        }

        public deleteExstingReport(reportId: Number) {
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'deleteReport';
            const formData: FormData = new FormData();
            formData.append('reportId', '' + reportId);
            return this.http.post(url, formData).map(res => <any>res);
    
        }

}
