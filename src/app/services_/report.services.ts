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
export class ReportService {

    public userTabs_: UserTab[] = [];

    constructor(private http: HttpClient, private userService: UserService
    ) { }

    public userTabs: UserTab[] = [];
    public subjectTabs = new BehaviorSubject(this.userTabs);

    public getUserTabsSubscriber() {
        return this.subjectTabs.asObservable();
    }

    public fetchUsertabs() {
        this.userService.loadUserTabs().subscribe(
            data => {
                const response_: APIResponse = new APIResponse(data);
                this.userTabs = response_.data;
            },
            error => {
                this.userTabs = [];
            },
            () => this.bindUserTabsToSubscribers()
        );
    }

    public addNewTabToSubscribedList(obj: UserTab) {
        this.userTabs.push(obj);
        this.bindUserTabsToSubscribers();
    }

    public bindUserTabsToSubscribers() {
        this.subjectTabs.next(this.userTabs);
    }

    public getExistingTabs() {
        if (this.userTabs.length < 1) {
            this.fetchUsertabs();
        } else {
            this.bindUserTabsToSubscribers();
        }
    }

    /**
     * Use to brodcast updated Tab-Reports to Every Pages
     * @param tabId tab Identification : where event like add/remove reports happened
     * @param reports updated Report Object
     */
    public notifyTabChangesToServices(tabId: Number, reports: Array<Report>) {
        this.userTabs.forEach((tabs: UserTab) => {
            if (tabs.id == tabId) {
                tabs.reportUrl = reports;
            }
        });
    }


    /**
     *  Add New Tab to DB
     */
    public saveNewTab(tabName: string, tabDescription: string): any {
        return this.userService.saveNewTab(tabName, tabDescription);
    }


    /**
     * it will deActivate tab
     */
    public updateExistingTab(obj: any) {
        return this.userService.updateExistingTab(obj);
    }


