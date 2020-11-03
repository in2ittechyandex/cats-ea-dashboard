import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'; 

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { Router } from '@angular/router';
import { CloudDevOpsService } from './clouddevops.services';

declare var moment: any;

@Component({
  selector: 'cats-cloud-dev-ops',
  templateUrl: './cloud-dev-ops.component.html',
  styleUrls: ['./cloud-dev-ops.component.css']
})
export class CloudDevOpsComponent implements OnInit {
  closeResult = '';
  dateFilter_timeType = 'td';
  dateFilter_startDate = moment().startOf('day');  // moment().subtract(1, 'hours');
  dateFilter_endDate = moment(); // moment();
  dateFillter_customRanges = [
    // 'Last 1 Hour',
    'Today',
    'Yesterday',
    'Last 7 Days ',
    'This Month ',
    'Last 3 Months ',
    'Last 6 Months ',
    'This Year '
  ];
  selectedTimeRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };
  globalFilterModal = {
    isListenOnBlur: false,
    isListenOnBlur_AssigneeGroup: false,
    identifier: 'global-customer-filter',
    identifier_AssigneeGroup: 'global-assigneegroup-filter',
    filtersToggle: false,
    customers: [],
    masterSelectedCustomer: false,
    assigneeGroup: [{ name: 'ASD', value: false }, { name: 'Non-ASD', value: false }],
    userTabFilters: null,

    editCustomers: [],
    modifyCustomer: [],

    masterSelectedAsigneeGroup: false,

    asd: [],
    editAsd: [],
    modifyAsd: [],
    isListenOnBlurASD: false,
    masterSelectedASD: false,


    nonAsd: [],
    editNonASD: [],
    modifyNonASD: [],
    isListenOnBlurNONASD: false,
    masterSelectedNONASD: false,

    timeType: 'cu'
  };
  public timeServicesSubsc$: Subscription;
  taskData={
    opened:[],
    assigned:[],
    inprogress:[],
    resolved:[]
  }
  constructor(private clouddevopsservice:CloudDevOpsService, private router: Router,private timeServices_: TimeFilterService, private modalService: NgbModal) {
    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.onTsModified(obj);
    });
    // this.taskData.opened=[{"id":"case_20201007-081311_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-081311_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074423_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-074423_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:41","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:40","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-072842_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-072842_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-071342_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071342_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-071337_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071337_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-062832_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-062832_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-061309_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061309_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055805_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:17","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-055805_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054303_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-054303_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201006-084858_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-06 08:49:29","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"}];
    // this.taskData.assigned=[{"id":"case_20201007-081311_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-081311_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074423_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-074423_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:41","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:40","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-072842_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-072842_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-071342_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071342_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-071337_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071337_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-062832_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-062832_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-061309_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061309_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055805_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:17","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-055805_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054303_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-054303_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201006-084858_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-06 08:49:29","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"}];
    // this.taskData.inprogress=[{"id":"case_20201007-081311_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-081311_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074423_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-074423_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:41","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:40","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-072842_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-072842_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-071342_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071342_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-071337_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071337_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-062832_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-062832_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-061309_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061309_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055805_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:17","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-055805_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054303_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-054303_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201006-084858_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-06 08:49:29","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"}];
    // this.taskData.resolved=[{"id":"case_20201007-081311_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-081311_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:30","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-081312_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 08:13:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074423_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-074423_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:44:57","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:41","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-074321_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:43:40","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-072842_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-072842_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:29:05","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-071342_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071342_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-071337_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-071337_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 07:14:11","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-062832_4","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-062832_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:28:53","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Environmental"},{"id":"case_20201007-061309_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061309_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:18","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-061306_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 06:13:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055819_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:26","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"Voice"},{"id":"case_20201007-055805_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:17","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-055805_1","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:58:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054303_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201007-054303_0","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:16","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_3","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"TX"},{"id":"case_20201007-054302_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-07 05:43:15","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"},{"id":"case_20201006-084858_2","username":"Sudhir shukla","status":"OPEN","time":"2020-10-06 08:49:29","network":"network event","sys_id":"123456","ticket_number":"NET234543","tech":"RF"}];

  }

  onTsModified(info) {
    const str = {
      timestamp_start: info.timestamp.start,
      timestamp_end: info.timestamp.end,
      date_start: info.date.start,
      date_end: info.date.end,
      timeType: info.timeType.value
    };
    this.selectedTimeRange = str;
    this.globalFilterModal.timeType = info.timeType.value;
    console.log(this.selectedTimeRange)
  }

  showDD(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlur'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  
  globalFilterClickOutSide(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur = false;
    document.getElementById(identifir).click();
  }

  ngOnInit() {
    this.getAllSituation();
  }
    getAllSituation(){
      this.clouddevopsservice.getSituations('Open').subscribe((res)=>{
        if(res['status']){
          this.taskData.opened=res['data'];
        }
      })
      this.clouddevopsservice.getSituations('assigned').subscribe((res)=>{
        if(res['status']){
          this.taskData.assigned=res['data'];
        }
      })
      this.clouddevopsservice.getSituations('inprogress').subscribe((res)=>{
        if(res['status']){
          this.taskData.inprogress=res['data'];
        }
      })
      this.clouddevopsservice.getSituations('resolved').subscribe((res)=>{
        if(res['status']){
          this.taskData.resolved=res['data'];
        }
      })
    } 

  open(content ) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass: 'my-class'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if (this.timeServicesSubsc$ && this.timeServicesSubsc$ != null) {
      this.timeServicesSubsc$.unsubscribe();
    }
  }
  navigateToSituation(caseItem){
    var caseData = {
     caseId:'',
     caseStatus:"",
     network:"",
     time:"",
     tech:"",
     ticket_number:""
   };
    
   caseData.caseId=caseItem.id;
   caseData.caseStatus=caseItem.status;
   caseData.network=caseItem.network;
   caseData.time=caseItem.time;
   caseData.ticket_number=caseItem.ticket_number;
   caseData.tech=caseItem.tech;
   
   localStorage.setItem('currentCase',JSON.stringify(caseData));
   this.router.navigateByUrl('dashboard/engineer-view/my-alerts');
 }
}
