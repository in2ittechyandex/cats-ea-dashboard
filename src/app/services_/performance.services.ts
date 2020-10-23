import { Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe, Subscription } from 'rxjs';

declare var moment;

@Injectable({ providedIn: 'root' })
export class PerformanceService {

    public deviceLocationSubs$: Subscription;

    private allowedTimeType = ['l1h', 'td', 'yd'];


    constructor(private http: HttpClient) {
    }

    public timeRange = {
        timestamp_start: null,
        timestamp_end: null,
        date_start: null,
        date_end: null,
        timeType: null,
        ranges: []
    };

    public globalFilters = {
        customers: [],
        // assigneeGroup: []
    };

    public timeMap = {
        'now': 'Now',
        'l1h': 'Last 1 Hour',
        'td': 'Today',
        'yd': 'Yesterday',
        'i7d': 'Last 7 Days ',
        '7d': 'Last 7 Days',
        'icm': 'This Month ',
        'cm': 'This Month',
        'lm': 'Last Month',
        'il3m': 'Last 3 Months ',
        'l3m': 'Last 3 Months',
        'il6m': 'Last 6 Months ',
        'l6m': 'Last 6 Months',
        'raw': 'Last 90 Days - Raw Data',
        'icy': 'This Year ',
        'cy': 'This Year',
        'cu': 'Custom Range'
    };


    public timeFilterConfig = {
        dateFilter_minDate: moment().subtract(2, 'month'),
        dateFilter_maxDate: moment(),
        dateFilter_startDate: moment().startOf('hour').subtract(1, 'hours'),
        dateFilter_endDate: moment().startOf('hour'),
        dateFillter_customRanges: ['Last 1 Hour', 'Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month'],
        dateFilter_timeType: 'l1h',
        isAllowTimeFilter: true
    };

    public modifiedTimeFilterConfigSubsc = new Subject();
    public customTagInputSubscriber = new Subject();
    //#region performance filter change start
    public performanceNotificationSubscriber = new Subject();
    public performanceCustomerFilterSubscriber = new Subject();
    //#region performance filter change end


    //#region location start

    public deviceLocations: Array<Object> = [];
    public subjectDiviceLocations = new BehaviorSubject(this.deviceLocations);

    public getDeviceLocationsSubscriber() {
        return this.subjectDiviceLocations.asObservable();
    }


    public deiceNameIPThreshold = [];
    public fetchDeviceLocations() {
        if (this.deviceLocationSubs$ && !this.deviceLocationSubs$.closed) {
            this.deviceLocationSubs$.unsubscribe();
        }

        this.deviceLocationSubs$ = this.loadDeviceLocationDetails().subscribe(
            res => {
                if (res['status'] == true) {
                    this.deviceLocations = res.data;
                    if (localStorage.getItem('selectedPerformanceTab') === 'device') {
                        this.deviceLocations.map((obj, idx) => {
                            this.deiceNameIPThreshold.push({
                                'id': 'deviceCheckbox' + idx + 1,
                                'device_name': obj['L2'],
                                'device_ip': obj['L3'],
                                'isActive': false
                            });
                        })
                    }
                }
            },
            error => {
                this.deviceLocations = [];
            },
            () => this.bindDeviceLocationsToSubscribers()
        );
    }

    public bindDeviceLocationsToSubscribers() {
        this.subjectDiviceLocations.next(this.deviceLocations);
    }

    public getExistingDeviceLocations() {
        if (this.deviceLocations.length < 1) {
            this.fetchDeviceLocations();
        } else {
            this.bindDeviceLocationsToSubscribers();
        }
    }

    /**
     * this f/n will conside time type as 'cu' , if not available in list
     * 28-05-2020 ramji made changes
     */
    private validateTimeTypeAllowed(tType) {
        return (this.allowedTimeType.indexOf(tType) > -1) ? tType : 'cu';
    }


    //#region  location end

    // public getCustomRanges() {
    //     return {
    //         'Now': [moment().subtract(30, 'minutes'), moment()],
    //         // 'Last 1 Hour': [moment().subtract(1, 'hours'), moment()],
    //         'Last 1 Hour': [moment().startOf('hour').subtract(1, 'hours'), moment().startOf('hour')],
    //         'Today': [moment().startOf('day'), moment()],
    //         'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
    //         'Last 7 Days': [moment().subtract(7, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],

    //         'This Month': [moment(moment().startOf('month')).startOf('day'), moment()],
    //         'Last Month': [
    //             moment(moment(moment().startOf('month')).subtract(1, 'month').startOf('month')).startOf('day'),
    //             moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
    //         ],
    //         'Last 3 Months': [
    //             moment(moment(moment().startOf('month')).subtract(3, 'month').startOf('month')).startOf('day'),
    //             moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
    //         ],
    //         'Last 6 Months': [
    //             moment(moment(moment().startOf('month')).subtract(6, 'month').startOf('month')).startOf('day'),
    //             moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
    //         ],
    //         'Last 90 Days - Raw Data': [moment().subtract(90, 'days').startOf('day'), moment()],
    //         // 'Last 1 Year': [
    //         //   moment(moment(moment().startOf('month')).subtract(12, 'month').startOf('month')).startOf('day'),
    //         //   moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
    //         // ],
    //         'This Year': [
    //             moment(moment().startOf('year')).startOf('day'), moment(),
    //             moment()
    //         ],
    //     };
    // }