    public fetchCategoryReports(categoryId) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'Reports/' + categoryId;
        return this.http.post(url, '').map(res => <any>res);
    }

    public fetchSummaryCategoryReports(categoryId) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'Summary-Reports/' + categoryId;
        return this.http.post(url, '').map(res => <any>res);
    }


    public fetchCategories() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'Category';
        return this.http.post(url, '').map(res => <any>res);
    }



    public fetchReportChart(reportId) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'Chart';
        const formData: FormData = new FormData();
        formData.append('reportId', reportId);
        return this.http.post(url, formData).map(res => <any>res);
    }

    public addReportToTab(obj) {
        return this.userService.addReportsToTab(obj);
    }

    public addSummaryToTab(obj) {
        return this.userService.addSummaryToTab(obj);
    }

    public getReportChartDataByURL(urlMappingName: String, reportIndex: number, reportId, timeRange: any, globalFilters: any) {
        return this.userService.getReportChartDataByURL(urlMappingName, reportIndex, reportId, timeRange, globalFilters);
    }

    public getSummaryDataByURL(urlMappingName: String, summaryIndex: number, summaryId, globalFilters: any) {
        return this.userService.getSummaryDataByURL(urlMappingName, summaryIndex, summaryId, globalFilters);
    }

    public getReportFilter(reportId_) {
        return this.userService.getReportFilter(reportId_);
    }

    public updateReportFilter(reportId_, filterArr_) {
        return this.userService.updateReportFilter(reportId_, filterArr_);
    }

    /** Ramji made changes on 27-04-2019
     *  This f/n will triggered when user get left click on chart
     *  Left Click Inside Main Reports
     */
    public getDrillData(urlMappingName, param, reportId, timeRange, globalFilters) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        formData.append('reportId', '' + reportId);

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    formData.append(key == 'key' ? 'filterValue' : key, element[key]);
                });
            });
        }

        formData.append('startDate', '' + timeRange['timestamp_start'] / 1000);
        formData.append('endDate', '' + timeRange['timestamp_end'] / 1000);
        formData.append('timeType', '' + timeRange['timeType']);
        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
     *
     * @param urlMappingName urlname
     * @param param drilled data filters
     * @param drillDownId drilldown db Id
     * @param drillFilterValue drill filterValue
     * @param timeRange selected time Range
     * @param globalFilters applied global filters like customers.
     * Left Click Inside Drilled Reports
     */
    public getDrillDataLeftClick(urlMappingName, param, reportId, drillDownId, drillFilterValue, timeRange, globalFilters) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        formData.append('reportId', '' + reportId);
        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    formData.append(key == 'key' ? 'filterValue' : key, element[key]);
                });
            });
        }

        // formData.append('filterValue', drillFilterValue);
        formData.append('startDate', '' + timeRange['timestamp_start'] / 1000);
        formData.append('endDate', '' + timeRange['timestamp_end'] / 1000);
        formData.append('timeType', '' + timeRange['timeType']);

        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', customer);
        }

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

    public loadDrillDownCharts(urlMappingName, drillDownId, reportId, clickedData, timeRange, globalFilters) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        formData.append('drilldownId', drillDownId);
        formData.append('reportId', reportId);
        if (clickedData.length > 0) {
            clickedData.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    formData.append(key == 'key' ? 'filterValue' : key, element[key]);
                });
            });
        }

        formData.append('startDate', '' + timeRange['timestamp_start'] / 1000);
        formData.append('endDate', '' + timeRange['timestamp_end'] / 1000);
        formData.append('timeType', '' + timeRange['timeType']);

        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    // Before 27-08-2019
    // public IncidentHomehourlytrendticket(urlMappingName, timeRange) {
    //     var url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
    //     let formData: FormData = new FormData();
    //     formData.append("startDate", "" + timeRange['timestamp_start'] / 1000);
    //     formData.append("endDate", "" + timeRange['timestamp_end'] / 1000);
    //     // formData.append("customers", "" + this.findSelectedCustomers(globalFilters['customers']));


    //     return this.http.post(url, formData).map(res=><any>res);
    // }



    public IncidentHomehourlyTrendTicket(urlMappingName, obj) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(elm_ => {
            formData.append(elm_, obj[elm_]);
        });
        // formData.append("customers", "" + this.findSelectedCustomers(globalFilters['customers']));


        return this.http.post(url, formData).map(res => <any>res);
    }

    public IncidentHomehourlyTrendTicketDrillData(urlMappingName, obj, param) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        Object.keys(obj).forEach(elm_ => {
            formData.append(elm_, obj[elm_]);
        });

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    formData.append(key == 'key' ? 'filterValue' : key, element[key]);
                });
            });
        }

        // formData.append("customers", "" + this.findSelectedCustomers(globalFilters['customers']));


        return this.http.post(url, formData).map(res => <any>res);
    }

    public deleteExstingReport(reportId: Number) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'deleteReport';
        const formData: FormData = new FormData();
        formData.append('reportId', '' + reportId);
        return this.http.post(url, formData).map(res => <any>res);

    }

    public deleteExstingSummary(summaryreportId: Number) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'deleteSummaryReport';
        const formData: FormData = new FormData();
        formData.append('summaryReportId', '' + summaryreportId);
        return this.http.post(url, formData).map(res => <any>res);
    }

    public fetchStaticSummary(urlMappingName) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        return this.http.post(url, '').map(res => <any>res);
    }

    public fetchStaticSummaryTicketData(urlMappingName) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        return this.http.post(url, '').map(res => <any>res);
    }




    public fetchGFCustomers() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/customer';
        const formData: FormData = new FormData();
        // formData.append("userId", "" + userId);
        return this.http.post(url, formData).map(res => <any>res);
    }

    public loadPreviousReport(reportId) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'previousState';
        const formData: FormData = new FormData();
        formData.append('reportId', '' + reportId);
        return this.http.post(url, formData).map(res => <any>res);
    }

    public loadDrillDownChartsBackNavigate(urlMappingName, drillDownId, reportId, timeRange, globalFilters) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        formData.append('drilldownId', drillDownId);
        formData.append('reportId', reportId);
        formData.append('startDate', '' + timeRange['timestamp_start'] / 1000);
        formData.append('endDate', '' + timeRange['timestamp_end'] / 1000);
        formData.append('timeType', '' + timeRange['timeType']);
        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    public updateCalendarChartNavigation(urlMappingName: String,
        reportIndex: number, reportId, timeRange: any, globalFilters: any, filterValue: String) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName; //
        const formData: FormData = new FormData();
        formData.append('reportId', '' + reportId);
        formData.append('startDate', '' + timeRange['timestamp_start']);
        formData.append('endDate', '' + timeRange['timestamp_end']);
        formData.append('timeType', '' + timeRange['timeType']);
        formData.append('filterValue', '' + filterValue);
        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);

    }

    public loadUserTabFilter(tabId: Number) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/filters/get-main-filter';
        const formData: FormData = new FormData();
        formData.append('tabId', '' + tabId);
        return this.http.post(url, formData).map(res => <any>res);
    }
    
    //start k
    public fetchCustomWidgetSummaryTabTicketData(urlMappingName, timeRange: any, globalFilters: any) {
        var url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        let formData: FormData = new FormData();
        let customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append("customers", "" + this.findSelectedCustomers(globalFilters['customers']));
        }
        formData.append("assigneeGroup", "" + this.findSelectedAssigneeGroup(globalFilters['assigneeGroup']));
        return this.http.post(url, formData).map(res => <any>res);
    }
    public findSelectedAssigneeGroup(customers: Array<any>) {
        let customerStr = "";
        customers.forEach(element => {
            if (element['value']) {
                customerStr += (customerStr.trim() != "") ? "," + element['name'] : element['name'];
            }
        });
        return customerStr;
    }
    public getCustomWidgetSummaryReportsDrillData(urlMappingName, param, timeRange, globalFilters) {
        var url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        let formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                let keys = Object.keys(element);
                keys.forEach(key => {
                    formData.append(key == 'key' ? 'filterValue' : key, element[key]);
                });
            });
        }

        formData.append("startDate", "" + timeRange['timestamp_start']);
        formData.append("endDate", "" + timeRange['timestamp_end']);
        formData.append("timeType", "" + timeRange['timeType']);
        let customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append("customers", "" + this.findSelectedCustomers(globalFilters['customers']));
        }

        // formData.append("assigneeGroup", "" + this.findSelectedAssigneeGroup(globalFilters['assigneeGroup']));

        return this.http.post(url, formData).map(res => <any>res);
    }


    public addScheduleReportToTab(obj) {
        return this.userService.addScheduleReportToTab(obj);
    }

    public fetchScheduleReport() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'getScheduleReport';
        return this.http.post(url, '').map(res => <any>res);
    }

    public DownloadReport(obj): Observable<Blob> {
        return this.userService.DownloadReport(obj);
    }
    downloadNoteReceipt(notes_purchased_id: number, formate_: string, masterReportId: string, categoryId: string): Observable<Blob> {
        return this.http.get('http://172.27.63.61:8089/get_downloadReport?startDate=1576101600000&endDate=1577311200000&format=' + formate_ + '&masterReportId=' + masterReportId + '&categoryId=' + categoryId, { responseType: 'blob' });
    }

    public UpdateScheduleReport(obj) {
        return this.userService.UpdateScheduleReport(obj);
    }


    public getAllIncidentTickets(globalFilters, timeRange) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'incident/kpi/get_all_tickets_between_duration';
        let formData: FormData = new FormData();
        formData.append("startDate", "" + timeRange['timestamp_start']);
        formData.append("endDate", "" + timeRange['timestamp_end']);
        formData.append("timeType", "" + timeRange['timeType']);
        return this.http.post(url, formData).map(res => <any>res);
    }
    // schedule download report
    scheduleDownloadReport(scheduleObj) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'scheduleNow';
        let formdData: FormData = new FormData();
        Object.keys(scheduleObj).forEach(key => {
            formdData.append('' + key, scheduleObj[key]);
        })
        return this.http.post(url, formdData).map(res => <any>res);
    }
    //  download now report
    downloadNowReport(downloadObj): Observable<Blob> {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'downloadNow';
        let formdData: FormData = new FormData();
        Object.keys(downloadObj).forEach(key => {
            formdData.append('' + key, downloadObj[key]);
        })

        return this.http.post(url, formdData, { responseType: 'blob' }).map(res => <any>res);
    }
    // get all schedule reports
    public allScheduleReport() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'getScheduleReports';
        return this.http.post(url, '').map(res => <any>res);
    }

    public deleteScheduleReportIncident(id) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'deleteScheduleReport';
        const formdData: FormData = new FormData();
        formdData.append('scheduleReportId', '' + id);
        return this.http.post(url, formdData).map(res => <any>res);
    }


    public getSMSHistory(globalFilters, timeRange) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'getSMSHistory';
        let formData: FormData = new FormData();
        formData.append("startDate", "" + timeRange['timestamp_start']);
        formData.append("endDate", "" + timeRange['timestamp_end']);
        formData.append("timeType", "" + timeRange['timeType']);
        return this.http.post(url, formData).map(res => <any>res);
    }
}
