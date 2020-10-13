import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ReportService } from './report.services';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HomeSummaryService {

    constructor(private reportService_: ReportService, private http: HttpClient) {

    }

    public fetchGFCustomers() {
        return this.reportService_.fetchGFCustomers();
    }

    public getHomeReportsChartDataByURL(urlMappingName: String, reportIndex: number, timeRange: any, globalFilters: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        formData.append('startDate', '' + timeRange['timestamp_start']);
        formData.append('endDate', '' + timeRange['timestamp_end']);
        formData.append('timeType', '' + timeRange['timeType']);

        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', '' + this.findSelectedCustomers(globalFilters['customers']));
        }
        formData.append('assigneeGroup', '' + this.findSelectedAssigneeGroup(globalFilters['assigneeGroup']));
        return this.http.post(url, formData).map(res => <any>res);

    }

    public fetchHomeSummaryTab(urlMappingName, timeRange: any, globalFilters: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const customer = this.findSelectedCustomers(globalFilters['customers']);
        const formData: FormData = new FormData();
        if (customer.trim() !== '') {
            formData.append('customers', '' + this.findSelectedCustomers(globalFilters['customers']));
        }
        formData.append('assigneeGroup', '' + this.findSelectedAssigneeGroup(globalFilters['assigneeGroup']));
        return this.http.post(url, formData).map(res => <any>res);
    }


    public fetchHomeSummaryTabTicketData(urlMappingName, timeRange: any, globalFilters: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', '' + this.findSelectedCustomers(globalFilters['customers']));
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


    public getHomeSummaryReportsDrillData(urlMappingName, param, timeRange, globalFilters) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    formData.append(key == 'key' ? 'filterValue' : key, element[key]);
                });
            });
        }

        formData.append('startDate', '' + timeRange['timestamp_start']);
        formData.append('endDate', '' + timeRange['timestamp_end']);
        formData.append('timeType', '' + timeRange['timeType']);
        const customer = this.findSelectedCustomers(globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customers', '' + this.findSelectedCustomers(globalFilters['customers']));
        }

        formData.append('assigneeGroup', '' + this.findSelectedAssigneeGroup(globalFilters['assigneeGroup']));

        return this.http.post(url, formData).map(res => <any>res);
    }

}