    public getCustomRanges() {
        let strJson = {
            'Now': [moment().subtract(30, 'minutes'), moment()],
            // 'Last 1 Hour': [moment().subtract(1, 'hours'), moment()],
            'Last 1 Hour': [moment().startOf('hour').subtract(1, 'hours'), moment().startOf('hour')],
            'Today': [moment().startOf('day'), moment()],
            'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            'Last 7 Days': [moment().subtract(7, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            'This Month': [moment(moment().startOf('month')).startOf('day'), moment()],
            'Last Month': [
                moment(moment(moment().startOf('month')).subtract(1, 'month').startOf('month')).startOf('day'),
                moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
            ],
            'Last 3 Months': [
                moment(moment(moment().startOf('month')).subtract(3, 'month').startOf('month')).startOf('day'),
                moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
            ],
            'Last 6 Months': [
                moment(moment(moment().startOf('month')).subtract(6, 'month').startOf('month')).startOf('day'),
                moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
            ],

            'Last 90 Days - Raw Data': [moment().subtract(90, 'days').startOf('day'), moment()],
            // 'Last 1 Year': [
            //   moment(moment(moment().startOf('month')).subtract(12, 'month').startOf('month')).startOf('day'),
            //   moment(moment().startOf('month')).subtract(1, 'month').endOf('month')
            // ],
            'This Year': [
                moment(moment().startOf('year')).startOf('day'), moment(),
                moment()
            ],

            //Start for 'custom-widget'
            'Last 7 Days ': [moment().subtract(7, 'days').startOf('day'), moment()],
            'This Month ': [moment(moment().startOf('month')).startOf('day'), moment()],
            'Last 3 Months ': [moment(moment(moment().startOf('month')).subtract(3, 'month').startOf('month')).startOf('day'), moment()],
            'Last 6 Months ': [moment(moment(moment().startOf('month')).subtract(6, 'month').startOf('month')).startOf('day'), moment()],
            'This Year ': [moment(moment().startOf('year')).startOf('day'), moment(),moment()],
            //End for 'custom-widget'
        };
        // TODO: we select this month filter on 1st day of month
        // requirement for performance kpi's
        if (moment(strJson['This Month'][1]).isSame(moment(moment().startOf('month')).startOf('day'), 'day')) {
            strJson['This Month'] = [moment(moment().startOf('month')).startOf('day'), moment()];
        } else {
            strJson['This Month'] = [moment(moment().startOf('month')).startOf('day'), moment().subtract(1, 'days').endOf('day')];
        }
        return strJson;
    }

    public setDefaultTimeFilterConfig(type = 'l1h', allowFilter_ = true) {
        if (type == 'cu') {
            this.timeFilterConfig.dateFilter_startDate = this.timeRange['timestamp_start'];
            this.timeFilterConfig.dateFilter_endDate = this.timeRange['timestamp_end'];
            this.timeFilterConfig.dateFilter_timeType = type;
            this.timeFilterConfig.isAllowTimeFilter = allowFilter_;
            this.modifiedTimeFilterConfigSubsc.next(this.timeFilterConfig);
        } else {
            const datArr = this.getCustomRanges()[this.timeMap[type]];
            this.timeFilterConfig.dateFilter_startDate = datArr[0];
            this.timeFilterConfig.dateFilter_endDate = datArr[1];
            this.timeFilterConfig.dateFilter_timeType = type;
            this.timeFilterConfig.isAllowTimeFilter = allowFilter_;
            this.modifiedTimeFilterConfigSubsc.next(this.timeFilterConfig);
        }

    }

    public setTimeFilterConfig(data: any) {
        this.modifiedTimeFilterConfigSubsc.next(data);
    }

    public getModifiedTimeFilterConfigSubsc() {
        return this.modifiedTimeFilterConfigSubsc.asObservable();
    }

    public getPerformanceFilterSubscribers() {
        return this.performanceNotificationSubscriber.asObservable();
    }

    public notifySubscribersThatFilterHasBeenChanged() {
        this.performanceNotificationSubscriber.next(true);
    }

    public notifySubscribersThatFilterHasBeenChangedFalse() {
        this.performanceNotificationSubscriber.next(false);
    }

    public getPerformanceCustomerFilterHasBeenChanged() {
        return this.performanceCustomerFilterSubscriber.asObservable();
    }

    public notifyPerformanceCustomerFilterHasBeenChanged() {
        this.performanceCustomerFilterSubscriber.next(true);
    }

    public notifyPerformanceCustomerFilterHasBeenChangedFalse() {
        this.performanceCustomerFilterSubscriber.next(false);
    }

    public notifyCustomTagInputSubscriberChanged(data) {
        this.customTagInputSubscriber.next(data);
    }




