import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from './../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({ providedIn: 'root' })
export class UserService {
    public menuInformation: any = [];
    public subjectMenu = new BehaviorSubject(this.menuInformation);

    constructor(private http: HttpClient) { }

    public loadUserTabs() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'Tab';
        const formData: FormData = new FormData();
        return this.http.post(url, formData).map(res => <any>res);
    }


    public updateExistingTab(obj: any) {
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(element => {
            formData.append(element, obj[element]);
        });
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'updateTab';
        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
     *   This f/n will create a widget to db.
     * @param tabName userTab Name
     * @param tabDescription Tab Description
     */
    public saveNewTab(tabName: string, tabDescription) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'addTab';
        const formData: FormData = new FormData();
        formData.append('tabName', tabName);
        formData.append('tabDescription', tabDescription);
        return this.http.post(url, formData).map(res => <any>res);
    }


    public addReportsToTab(obj) {
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(element => {
            formData.append(element, obj[element]);
        });
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'addReport';
        return this.http.post(url, formData).map(res => <any>res);
    }


    public addSummaryToTab(obj) {
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(element => {
            formData.append(element, obj[element]);
        });
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'addSummaryReport';
        return this.http.post(url, formData).map(res => <any>res);
    }


    public getReportChartDataByURL(urlMappingName: String, reportIndex: number, reportId, timeRange: any, globalFilters: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName; //
        const formData: FormData = new FormData();
        formData.append('reportId', '' + reportId);
        formData.append('startDate', '' + timeRange['timestamp_start']);
        formData.append('endDate', '' + timeRange['timestamp_end']);
        formData.append('timeType', '' + timeRange['timeType']);
        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', customer);
        }
        formData.append('assigneeGroup', '' + this.findSelectedAssigneeGroup(globalFilters['assigneeGroup']));
        return this.http.post(url, formData).map(res => <any>res);

    }

    public findSelectedCustomers(customers: Array<any>) {
        let customerStr = '';
        customers.forEach(element => {
            if (element['value']) {
                customerStr += (customerStr.trim() != '') ? ',' + element['name'] : element['name'];
            }
        });
        return customerStr;
    }

    public findSelectedAssigneeGroup(customers: Array<any>) {
        let customerStr = '';
        customers.forEach(element => {
            if (element['value']) {
                customerStr += (customerStr.trim() != '') ? ',' + element['name'] : element['name'];
            }
        });
        return customerStr;
    }



    public getSummaryDataByURL(urlMappingName: String, summaryIndex: number, summaryId, globalFilters: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName; //
        const formData: FormData = new FormData();
        formData.append('summaryId', '' + summaryId);

        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', customer);
        }

        formData.append('assigneeGroup', '' + this.findSelectedAssigneeGroup(globalFilters['assigneeGroup']));

        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
     * WARNING : DEPRICATED
     * @param reportId_ report db id
     */
    public getReportFilter(reportId_) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'abcReport';
        const formData: FormData = new FormData();
        formData.append('reportId', reportId_);
        return this.http.post(url, formData).map(res => <any>res);
    }


    public updateReportFilter(reportId_, filterArr_) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'updateFilters';
        const formData: FormData = new FormData();
        formData.append('reportId', reportId_);
        const jsonObject = { filters: filterArr_ };
        formData.append('filter', JSON.stringify(jsonObject));
        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
     * get static widget data // will fetch ticket trends for current month
     * @param postData filters
     */
    public getSWdata(postData) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/kpi/' + 'incident-analytics';
        const formData: FormData = new FormData();
        if (Object.keys(postData).length > 0) {
            Object.keys(postData).forEach(key => {
                formData.append(key, JSON.stringify(postData[key]));
            });

        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
     * load forecast data for ticket trends
     * @param postData filters
     */
    public loadForeCastChartData(postData) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/kpi/' + 'forcast';
        const formData: FormData = new FormData();
        if (Object.keys(postData).length > 0) {
            Object.keys(postData).forEach(key => {
                formData.append(key, postData[key]);
            });
        }
        return this.http.post(url, formData).map(res => <any>res);
    }


    public loadChartTableData(postData) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident-analytics-data';
        const formData: FormData = new FormData();
        if (Object.keys(postData).length > 0) {
            Object.keys(postData).forEach(key => {
                formData.append(key, JSON.stringify(postData[key]));
            });
        }
        return this.http.post(url, formData).map(res => <any>res);
    }


    public getIncState() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'incident-state';
        return this.http.post(url, '').map(res => <any>res);
    }

    public getIncSource() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'incident-Source';
        return this.http.post(url, '').map(res => <any>res);
    }
    public getResCategory() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'incident-resolution_categorization';
        return this.http.post(url, '').map(res => <any>res);
    }
    public getPriority() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'incident-priority';
        return this.http.post(url, '').map(res => <any>res);
    }
    public getCategory() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'incident-category';
        return this.http.post(url, '').map(res => <any>res);
    }


    // Assignee Group

    getCompany() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'company';
        return this.http.post(url, '').map(res => <any>res);
    }

    getCustomer(companyArray) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'customer';
        const formData: FormData = new FormData();
        formData.append('userId', '1');
        formData.append('companyId', companyArray);
        return this.http.post(url, formData).map(res => <any>res);
    }
    getAssigneeGroup(assigneeArray) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'assignee-group';
        const formData: FormData = new FormData();
        formData.append('customerId', assigneeArray);
        return this.http.post(url, formData).map(res => <any>res);
    }

    getAssign(assignArray) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'assignee';
        const formData: FormData = new FormData();
        formData.append('assigneeGroupId', assignArray);
        return this.http.post(url, formData).map(res => <any>res);
    }

    // Categorization

    getCatCompany() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'company';
        return this.http.post(url, '').map(res => <any>res);
    }

    getCatCustomer(catCompanyArray) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'customer';
        const formData: FormData = new FormData();
        formData.append('companyId', catCompanyArray);
        return this.http.post(url, formData).map(res => <any>res);
    }
    getBussinessService(BussinessArray) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'business-service';
        const formData: FormData = new FormData();
        formData.append('customerId', BussinessArray);
        return this.http.post(url, formData).map(res => <any>res);
    }
    GetCatServiceOfferign(serviceOffering) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/' + 'service-offering';
        const formData: FormData = new FormData();
        formData.append('businessServiceId', serviceOffering);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadMapCordinates() {
        const url = 'https://api.myjson.com/bins/s7r51';
        return this.http.get(url);
    }

    public getLoggedInUserDetails() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'getuserdetailDB';
        return this.http.get(url); // .map(res=><any>res);
    }

    sendFeedBack(objData) {
        const basicAuth = btoa(objData.auth_user + ':' + objData.auth_pwd); // basic Authorization
        delete objData['auth_user'];
        delete objData['auth_pwd'];

        const formData = new FormData();
        formData.append('version', '1.3');
        formData.append('json_data', JSON.stringify(objData.json_data))
        return  this.http.post<any>(environment._WEBGATEWAY_BASIC_URL_  +  'itop/sendfeedback', formData);
    }


    public addScheduleReportToTab(obj) {
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(element => {
            formData.append(element, obj[element]);
        });
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'addScheduleReport';
        return this.http.post(url, formData).map(res => <any>res);
    }

    public UpdateScheduleReport(obj){
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(element => {
            formData.append(element, obj[element]);
        });
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'updateScheduleReport';
        return this.http.post(url, formData).map(res => <any>res);
    }


    public DownloadReport(obj) {
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(element => {
            formData.append(element, obj[element]);
        });
        const headers_: HttpHeaders = new HttpHeaders();
        headers_.append('accept', 'application/pdf');
        headers_.append('responseType', 'blob');
        headers_.append('observe', 'response');
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'downloadReport';
        return this.http.post(url, formData , {headers: headers_}).map(res => <any>res);
    }


}