    public findSelectedCustomers(customers: Array<any>) {
        let customerStr = '';
        customers.forEach(element => {
            if (element['value']) {
                // customerStr += (customerStr.trim() != '') ? ',' + element['name'] : element['name'];
                // Ramji made changes 28-05-2020 , change name  to param_name;
                customerStr += (customerStr.trim() != '') ? ',' + element['param_name'] : element['param_name'];
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


    /**
     * 17-03-2020
     * Ramji made changes : now fetching customer from another api
     * 'incident/filters/customer' to 'performence/kpi/getCustomers'
     */
    public fetchGFCustomers() {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/getCustomers';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/getCustomers'; // $NEWADDED$
        const formData: FormData = new FormData();
        // formData.append("userId", "" + userId);
        return this.http.post(url, formData).map(res => <any>res);
    }

    public setGlobalFilters(timeRange, globalFilters) {
        // // // console.log(JSON.stringify(timeRange));
        this.timeRange = timeRange;
        this.globalFilters.customers = globalFilters['customers'] ? globalFilters['customers'] : [];
        // this.onGlobalFiltersChanges(timeRange, globalFilters);

        this.validateCustomRange(); // WARNING Ramji added 14-03-2020 if cu is lie in today date make timetype cu to td
    }

    public onGlobalFiltersChanges2(timeRange, globalFilters) {
        // // console.log(JSON.stringify(timeRange));
        this.timeRange = timeRange;
        this.globalFilters.customers = globalFilters['customers'] ? globalFilters['customers'] : [];
        // this.globalFilters.assigneeGroup = globalFilters['assigneeGroup'] ? globalFilters['assigneeGroup'] : [];

        /** WARNING Ramji made changes call location_details 19-03-2020   Start*/
        this.deviceLocations = [];
        this.bindDeviceLocationsToSubscribers();
        /** End */

        /** WARNING Ramji made changes call location_details 19-03-2020 Comment this line */
        // this.notifySubscribersThatFilterHasBeenChanged();
    }

    // selectedTab: string;
    // public getselectedTab(selectedTab) {
    //     this.selectedTab = selectedTab;
    // }

    public onGlobalFiltersChanges(timeRange, globalFilters) {
        // // console.log('onGlobalFilterChange:' + JSON.stringify(globalFilters));
        // // console.log('global_Customer : ' + JSON.stringify(this.globalFilters.customers));

        let isCustModify = false;
        this.timeRange = timeRange;

        const cust_ = globalFilters['customers'] ? globalFilters['customers'] : [];
        // // console.log('cust_ :' + this.findSelectedCustomers(cust_) +
        // ' :filtCust_ : ' + this.findSelectedCustomers(this.globalFilters.customers));
        // if (this.findSelectedCustomers(cust_) != this.findSelectedCustomers(this.globalFilters.customers)) {
        if (this.findSelectedCustomers(cust_) != localStorage.getItem('selectedCustomer')) {
            isCustModify = true;
        }

        this.globalFilters.customers = cust_;
        // this.globalFilters.assigneeGroup = globalFilters['assigneeGroup'] ? globalFilters['assigneeGroup'] : [];

        /** WARNING Ramji made changes call location_details 19-03-2020 ,27-03-2020   Start*/


        const customerStr = this.findSelectedCustomers(globalFilters['customers']);
        // if (!isCustModify && this.selectedTab == 'reports') {
        //     this.notifySubscribersThatFilterHasBeenChanged();
        // } else if (this.selectedTab == 'reports') {
        //     this.notifyPerformanceCustomerFilterHasBeenChanged();
        //     this.initialCustomer = customerStr;
        // } else {
        //     this.notifySubscribersThatFilterHasBeenChanged();
        //     this.initialCustomer = customerStr;
        // }

        if (customerStr.trim() != '') {
            localStorage.setItem('selectedCustomer', customerStr);
        }

        if (isCustModify) {
            // Ramji added this.selectedTab == 'device' 20-04-2020
            // Ranjeet Removed this.selectedTab == 'device' 05-05-2020 (Device IP is coming in Device Name)
            if (localStorage.getItem('selectedPerformanceTab') == 'reports') {
                this.notifyPerformanceCustomerFilterHasBeenChanged(); // load reports internal tabs
            } else if (localStorage.getItem('selectedPerformanceTab') == 'device') {
                this.deviceLocations = [];
                this.bindDeviceLocationsToSubscribers();
            } else {
                this.notifySubscribersThatFilterHasBeenChanged();
            }
        } else {
            this.notifySubscribersThatFilterHasBeenChanged(); // notify cust only time-filter change
        }

        /** End */

        /** WARNING Ramji made changes call location_details 19-03-2020 Comment this line */
        // this.notifySubscribersThatFilterHasBeenChanged();
    }

    epochDate(epochtime) {
        let dt = new Date(epochtime);
        return (`${
            dt.getDate().toString().padStart(2, '0')}/${
            (dt.getMonth() + 1).toString().padStart(2, '0')}/${
            dt.getFullYear().toString().padStart(4, '0')} ${
            dt.getHours().toString().padStart(2, '0')}:${
            dt.getMinutes().toString().padStart(2, '0')}:${
            dt.getSeconds().toString().padStart(2, '0')}`
        );
    }

    dateconv(dateval) {
        // const date = moment(new Date(dateval), 'DD-MM-YYYY');
        const date = moment(new Date(dateval)).format('DD-MM-YYYY h:mm:ss');
        return date;
    }

    getFilterString() {
        const startTime = this.timeRange['timestamp_start'];
        const endTime = this.timeRange['timestamp_end'];
        const tType = this.timeRange['timeType'];
        const cust_ = this.findSelectedCustomers(this.globalFilters['customers']);
        let str = '';
        str += 'Time Range: ' + this.timeMap[tType];
        // if (tType == 'l1h') {
        str += ',Start Date: ' + this.dateconv(startTime) + ',End Date: ' + this.dateconv(endTime);
        // }

        str += ',Customer: ' + cust_ + '\n';
        return str;
    }

    getFilterStringPerformance(params: any[]) {
        const startTime = this.timeRange['timestamp_start'];
        const endTime = this.timeRange['timestamp_end'];
        const tType = this.timeRange['timeType'];
        const cust_ = this.findSelectedCustomers(this.globalFilters['customers']);
        let str = '';
        params.forEach(elm => {
            str += elm + ' ' + params[elm] + ' ,';
        });
        str += 'Time Range: ' + this.timeMap[tType];
        // if (tType == 'cu') {
        str += ',Start Date: ' + this.dateconv(startTime) + ',End Date: ' + this.dateconv(endTime);
        // }

        str += ',Customer: ' + cust_ + '\n';
        return str;
    }


    getChangedFilter() {
        const url = 'http://www.mocky.io/v2/5e96eadc3000005100b6d938';
        return this.http.get(url).map(res => <any>res);
    }

    public submitMessageTabData(urlEndPoint: string, deviceType: string, messageData: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/email/' + urlEndPoint;
        const formData: FormData = new FormData();

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        formData.append('customer', messageData.customer);
        formData.append('format', messageData.attachmentType);
        formData.append('reportName', messageData.reportName);

        if (deviceType) {
            formData.append('deviceType', deviceType);
        }
        formData.append("emailStr", JSON.stringify(messageData));
        return this.http.post(url, formData).map(res => <any>res);
    }

    public submitPerformanceEmailScheduler(schedulerData: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/add_performance_email_scheduler';
        const formData: FormData = new FormData();
        if (schedulerData.timeType == 'cu') {
            schedulerData.timeType = 'cu ' + this.timeRange['timestamp_start'] + '-' + this.timeRange['timestamp_end'];
        }
        formData.append("schedulerStr", JSON.stringify(schedulerData));
        return this.http.post(url, formData).map(res => <any>res);
    }

    public getPerformanceEmailScheduler() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/get_performance_email_scheduler';
        const formData: FormData = new FormData();
        // formData.append("userId", "" + userId);
        return this.http.post(url, formData).map(res => <any>res);
    }

    public deleteEmailSchedule(id: number) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/delete_performance_email_scheduler';
        const formData: FormData = new FormData();
        formData.append("id", "" + id);
        return this.http.post(url, formData).map(res => <any>res);
    }

    getReportHeaders(report_id) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/get_performance_report_state';
        const formData: FormData = new FormData();
        // formData.append('startDate', '' + this.timeRange['timestamp_start']);
        // formData.append('endDate', '' + this.timeRange['timestamp_end']);
        //  formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('report_id', report_id);
        return this.http.post(url, formData).map(res => <any>res);
    }

    saveReportHeaders(report_id, objHeaders_) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/add_performance_report_state';
        const formData: FormData = new FormData();
        // formData.append('startDate', '' + this.timeRange['timestamp_start']);
        // formData.append('endDate', '' + this.timeRange['timestamp_end']);
        //  formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        const reqObj = {
            headers: objHeaders_,
            globalFilter: {
                'timeType': this.timeRange['timeType'],
                'startTime': this.timeRange['timestamp_start'],
                'endTime': this.timeRange['timestamp_end'],
                'customers': customer
            }
        };
        // console.log('JSON.stringify(reqObj) : '+JSON.stringify(reqObj));
        formData.append('state_data', JSON.stringify(reqObj));
        formData.append('report_id', report_id);
        return this.http.post(url, formData).map(res => <any>res);
    }

    getThresholdDeviceList() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/get_performance_threshold_device_list';
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    getThresholdInterfaces(deviceIP) {
        // const url =  'http://www.mocky.io/v2/5e96eb413000008600b6d93a';
        // return this.http.get(url).map(res => <any>res);

        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/get_performance_threshold_device_interfaces';
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('deviceIP', deviceIP);
        return this.http.post(url, formData).map(res => <any>res);
    }

    addPerformanceThreshold(threshold) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/add_performance_threshold';
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        // if(submittedID){
        //     formData.append('id', JSON.stringify(submittedID));
        // }
        formData.append('thresholdStr', JSON.stringify(threshold));
        console.log(JSON.stringify(threshold));
        return this.http.post(url, formData).map(res => <any>res);
    }

    getSavedThresholdList() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/get_performance_threshold';
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    deleteThresholdID(deleteID) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/delete_performance_threshold';
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('id', JSON.stringify(deleteID));
        return this.http.post(url, formData).map(res => <any>res);
    }

    // duplicateThresholdId(duplicateID){
    //     const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/NEEDTOCHANGE';
    //     const formData: FormData = new FormData();
    //     const customer = this.findSelectedCustomers(this.globalFilters['customers']);
    //     if (customer.trim() !== '') {
    //         formData.append('customer', customer);
    //     }
    //     formData.append('NEEDTOCHANGE', JSON.stringify(duplicateID));
    //     return this.http.post(url, formData).map(res => <any>res);
    // }

    suspendOrResumeThresholdStatus(suspendOrResumeID, suspendOrResumeStatus) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/performance_threshold_status';
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('id', JSON.stringify(suspendOrResumeID));
        formData.append('status', JSON.stringify(suspendOrResumeStatus));
        return this.http.post(url, formData).map(res => <any>res);
    }

    // resumeThresholdId(resumeID){
    //     const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/filters/NEEDTOCHANGE';
    //     const formData: FormData = new FormData();
    //     const customer = this.findSelectedCustomers(this.globalFilters['customers']);
    //     if (customer.trim() !== '') {
    //         formData.append('customer', customer);
    //     }
    //     formData.append('NEEDTOCHANGE', JSON.stringify(resumeID));
    //     return this.http.post(url, formData).map(res => <any>res);
    // }

    /**WARNING : myjson binding , this f/n will return reports internal tabs based on customer  */

    loadReportsCarousel() {
        // const url = 'https://api.myjson.com/bins/i6780'; //(with 3 data)
        // const url = 'https://api.myjson.com/bins/drb8k'; // (with single data)
        // const url = 'https://api.myjson.com/bins/ruc64'; // (with all data)
        // const url = 'https://api.myjson.com/bins/101f34'; //(with no data)
        let url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/wcg/kpi/reports';
        const formData: FormData = new FormData();
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        // if (customer != 'Transnet Limited') {
        //     url = 'https://api.myjson.com/bins/1as2u8';
        //     return this.http.get(url).map(res => <any>res);
        // }
        return this.http.post(url, formData).map(res => <any>res);
    }


    // overview tabs start
    loadTop10DeviceBandWidthInOut() {
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/bandwidth_in_out', formData).map(res => <any>res);
    }

    loadTop10DeviceErrorInOut() {
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/error_in_out', formData).map(res => <any>res);
    }

    loadTop10DeviceMTBF() {
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_mtbf', formData).map(res => <any>res);
    }

    loadTop10DeviceUpTime() {
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/uptime', formData).map(res => <any>res);
    }


    loadDeviceAvailability() {
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device-availability', formData).map(res => <any>res);
    }
    // overview tabs ends


    loadDevices() {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_list';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/device_list'; // $NEWADDED$

        const formData: FormData = new FormData();
        // formData.append('customer', '');

        formData.append('startDate', '' + Date.parse(moment()));
        // formData.append('endDate', '' + this.timeRange['timestamp_end']);
        //  formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
        // return this.http.get(url).map(res => <any>res);
    }
    loadMemory() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/memory_list';
        const formData: FormData = new FormData();
        // formData.append('customer', '');

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }


        return this.http.post(url, formData).map(res => <any>res);
    }


    loadProcessor() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/cpu_list';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }
    loadTemperature() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/temprature_list';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }


        return this.http.post(url, formData).map(res => <any>res);
    }
    loadPorts() {
        const url = 'https://api.myjson.com/bins/1dgvte';
        return this.http.get(url).map(res => <any>res);
    }

    loadReportsAllDevicePerformance() {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/all_device_performence';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_performence'; // $NEWADDED$

        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));


        formData.append('deviceType', 'All');

        // console.log('loadReportsAllDevicePerformance ::: ' + JSON.stringify(this.timeRange));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            // formData.append('customer', customer);
            formData.append('customer', customer);
        }

        // formData.append('nodeId', '992');
        return this.http.post(url, formData).map(res => <any>res);
    }


    validateCustomRange() {
        if (this.timeRange['timeType'] == 'cu') {
            const stTime_ = new Date(this.timeRange['timestamp_start']);
            const endTime_ = new Date(this.timeRange['timestamp_end']);
            const tsNow = new Date();

            const stTime_str = (stTime_.getDate() + ':' + stTime_.getMonth() + ':' + stTime_.getFullYear());
            const endTime_str = (endTime_.getDate() + ':' + endTime_.getMonth() + ':' + endTime_.getFullYear());
            const tsNow_str = (tsNow.getDate() + ':' + tsNow.getMonth() + ':' + tsNow.getFullYear());

            if (tsNow_str == stTime_str && tsNow_str == endTime_str) {
                // console.log('custom range today selected');
                this.timeRange['timeType'] = 'td';
            } else {
                // console.log('custom range other selected');
            }

        }
    }

    loadReportsAllCoreDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/coree_device_list';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        // formData.append('nodeId', '992');
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsWANDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_performence'; // $NEWADDED$
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/wan_device_performence';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);

        formData.append('deviceType', 'WAN Device ');

        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        // formData.append('nodeId', '992');
        return this.http.post(url, formData).map(res => <any>res);
    }


    loadReportsLANDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_performence'; // $NEWADDED$
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/lan_device_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'LAN Switch');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsMEDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_performence'; // $NEWADDED$
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/me_device_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'Metro Ethernet');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsZeroAvailablityDevicePerformance() {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/zero_availability_device_performence';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/zero_availability_device_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('deviceType', 'All');
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsZeroAvailablityLANDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/zero_availability_device_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('deviceType', 'LAN Switch');
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsZeroAvailablityWANDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/zero_availability_device_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('deviceType', 'WAN Device ');
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsZeroAvailablityMEDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/zero_availability_device_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('deviceType', 'Metro Ethernet');
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsLANInterfaceSaturation() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'LAN Switch');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsWANInterfaceSaturation() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'WAN Device ');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsMEInterfaceSaturation() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'Metro Ethernet');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsAllInterfaceSaturation() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'All');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsSaturationApLink() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/saturation_ap_link';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }


    loadReportsInterfaceCapacity() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/interface_capicity';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'WAN Device ');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsLANInterfaceCapacity() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/interface_capicity';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'LAN Switch');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsMEInterfaceCapacity() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/interface_capicity';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'Metro Ethernet');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }





    /**
     * WARNING : url to be change
     */
    loadReportsFirewallAllInterface() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'Firewall');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);

    }

    loadReportsAllPowerOutage_New() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/power_outage_performence_updated';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'All');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsLanPowerOutage_New() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/power_outage_performence_updated';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'LAN Switch');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsWanPowerOutage_New() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/power_outage_performence_updated';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'WAN Device ');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsMePowerOutage_New() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/power_outage_performence_updated';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'Metro Ethernet');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsLANPowerOutage() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/power_outage_performence';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'LAN Switch');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }


    loadReportsWANPowerOutage() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/power_outage_performence';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'WAN Device ');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsMEPowerOutage() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/power_outage_performence';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'Metro Ethernet');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }


    loadReportsLANActivePorts() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/active_lan';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsWANActivePorts() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/active_wan_port';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsMEActivePorts() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/active_me_port';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }


    loadReportsLANInterfaceUtilization() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_utilization_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'LAN Switch');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsWANInterfaceUtilization() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_utilization_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'WAN Device ');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsMEInterfaceUtilization() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_utilization_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'Metro Ethernet');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsALLInterfaceUtilization() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_interface_utilization_performance';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('deviceType', 'All');
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }


    loadReportsNeoInternetServices() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/neo_internet_services';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadReportsNeoBackupLinks() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/backup_links';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }


    loadDeviceLocationDetails() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/location_details';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
     * WCG URLS
     */
    loadReportsWCGAllInterfacePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/wcg/kpi/all_interface_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadWCGReportsAllDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_performence_wcg'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        formData.append('deviceType', 'All');
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadWCGReportsInterfaceUtilizationDevice() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/wcg/kpi/interface_utilization_device';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadWCGReportsZeroAvailablityDevicePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/zero_availability_device_performence_wcg'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        formData.append('deviceType', 'All');
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadWCGReportsPowerOutagePerformance() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/wcg/kpi/power_outage_performence';
        const formData: FormData = new FormData();
        // formData.append('customer', '');
        // formData.append('nodeId', '992');
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadWCGReportsShadowRouter() {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/all_device_performence_wcg'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        formData.append('deviceType', 'Shadow Router');
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
    *  KPI used in host-interface-events page : Performance-summay-host start
    */



    getDeviceHostSummaryTabData(hostName: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/api/device_details';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + hostName);
        return this.http.post(url, formData).map(res => <any>res);

    }


    getDeviceInterFaces(deviceName) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interfaces';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + deviceName);
        return this.http.post(url, formData).map(res => <any>res);

    }

    fetchInterfaceBandwidth(interface_: string, hostName: string, interfaceSpeed: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_bandwidth_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_octet';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_raw_90_days'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);

        formData.append('nodeIp', '' + hostName);
        formData.append('interface', '' + interface_);
        formData.append('speed', '' + interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceUnicastPercent(interface_: string, hostName: string, interfaceSpeed: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_bandwidth_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_octet';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_percent_raw_90_days'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);
        formData.append('nodeIp', '' + hostName);
        formData.append('interface', '' + interface_);
        formData.append('speed', '' + interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }


    fetchInterfaceUnicast(interface_: string, hostName: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_unicast_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_packet';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_pkts_raw_90_days'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }
        formData.append('customer', customer_);
        formData.append('nodeIp', '' + hostName);
        formData.append('interface', '' + interface_);
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceError(interface_: string, hostName: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_error_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_error';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_errors_raw_90_days'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }
        formData.append('customer', customer_);
        formData.append('nodeIp', '' + hostName);
        formData.append('interface', '' + interface_);
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceAvailability(interface_: string, hostName: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_bandwidth_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_octet';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_availibility_raw_90_days'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);
        formData.append('nodeIp', '' + hostName);
        formData.append('interface', '' + interface_);
        return this.http.post(url, formData).map(res => <any>res);
    }


    // interface nadi wala start
    fetchInterfaceBandwidthAggregatedIN(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        formData.append('speed', '' + interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceBandwidthAgrgregatedOUT(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationOut');
        formData.append('speed', '' + interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceUnicastAggregatedIN(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_pkts_in'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'pktIn');
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceUnicastAggregatedOUT(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_pkts_out'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'pktOut');
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceErrorAggregatedIN(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_errors_in'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'errorIn');
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceErrorAggregatedOUT(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_error_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_errors_out'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'errorOut');
        return this.http.post(url, formData).map(res => <any>res);
    }



    fetchUtilizationInChartDataAggregatedIN(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_error_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in_percent'; // $NEWADDED$

        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationInPercent');
        formData.append('speed', '' + interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }


    fetchUtilizationOutChartDataAggregatedOUT(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_error_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out_percent'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationOutPercent');
        formData.append('speed', '' + interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }

    fetchInterfaceAvailabilityChartDataAggregated(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/interface_error_in_out';
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_availibility'; // $NEWADDED$

        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'interfaceAvailability');
        return this.http.post(url, formData).map(res => <any>res);
    }
    //  interface nadi wala exit




    //  start: interface nadi wala (for hourly button)
    loadInterfaceHourlyData_Bandwidth_In(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        formData.append('speed', interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Bandwidth_Out(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        formData.append('speed', interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Utilization_In(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in_percent_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);

        formData.append('speed', '' + interfaceSpeed);
        // formData.append('column_name', 'utilizationIn');
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Utilization_Out(interface_: string, hostName: string, interfaceSpeed: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out_percent_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        formData.append('speed', '' + interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Error_In(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_errors_in_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Error_Out(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_errors_out_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Packet_In(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_pkts_in_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Packet_Out(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_pkts_out_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        return this.http.post(url, formData).map(res => <any>res);
    }
    loadInterfaceHourlyData_Availibility(interface_: string, hostName: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_availibility_daily_hourly'; // $NEWADDED$
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        // formData.append('column_name', 'utilizationIn');
        return this.http.post(url, formData).map(res => <any>res);
    }
    //  exit: interface nadi wala (for hourly button)



    // nadi wala drill start
    getDrillDataBandwidthAggregatedIN(interface_: any, hostName: any, param: any, urlMappingName: any, interfaceSpeed: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'utilizationIn');
        formData.append('speed', interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }

    getDrillDataBandwidthAgrgregatedOUT(interface_: any, hostName: any, param: any, urlMappingName: any, interfaceSpeed: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'utilizationOut');
        formData.append('speed', interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }

    getDrillDataUnicastAggregatedIN(interface_: any, hostName: any, param: any, urlMappingName: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'pktIn');
        return this.http.post(url, formData).map(res => <any>res);
    }

    getDrillDataUnicastAggregatedOUT(interface_: any, hostName: any, param: any, urlMappingName: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'pktOut');
        return this.http.post(url, formData).map(res => <any>res);
    }

    getDrillDataErrorAggregatedIN(interface_: any, hostName: any, param: any, urlMappingName: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'errorIn');
        return this.http.post(url, formData).map(res => <any>res);
    }

    getDrillDataErrorAggregatedOUT(interface_: any, hostName: any, param: any, urlMappingName: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'errorOut');
        return this.http.post(url, formData).map(res => <any>res);
    }



    getDrillDataUtilizationIn(interface_: any, hostName: any, param: any, urlMappingName: any, interfaceSpeed: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'utilizationInPercent');
        formData.append('speed', interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }


    getDrillDataUtilizationOUT(interface_: any, hostName: any, param: any, urlMappingName: any, interfaceSpeed: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'utilizationOutPercent');
        formData.append('speed', interfaceSpeed);
        return this.http.post(url, formData).map(res => <any>res);
    }


    getDrillDataInterfaceAvailability(interface_: any, hostName: any, param: any, urlMappingName: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();

        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('interface', '' + interface_);
        formData.append('nodeIp', '' + hostName);
        formData.append('column_name', 'interfaceAvailability');
        return this.http.post(url, formData).map(res => <any>res);
    }

    // nadi wala drill exit
    // Ranjeet: Start - Added Memory Utilization,Memory Buffer,etc for device-details.component.ts
    loadRawCPUUtilizationData(hostname: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/cpu_utilization';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_cpu_raw_90_days';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));

        //  const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);

        formData.append('nodeIp', '' + hostname);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadRawMemoryUtilizationData(hostname: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/memory_utilization';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_memory_raw_90_days';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));

        //  const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);

        formData.append('nodeIp', '' + hostname);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadRawMemoryBufferData(hostname: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/buffer_memory_utilization';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_memoryBuffer_raw_90_days';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);
        formData.append('nodeIp', '' + hostname);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadRawTemperatureData(hostname: string, customer_: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/temperature_utilization';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);
        formData.append('deviceIp', '' + hostname);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadRawAvailabilityData(hostname: string, customer_: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/availability_utilization';
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_availability_raw_90_days';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        // const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // if (customer.trim() !== '') {
        //     formData.append('customer', customer);
        // }

        formData.append('customer', customer_);
        formData.append('nodeIp', '' + hostname);
        return this.http.post(url, formData).map(res => <any>res);
    }

    // Ranjeet: End - Added Memory Utilization,Memory Buffer,etc for device-details.component.ts

    loadCpuMemoryData(hostname: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_load';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + hostname);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadDevicePerformanceCPU(hostName: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_performance_cpu';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + hostName);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadDevicePerformanceMemory(hostName: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_performance_memory';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + hostName);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadDevicePerformanceBufferMemory(hostName: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_performance_buffer_memory';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + hostName);
        return this.http.post(url, formData).map(res => <any>res);
    }

    loadDeviceAvailablityStats(hostName: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_performance_availability';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + hostName);
        return this.http.post(url, formData).map(res => <any>res);
    }


    loadCpuMemoryPerformanceChart(hostname: string) {

        const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/kpi/device_load_trend';
        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + hostname);
        return this.http.post(url, formData).map(res => <any>res);
    }

    /**
    *  KPI used in host-interface-events page : Performance-summay-host end
    */


    public getLocationCordinates(address: String, googleApiKey: String) {
        const url_ = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + googleApiKey;
        return this.http.get(url_).map(res => <any>res);
    }


    loadGaugeCpuUtilizationNow(device_ip: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + '/performence/kpi/cpu_utilization_now';
        const url = environment._WEBGATEWAY_BASIC_URL_ + '/performence/api/performance_tcp_load';
        const formData: FormData = new FormData();
        // formData.append('deviceIp', '' + device_ip);
        formData.append('nodeIp', '' + device_ip);
        return this.http.post(url, formData).map(res => <any>res);
    }

    // Ranjeet: Start --  For Hourly button (in Device Overview)
    loadDeviceHourly(column_name: string, device_ip: string, Interface_Id?: string, Interface_Name?: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/cpu_memory_hourly';

        let url = '';
        if (column_name == 'Availability') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_availability_daily_hourly';
        } else if (column_name == 'CPU Usage') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_cpu_daily_hourly';
        } else if (column_name == 'Memory Usage') {
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_memory_daily_hourly'; // $NEWADDED$
        } else if (column_name == 'Buffer Usage') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_memoryBuffer_daily_hourly';
        }


        const formData: FormData = new FormData();
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // console.log(availability, device_ip);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        if (Interface_Name !== undefined) {
            formData.append('Interface_Name', '' + Interface_Name);

        }
        if (Interface_Id !== undefined) {
            formData.append('Interface_Id', '' + Interface_Id);
        }
        formData.append('nodeIp', '' + device_ip);
        formData.append('column_name', '' + column_name);
        // console.log(formData );
        return this.http.post(url, formData).map(res => <any>res);
    }
    // Ranjeet: End --  For Hourly button (in Device Overview)


    // Ranjeet: Start --  For Daily button (in Device Overview)
    loadDrillDataAgGridColumn(column_name: string, device_ip: string, Interface_Id?: string, Interface_Speed?: string) {
        // const url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill/common_device_drill_down';
        const formData: FormData = new FormData();
        let url = '';
        if (column_name == 'Availability') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_availability';
        } else if (column_name == 'CPU Usage') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_cpu';
        } else if (column_name == 'Memory Usage') {
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_memory'; // $NEWADDED$
        } else if (column_name == 'Buffer Usage') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_memoryBuffer'; // $NEWADDED$
        } else if (column_name == 'System Uptime') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/performance_system_uptime_raw'; // $NEWADDED$
        } else if (column_name == 'Interface Availability') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_availibility'; // $NEWADDED$
            if (Interface_Id !== undefined) {
                formData.append('interface', '' + Interface_Id);
            }
        } else if (column_name == 'Bandwidth In(Bits)') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in'; // $NEWADDED$
            if (Interface_Id !== undefined) {
                formData.append('interface', '' + Interface_Id);
            }
        } else if (column_name == 'Bandwidth Out(Bits)') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out'; // $NEWADDED$
            if (Interface_Id !== undefined) {
                formData.append('interface', '' + Interface_Id);
            }
        } else if (column_name == 'Utilization IN (%)') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in_percent'; // $NEWADDED$
            if (Interface_Id !== undefined) {
                formData.append('interface', '' + Interface_Id);
                // formData.append('speed', '' + Interface_Speed);
            }
        } else if (column_name == 'Utilization OUT (%)') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out_percent'; // $NEWADDED$
            if (Interface_Id !== undefined) {
                formData.append('interface', '' + Interface_Id);
                // formData.append('speed', '' + Interface_Speed);
            }
        } else if (column_name == 'Bandwidth In') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in'; // $NEWADDED$
            if (Interface_Id !== undefined) {
                formData.append('interface', '' + Interface_Id);
            }
        } else if (column_name == 'Bandwidth Out') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out'; // $NEWADDED$
            if (Interface_Id !== undefined) {
                formData.append('interface', '' + Interface_Id);
            }
        }



        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // console.log(availability, device_ip);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        if (Interface_Speed !== undefined) {
            formData.append('speed', '' + Interface_Speed);

        }
        if (Interface_Id !== undefined) {
            formData.append('Interface_Id', '' + Interface_Id);
        }
        formData.append('nodeIp', '' + device_ip);
        // formData.append('column_name', '' + column_name);
        // console.log(formData );
        return this.http.post(url, formData).map(res => <any>res);


        // return this.http.get('http://www.mocky.io/v2/5ebd0ae531000092005b0f87').map(res => <any>res);
    }


    loadDrillDataAgGridColumn_BackupLink(column_name: string, param: any) {
        const formData: FormData = new FormData();
        let url = '';
        if (column_name == 'Interface Availability') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_availibility_hourly'; // $NEWADDED$
        } else if (column_name == 'Bandwidth In(Bits)') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_in_hourly'; // $NEWADDED$
        } else if (column_name == 'Bandwidth Out(Bits)') {
            // const url = 'http://172.27.64.97:8090/' + 'performence/api/device_list'; // $NEWADDED$
            url = environment._WEBGATEWAY_BASIC_URL_ + 'performence/drill_dn/drilldown_utilization_out_hourly'; // $NEWADDED$
        }
        const key_ = Object.keys(param);
        key_.forEach(e_ => {
            formData.append('' + e_, '' + param[e_]);
        });
        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }


    // Ranjeet: End --  For Daily button (in Device Overview)

    public getPerformanceDrillData(urlMappingName, param, column_name: string, device_ip: string, Interface_Id?: string, Interface_Speed?: string) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // console.log(availability, device_ip);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        formData.append('nodeIp', '' + device_ip);
        formData.append('column_name', '' + column_name);
        if (Interface_Speed !== undefined) {
            formData.append('speed', '' + Interface_Speed);

        }
        if (Interface_Id !== undefined) {
            formData.append('Interface_Id', '' + Interface_Id);
            formData.append('interface', '' + Interface_Id);
        }

        return this.http.post(url, formData).map(res => <any>res);
    }

    public getPerformanceDrillData_BackupLink(urlMappingName, param, formDataParams: any) {
        const url = environment._WEBGATEWAY_BASIC_URL_ + urlMappingName;
        const formData: FormData = new FormData();
        if (param.length > 0) {
            param.forEach(element => {
                const keys = Object.keys(element);
                keys.forEach(key => {
                    if (key == 'key') {
                        // const date_: Date = new Date(element[key].split('#')[0]);
                        formData.append('clickDate', '' + element[key].split('#')[0]);
                    }
                });
            });
        }


        const key_ = Object.keys(formDataParams);
        key_.forEach(e_ => {
            formData.append('' + e_, '' + formDataParams[e_]);
        });

        formData.append('startDate', '' + this.timeRange['timestamp_start']);
        formData.append('endDate', '' + this.timeRange['timestamp_end']);
        formData.append('timeType', '' + this.validateTimeTypeAllowed(this.timeRange['timeType']));
        const customer = this.findSelectedCustomers(this.globalFilters['customers']);
        // console.log(availability, device_ip);
        if (customer.trim() !== '') {
            formData.append('customer', customer);
        }
        return this.http.post(url, formData).map(res => <any>res);
    }

}
