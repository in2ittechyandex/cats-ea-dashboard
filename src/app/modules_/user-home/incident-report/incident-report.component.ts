import themeConf_ from '../../../config/theme-settings';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { SharedServices } from 'src/app/shared_/shared.services';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import pageSettings from 'src/app/config/page-settings';
import * as $ from 'jquery';
import { ReportService } from 'src/app/services_/report.services';
declare var moment: any;

@Component({
  selector: 'cats-incident-report',
  templateUrl: './incident-report.component.html',
  styleUrls: ['./incident-report.component.css']
})
export class IncidentReportComponent implements OnInit, OnDestroy, AfterViewInit {

  timeMap = {
    'now': 'Now',
    'l1h': 'Last 1 Hour',
    'td': 'Today',
    'yd': 'Yesterday',
    '7d': 'Last 7 Days',
    'i7d': 'Last 7 Days ',
    'cm': 'This Month',
    'icm': 'This Month ',
    'lm': 'Last Month',
    'l3m': 'Last 3 Months',
    'l6m': 'Last 6 Months',
    'cy': 'This Year',
    'cu': 'Custom Range'
  };
  modalReferenceAddReport: any;
  closeResult: string;

  pageSettings;
  themeConf_;
  public timeServicesSubsc$: Subscription;
  selectedTimeRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };

  //#region: filter_model start
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

  public scheduleObj = {
    reportName: '',
    email: '',
    format: 'pdf',
    duration: 'daily',
    selTime: ''
  };

  // download now
  public reportObj = {
    reportName: '',
    format: 'pdf'
  };

  public flInputCust_ = new FormControl();
  public flTxtCust_: string;
  //#region: filter_model end

  //#region agGrid declaration start
  incidentList: any[];
  // ag-grid specific
  public gridApi;
  public gridParams;
  public gridColumnApi;
  public columnDefs;
  public context;
  public defaultColDef;
  public rowData;
  public frameworkComponents;
  private getRowHeight;

  // default 7 days
  // dateFilter_timeType = '7d';
  // dateFilter_startDate = moment().subtract(6, 'days').startOf('day');
  // dateFilter_endDate = moment().endOf('day');
  // dateFillter_customRanges = ['Last 1 Hour', 'Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month'];

  dateFilter_timeType = 'i7d';
  dateFilter_startDate = moment().subtract(7, 'days').startOf('day');  // moment().subtract(1, 'hours');
  dateFilter_endDate = moment(); // moment();
  dateFillter_customRanges = [
    'Last 1 Hour',
    'Today',
    'Yesterday',
    'Last 7 Days ',
    'This Month ',
    'Last Month',
  ];


  @Input() paginationPageSize = 20;
  @Input() paginationLimits = [10, 20, 50, 100, 500, 1000];
  @Output() pageSizeChange = new EventEmitter();

  modPagination = {
    'totalRecords': 0,
    'currentPage': 0,
    'totalPages': 0,
    'recordsOnPage': 0,
    'isLastPage': false
  };

  public dbAllcolumns = [
    {
      'headerName': 'Number',
      'field': 'number',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Number',
    },
    {
      'headerName': 'Opco',
      'field': 'opco',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Opco'
    },
    {
      'headerName': 'Work Notes List',
      'field': 'workNotesList',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Work Notes List'
    },
    {
      'headerName': 'Work Notes',
      'field': 'workNotes',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Work Notes'
    },
    {
      'headerName': 'Watch List',
      'field': 'watchList',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Watch List'
    },
    {
      'headerName': 'Voice Tags',
      'field': 'voiceTags',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Voice Tags'
    },
    {
      'headerName': 'Vendor Ticket Reference',
      'field': 'vendorTicketReference',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Vendor Ticket Reference'
    },
    {
      'headerName': 'Vendor List',
      'field': 'vendorList',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Vendor List'
    },
    {
      'headerName': 'Vendor Communication',
      'field': 'vendorCommunication',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Vendor Communication'
    },
    {
      'headerName': 'Vendor Subject',
      'field': 'vendorSubject',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Vendor Subject'
    },
    {
      'headerName': 'User Input',
      'field': 'userInput',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'User Input'
    },
    {
      'headerName': 'Urgency1',
      'field': 'urgency1',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Urgency1'
    },
    {
      'headerName': 'Urgency2',
      'field': 'urgency2',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Urgency2'
    },
    {
      'headerName': 'Upon Reject',
      'field': 'uponReject',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Upon Reject'
    },
    {
      'headerName': 'Upon Approval',
      'field': 'uponApproval',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Upon Approval'
    },
    {
      'headerName': 'Updates',
      'field': 'updates',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Updates'
    },
    {
      'headerName': 'Updated By Customer',
      'field': 'updatedByCustomer',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Updated By Customer'
    },
    {
      'headerName': 'Updated By',
      'field': 'updatedBy',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Updated By'
    },
    {
      'headerName': 'Traffic Direction',
      'field': 'trafficDirection',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Traffic Direction'
    },
    {
      'headerName': 'Time Worked',
      'field': 'timeWorked',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Time Worked'
    },
    {
      'headerName': 'Ticket Type',
      'field': 'ticketType',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Ticket Type',
    },
    {
      'headerName': 'Task Type',
      'field': 'taskType',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Task Type'
    },
    {
      'headerName': 'Tags',
      'field': 'tags',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Tags'
    },
    {
      'headerName': 'Subcategory',
      'field': 'subcategory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Subcategory'
    },
    {
      'headerName': 'Service Order',
      'field': 'serviceOrder',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Service Order'
    },
    {
      'headerName': 'Service Id Received',
      'field': 'serviceIdReceived',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Service IdR eceived'
    },
    {
      'headerName': 'Service Flag1',
      'field': 'serviceFlag1',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Service Flag1'
    },
    {
      'headerName': 'Service Flag2',
      'field': 'serviceFlag2',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Service Flag2'
    },
    {
      'headerName': 'SlaDue',
      'field': 'slaDue',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'SlaDue'
    },
    {
      'headerName': 'Responded',
      'field': 'responded',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Responded'
    },
    {
      'headerName': 'Resource Type Search',
      'field': 'resourceTypeSearch',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resource Type Search'
    },
    {
      'headerName': 'Resolved By',
      'field': 'resolvedBy',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resolved By'
    },
    {
      'headerName': 'Reopen Count',
      'field': 'reopenCount',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Reopen Count'
    },
    {
      'headerName': 'Reassignment Count',
      'field': 'reassignmentCount',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Reassignment Count'
    },
    {
      'headerName': 'Problem',
      'field': 'problem',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Problem'
    },
    {
      'headerName': 'Probable Cause',
      'field': 'probableCause',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Probable Cause'
    },
    {
      'headerName': 'Peering Exchange',
      'field': 'peeringExchange',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Peering Exchange'
    },
    {
      'headerName': 'Peering Customer',
      'field': 'peeringCustomer',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'PeeringCustomer'
    },
    {
      'headerName': 'Peering Category',
      'field': 'peeringCategory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Peering Category'
    },
    {
      'headerName': 'Parent Incident',
      'field': 'parentIncident',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Parent Incident'
    },
    {
      'headerName': 'Parent',
      'field': 'parent',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Parent'
    },
    {
      'headerName': 'Owner Group',
      'field': 'ownerGroup',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Owner Group'
    },
    {
      'headerName': 'Owner',
      'field': 'owner',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Owner'
    },
    {
      'headerName': 'Order',
      'field': 'order',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Order'
    },
    {
      'headerName': 'Opened By',
      'field': 'openedBy',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Opened By'
    },
    {
      'headerName': 'On Hold Reason',
      'field': 'onHoldReason',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'On Hold Reason'
    },
    {
      'headerName': 'Notify',
      'field': 'notify',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Notify'
    },
    {
      'headerName': 'Net Cool User',
      'field': 'netCoolUser',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Net Cool User'
    },
    {
      'headerName': 'Nms Name',
      'field': 'nmsName',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Nms Name'
    },
    {
      'headerName': 'NeName',
      'field': 'neName',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'NeName'
    },
    {
      'headerName': 'Location',
      'field': 'location',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Location'
    },
    {
      'headerName': 'Linked Incident',
      'field': 'linkedIncident',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Linked Incident'
    },
    {
      'headerName': 'Last Reopened By',
      'field': 'lastReopenedBy',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Last Reopened By'
    },
    {
      'headerName': 'Last Reopened At',
      'field': 'lastReopenedAt',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Last Reopened At'
    },
    {
      'headerName': 'Knowledge',
      'field': 'knowledge',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Knowledge'
    },
    {
      'headerName': 'Internal Peering Request',
      'field': 'internalPeeringRequest',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Internal Peering Request'
    },
    {
      'headerName': 'Incident Type',
      'field': 'incidentType',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Incident Type'
    },
    {
      'headerName': 'Incident State',
      'field': 'incidentState',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Incident State'
    },
    {
      'headerName': 'Incident Fix Time',
      'field': 'incidentFixTime',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Incident Fix Time'
    },
    {
      'headerName': 'Incident Duration',
      'field': 'incidentDuration',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Incident Duration'
    },
    {
      'headerName': 'Impact',
      'field': 'impact',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Impact'
    },
    {
      'headerName': 'InmsName',
      'field': 'inmsName',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'InmsName'
    },
    {
      'headerName': 'Group List',
      'field': 'groupList',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Group List'
    },
    {
      'headerName': 'Follow Up',
      'field': 'followUp',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Follow Up'
    },
    {
      'headerName': 'First Occurence',
      'field': 'firstOccurence',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'First Occurence'
    },
    {
      'headerName': 'First Close',
      'field': 'firstClose',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'First Close'
    },
    {
      'headerName': 'Fms Severity',
      'field': 'fmsSeverity',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Fms Severity'
    },
    {
      'headerName': 'Expected Start',
      'field': 'expectedStart',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Expected Start'
    },
    {
      'headerName': 'Escalation',
      'field': 'escalation',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Escalation'
    },
    {
      'headerName': 'Escalated',
      'field': 'escalated',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Escalated'
    },
    {
      'headerName': 'Duration',
      'field': 'duration',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Duration'
    },
    {
      'headerName': 'Domain Path',
      'field': 'domainPath',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Domain Path'
    },
    {
      'headerName': 'Domain',
      'field': 'domain',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Domain'
    },
    {
      'headerName': 'Destinations',
      'field': 'destinations',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Destinations'
    },
    {
      'headerName': 'Delivery Task',
      'field': 'deliveryTask',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Delivery Task'
    },
    {
      'headerName': 'Delivery Plan',
      'field': 'deliveryPlan',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Delivery Plan'
    },
    {
      'headerName': 'Customer Ticket Reference',
      'field': 'customerTicketReference',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Customer Ticket Reference'
    },
    {
      'headerName': 'Customer Category',
      'field': 'customerCategory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Customer Category'
    },
    {
      'headerName': 'Created By',
      'field': 'createdBy',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Created By'
    },
    {
      'headerName': 'Created',
      'field': 'created',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Created'
    },
    {
      'headerName': 'Correlation Display',
      'field': 'correlationDisplay',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Correlation Display'
    },
    {
      'headerName': 'CorrelationId',
      'field': 'correlationId',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'CorrelationId'
    },
    {
      'headerName': 'Contact Type',
      'field': 'contactType',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Contact Type'
    },
    {
      'headerName': 'Configuration Item',
      'field': 'configurationItem',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Configuration Item'
    },
    {
      'headerName': 'Comments And Work Notes',
      'field': 'commentsAndWorkNotes',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Comments And Work Notes'
    },
    {
      'headerName': 'Closed By',
      'field': 'closedBy',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Closed By'
    },
    {
      'headerName': 'Close Notes',
      'field': 'closeNotes',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Close Notes'
    },
    {
      'headerName': 'Change Request',
      'field': 'changeRequest',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Change Request'
    },
    {
      'headerName': 'Caused By Change',
      'field': 'causedByChange',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Caused By Change'
    },
    {
      'headerName': 'Business Resolve Time',
      'field': 'businessResolveTime',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Business Resolve Time'
    },
    {
      'headerName': 'Approval Set',
      'field': 'approvalSet',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Approval Set'
    },
    {
      'headerName': 'Approval History',
      'field': 'approvalHistory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Approval History'
    },
    {
      'headerName': 'Approval',
      'field': 'approval',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Approval'
    },
    {
      'headerName': 'Alert Type',
      'field': 'alertType',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Alert Type'
    },
    {
      'headerName': 'Alert Subcategory',
      'field': 'alertSubcategory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Alert Subcategory'
    },
    {
      'headerName': 'Alert Name',
      'field': 'alertName',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Alert Name'
    },
    {
      'headerName': 'Alert Id',
      'field': 'alertId',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Alert Id'
    },
    {
      'headerName': 'Alert Category',
      'field': 'alertCategory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Alert Category'
    },
    {
      'headerName': 'Additional Comments',
      'field': 'additionalComments',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Additional Comments'
    },
    {
      'headerName': 'Additional Assignee List',
      'field': 'additionalAssigneeList',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Additional Assignee List'
    },
    {
      'headerName': 'Actual End',
      'field': 'actualEnd',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Actual End'
    },
    {
      'headerName': 'Activity Due',
      'field': 'activityDue',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Activity Due'
    },
    {
      'headerName': 'Active',
      'field': 'active',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Active'
    },
    {
      'headerName': 'Amo Search',
      'field': 'amoSearch',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Amo Search'
    },
    {
      'headerName': 'Amo',
      'field': 'amo',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Amo'
    },
    {
      'headerName': 'Time',
      'field': 'time',
      'sortable': true,
      'editable': false,
      'filter': 'agDateColumnFilter',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Time'
    },
    {
      'headerName': 'Priority',
      'field': 'priority',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Priority'
    },
    {
      'headerName': 'Customer',
      'field': 'customer',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Customer'
    },
    {
      'headerName': 'Business Service',
      'field': 'businessService',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Business Service'
    },
    {
      'headerName': 'Service Offering',
      'field': 'serviceOffering',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Service Offering'
    },
    {
      'headerName': 'Opened',
      'field': 'opened',
      'sortable': true,
      'editable': false,
      'filter': 'agDateColumnFilter',
      'filterParams': {
        // provide comparator function
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          const dateAsString = cellValue; // moment(cellValue).format('DD/MM/YYYY');
          const dateParts = dateAsString.split('/');
          const cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        },
        'filterOptions': ['equals', 'greaterThan', 'lessThan' , 'notEqual' , 'inRange']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Opened',
      'valueGetter': this.doConversionTime.bind(this),
      'cellRenderer': this.doConversionTime.bind(this),

    },
    {
      'headerName': 'Due Date',
      'field': 'dueDate',
      'sortable': true,
      'editable': false,
      'filter': 'agDateColumnFilter',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Due Date'
    },
    {
      'headerName': 'Updated',
      'field': 'updated',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Updated'
    },
    {
      'headerName': 'ActualStart Time',
      'field': 'actualStartTime',
      'sortable': true,
      'editable': false,
      'filter': 'agDateColumnFilter',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'ActualStart Time'
    },
    {
      'headerName': 'Resolved',
      'field': 'resolved',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resolved'
    },
    {
      'headerName': 'Closed',
      'field': 'closed',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Closed'
    },
    {
      'headerName': 'Resolve Time',
      'field': 'resolveTime',
      'sortable': true,
      'editable': false,
      'filter': 'agDateColumnFilter',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resolve Time'
    },
    {
      'headerName': 'Resolution Category',
      'field': 'resolutionCategory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resolution Category'
    },
    {
      'headerName': 'MadeSla',
      'field': 'madeSla',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'MadeSla'
    },
    {
      'headerName': 'Caller',
      'field': 'caller',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Caller'
    },
    {
      'headerName': 'State',
      'field': 'state',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'State'
    },
    {
      'headerName': 'Category',
      'field': 'category',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Category'
    },
    {
      'headerName': 'Assignment Group',
      'field': 'assignmentGroup',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Assignment Group'
    },
    {
      'headerName': 'Short Description',
      'field': 'shortDescription',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Short Description'
    },
    {
      'headerName': 'Description',
      'field': 'description',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Description'
    },
    {
      'headerName': 'Assigned To',
      'field': 'assignedTo',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Assigned To'
    },
    {
      'headerName': 'Updated By2',
      'field': 'updatedBy2',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Updated By2'
    },
    {
      'headerName': 'Business Duration',
      'field': 'businessDuration',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Business Duration'
    },
    {
      'headerName': 'Child Incidents',
      'field': 'childIncidents',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Child Incidents'
    }
  ];

  //  public dbAllcolumns = [
  //   {
  //     "headerName": "Number",
  //     "field": "number",
  //     "sortable": true,
  //     "editable": false,
  //     "filter": 'agTextColumnFilter',
  //     "filterParams": {
  //       "filterOptions": ['contains', 'notContains']
  //     },
  //     "width": 100,
  //     "isActive": true,
  //     "headerTooltip": "Number",
  //   },
  //   {
  //     "headerName": "Opco",
  //     "field": "opco",
  //     "sortable": true,
  //     "editable": false,
  //     "filter": 'agTextColumnFilter',
  //     "filterParams": {
  //       "filterOptions": ['contains', 'notContains']
  //     },
  //     "width": 100,
  //     "isActive": true,
  //     "headerTooltip": "Opco"
  //   },
  //  ];

  allFilters: { headerName: any; fieldName: any; filter: any[]; }[];
  scheduleReport: any;


  //#region agGrid declaration end

  constructor(
    private modalService: NgbModal,
    private timeServices_: TimeFilterService,
    private reportService_: ReportService,
    private sharedServices_: SharedServices) {
    this.pageSettings = pageSettings;
    this.pageSettings.pageSidebarMinified = true;


    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.onTsModified(obj);
    });

    this.onTsModified({
      date: {
        start: this.dateFilter_startDate,
        end: this.dateFilter_endDate
      },
      timestamp: {
        start: Date.parse(this.dateFilter_startDate),
        end: Date.parse(this.dateFilter_endDate),
      },
      timeType: {
        value: this.dateFilter_timeType
      }
    });

    this.columnDefs = this.getActiveColumns(this.dbAllcolumns);
    this.defaultColDef = {
      filter: true,
      // editable: true,
      resizable: true,

    };
    this.context = { componentParent: this };
    this.getRowHeight = function (params) {
      return 50;
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridParams = params;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  getActiveColumns(columns_: Array<any>) {
    const activeColumns = columns_.filter(elm => {
      return elm['isActive'];
    });
    return activeColumns;
  }
  onGridPivotSelection() {
    this.gridApi.setColumnDefs([]);
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setColumnDefs(this.getActiveColumns(this.dbAllcolumns));
    this.gridApi.sizeColumnsToFit();
  }
  /**
   *  agGrid : custom pagination start
   */
  onPaginationChanged(event) {
    if (this.gridApi) {
      this.modPagination.totalRecords = 0;
      this.modPagination.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
      this.modPagination.totalPages = this.gridApi.paginationGetTotalPages();
      this.modPagination.recordsOnPage = this.gridApi.paginationGetPageSize();
      this.modPagination.isLastPage = this.gridApi.paginationIsLastPageFound();
    }
  }

  onBtFirst() {
    this.gridApi.paginationGoToFirstPage();
  }

  onBtLast() {
    this.gridApi.paginationGoToLastPage();
  }

  onBtNext() {
    this.gridApi.paginationGoToNextPage();
  }

  onBtPrevious() {
    this.gridApi.paginationGoToPreviousPage();
  }

  selectPageCounts(value) {
    this.gridApi.paginationSetPageSize(Number(value));
    this.gridApi.sizeColumnsToFit();
  }
  // var filterInstance = gridApi.getFilterInstance('name');
  /**
   *  agGrid : custom pagination end
   */

  /** Download Reports start */
  // exportReportData() {
  //   const params = {
  //     'skipHeader': false,
  //     'columnGroups': true,
  //     'skipGroups': false,
  //     'allColumns': true,
  //     'fileName': 'Report',
  //     'columnSeparator': ''
  //   };

  //   this.gridApi.exportDataAsCsv(params);
  // }
  /** End Download Reports  */

  getHeaders() {
    const timeType = this.timeMap[this.selectedTimeRange.timeType];
    const startTime = this.selectedTimeRange['timestamp_start'];
    const endTime = this.selectedTimeRange['timestamp_end'];
    let str = '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const myDateStart = new Date(startTime);
    const myDateEnd = new Date(endTime);
    str += timeType + ' (';
    if (timeType == 'l1h') {
      str += this.getDatePart(myDateStart)['full'] + ' - ' + this.getDatePart(myDateEnd)['full'];
    } else {
      str += this.getDatePart(myDateStart)['d_'] + '' + ' - ' + this.getDatePart(myDateEnd)['d_'] + '';
    }
    str += ')';
    return str;
  }

  getDatePart(myDateStart: Date) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datePart_ = monthNames[myDateStart.getMonth()] + ' '
      + (myDateStart.getDate() < 10 ? '0' : '') + myDateStart.getDate() + ', ' + myDateStart.getFullYear();
    const timePart = (myDateStart.getHours() < 10 ? '0' : '') + myDateStart.getHours()
      + ':' + (myDateStart.getMinutes() < 10 ? '0' : '') + myDateStart.getMinutes() + ':'
      + (myDateStart.getSeconds() < 10 ? '0' : '') + myDateStart.getSeconds();

    return {
      d_: datePart_,
      t_: timePart,
      full: datePart_ + ' ' + timePart
    };
  }



  ngOnInit() {
    this.loadReportData();
    this.themeConf_ = themeConf_;
    $('.Show').click(function () {
      $('#target_allSaturation').show(500);
      $('.Show').hide(0);
      $('.Hide').show(0);
    });
    $('.Hide').click(function () {
      $('#target_allSaturation').hide(500);
      $('.Show').show(0);
      $('.Hide').hide(0);
    });
    $('.toggle').click(function () {
      $('#target_allSaturation').toggle('slow');
    });

    this.initFilterInputCustomer();
    // this.loadUserTabFilter();
  }
  //#region  business logic start
  loadReportData() {
    this.showGridLoader();
    this.allFilters = [];
    this.reportService_.getAllIncidentTickets(this.globalFilterModal, this.selectedTimeRange).subscribe(res => {
      this.hideGridLoader();
      if (res['status'] === true) {
        this.incidentList = res.data;
      }

    }, err => {
      this.incidentList = [];
      this.hideGridLoader();
      swal('', 'Oops ! Getting Error While Loading Data', 'error');
    });

  }
  //#region  business logic end
  showGridLoader() {
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }
  hideGridLoader() {
    if (this.gridApi) {
      this.gridApi.hideOverlay();
    }
  }
  ngOnDestroy() {
    this.pageSettings.pageSidebarMinified = false;
    if (this.timeServicesSubsc$) {
      this.timeServicesSubsc$.unsubscribe();
    }
  }
  ngAfterViewInit() {
    // setTimeout(() => { this.pageSettings.pageSidebarMinified = true; }, 200);
  }
  //#region filter_implementation start

  /**
 *  will detect customer filter search option based on debouncetime
 */
  initFilterInputCustomer() {
    this.flTxtCust_ = '';
    this.flInputCust_
      .valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => {
        this.flTxtCust_ = term;
      });
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
  }

  onGlobalFilterChange() {
    this.compareUserTabGlobalFilterModification();
  }
  onGlobalFilterToggle() {
    $('.gf_box').animate({
      width: 'toggle'
    });
  }

  doConversionTime(params): string {
    if (params.data.opened && params.data.opened != null) {
      return moment(params.data.opened).format('DD/MM/YYYY h:mm:ss');
      // return moment(params.data.opened).format('DD/MM/YYYY');
    } else {
      return '';
    }
  }

  /**
 *  load all filters code start
 */
  // loadUserTabFilter() {
  //   this.reportService_.loadUserTabFilter(0).subscribe(res => {
  //     if (res['status'] == true) {
  //       // const userTabFilter: UserTabFilterVM = new UserTabFilterVM(res['data']);
  //       this.bindUserTabFilterData(res['data']);
  //     }
  //   }, err => {

  //   });
  // }

  /**
    *  This f/n will prepare global filter model object
    * @param obj  : filter object
    */
  bindUserTabFilterData(obj: any) {
    if (obj['customers']) {
      const custSort_ = this.sharedServices_.sortByKey(obj['customers'], 'name');
      this.globalFilterModal.customers = this.deepClone(custSort_);
      this.globalFilterModal.editCustomers = this.deepClone(custSort_);
      this.globalFilterModal.modifyCustomer = this.deepClone(custSort_);
    }
    if (obj['asd']) {
      const asdSort_ = this.sharedServices_.sortByKey(obj['asd'], 'name');
      this.globalFilterModal.asd = this.deepClone(asdSort_);
      this.globalFilterModal.editAsd = this.deepClone(asdSort_);
      this.globalFilterModal.modifyAsd = this.deepClone(asdSort_);
    }
    if (obj['non_asd']) {
      const asdSort_ = this.sharedServices_.sortByKey(obj['non_asd'], 'name');
      this.globalFilterModal.nonAsd = this.deepClone(asdSort_);
      this.globalFilterModal.editNonASD = this.deepClone(asdSort_);
      this.globalFilterModal.modifyNonASD = this.deepClone(asdSort_);
    }
    this.globalFilterModal.timeType = obj['time_type'] ? obj['time_type'] : 'cu';

    // TODO : make hit to fetch all reports data.
    this.loadReportData();
  }

  /**
  * This f/n will return an duplicate array
  * Deep Copy
  * @param oldArray
  */
  deepClone(oldArray: Object[]) {
    const newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }

  public compareUserTabGlobalFilterModification() {
    this.globalFilterModal.modifyCustomer = this.detectChanges(this.globalFilterModal.editCustomers, this.globalFilterModal.customers);
    this.globalFilterModal.modifyAsd = this.detectChanges(this.globalFilterModal.editAsd, this.globalFilterModal.asd);
    this.globalFilterModal.modifyNonASD = this.detectChanges(this.globalFilterModal.editNonASD, this.globalFilterModal.nonAsd);

    // TODO : update Report filter : if needed

    // TODO: fetch incident data api
    this.loadReportData();
  }

  detectChanges(actualFilters: Array<any>, editFilters: Array<any>) {
    const modifiedFilters: Array<any> = [];
    actualFilters.forEach((filVal, index) => {
      if (filVal.value !== editFilters[index].value) {
        modifiedFilters[modifiedFilters.length] = editFilters[index];
      }
    });
    return modifiedFilters;
  }


  open(content, size) {
    this.scheduleObj.selTime = this.getHeaders();
    this.modalReferenceAddReport = this.modalService.open(content, { size: size ? size : 'lg', backdrop: 'static' });
    this.modalReferenceAddReport.result.then((result) => {
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

  // updateUserTabFilters() {
  //   this.reportService_.updateUserTabFilter(0, this.globalFilterModal).subscribe(res => {
  //     if (res['status'] == true) {
  //       // const userTabFilter: UserTabFilterVM = new UserTabFilterVM(res['data']);
  //       swal({
  //         position: 'center',
  //         type: 'success',
  //         title: '',
  //         titleText: 'Filter Saved Successfully',
  //         showConfirmButton: false,
  //         timer: 1000
  //       });
  //     }
  //   }, err => {

  //   });
  // }

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

  showDDASD(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlurASD'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  showDDASDTemp(event, obj_, targetId, targetListen) {
    setTimeout(function () {
      // const element_: Element = (event.target as Element);
      const elementDD: Element = document.getElementById(targetId);
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_[targetListen] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  hideDDASDTemp(event, obj_, targetId, targetListen) {
    setTimeout(function () {
      // const element_: Element = (event.target as Element);
      const elementDD: Element = document.getElementById(targetId);
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass;
      obj_[targetListen] = false;
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  showDDNONASD(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlurNONASD'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  showDDAssigneeGroup(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlur_AssigneeGroup'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  globalFilterClickOutSide(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur = false;
    document.getElementById(identifir).click();
  }

  globalFilterClickOutSideASD(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlurASD = false;
    document.getElementById(identifir).click();
  }

  globalFilterClickOutSideNONASD(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlurNONASD = false;
    document.getElementById(identifir).click();
  }

  globalFilterClickOutSideAssigneeGroup(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur_AssigneeGroup = false;
    document.getElementById(identifir).click();
  }

  // select deselect all customer start
  checkUncheckAll(checklist, masterSelected) {
    for (let i = 0; i < checklist.length; i++) {
      checklist[i].value = masterSelected;
    }
  }

  isAllSelected(checklist, masterSelected) {
    this.globalFilterModal[masterSelected] = checklist.every(function (item: any) {
      return item.value == true;
    });
  }

  /**
   * This f/n will manage selectAll/deSelectAll checkbox
   *  impact on assigneegroup global filter
   * @param asd Array
   * @param nonAsd Array
   */
  checkUncheckAllAsigneeGroup(asd, nonAsd) {
    for (let i = 0; i < asd.length; i++) {
      asd[i].value = this.globalFilterModal['masterSelectedAsigneeGroup'];
    }

    for (let i = 0; i < nonAsd.length; i++) {
      nonAsd[i].value = this.globalFilterModal['masterSelectedAsigneeGroup'];
    }

    this.globalFilterModal.masterSelectedASD = this.globalFilterModal['masterSelectedAsigneeGroup'];
    this.globalFilterModal.masterSelectedNONASD = this.globalFilterModal['masterSelectedAsigneeGroup'];
  }

  // priti patel
  filterAccept(params) {
    const finalValue = this.getActiveColumns(this.dbAllcolumns).map(columnStruct => ({
      headerName: columnStruct.headerName,
      fieldName: columnStruct.field,
      filter: []
    }));
    Object.keys(params.api.filterManager.allFilters).map(function (key) {
      const filtermanagerVal = params.api.filterManager.allFilters[key].filterPromise.resolution.appliedModel;
      if (filtermanagerVal != null) {
        if (filtermanagerVal.filterType == 'date') {
          if (filtermanagerVal.type == 'inRange') {
            finalValue.find(o => o.fieldName === key).filter = [{ 'value': filtermanagerVal.dateFrom + '_' + filtermanagerVal.dateTo, 'type': filtermanagerVal.type }];
          } else {
            finalValue.find(o => o.fieldName === key).filter = [{ 'value': filtermanagerVal.dateFrom, 'type': filtermanagerVal.type }];
          }

        } else {
          finalValue.find(o => o.fieldName === key).filter = [{ 'value': filtermanagerVal.filter, 'type': filtermanagerVal.type }];
        }
      }
    });
    this.allFilters = finalValue;
    // // console.log(this.allFilters);
  }


  downloadPDFNow() {
    $('#downloadPDFNowClose').click();
    const activeHeader = this.getActiveColumns(this.dbAllcolumns).map(columnStruct => ({
      headerName: columnStruct.headerName,
      fieldName: columnStruct.field,
      filter: []
    }));
    const downloadObj = {
      selectedFilters: JSON.stringify((this.allFilters.length === 0) ? activeHeader : this.allFilters),
      reportName: this.reportObj.reportName,
      format: this.reportObj.format,
      startDate: this.selectedTimeRange['timestamp_start'],
      endDate: this.selectedTimeRange['timestamp_end'],
      timeType: this.selectedTimeRange['timeType']
    };
    this.reportService_.downloadNowReport(downloadObj).subscribe(res => {
      // // console.log(res);
      // if(res['status'] == true){
      const newBlob = new Blob([res], {
        type: this.reportObj.format == 'pdf' ?
          'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      const link = document.createElement('a');
      link.href = data;
      link.download = (this.reportObj.format == 'pdf') ? this.reportObj.reportName + '.pdf' : this.reportObj.reportName + '.xlsx';
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 100);

      // } else{
      //   swal({
      //     position: 'center',
      //     type: 'error',
      //     title: 'Got Error ! while downloading report ',
      //     showConfirmButton: false,
      //     timer: 1500
      //   });
      // }

    }, error => {
      swal({
        position: 'center',
        type: 'error',
        title: 'Got Error ! while downloading report ',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
  clearModalDownloadNow() {
    this.reportObj.reportName = '';
  }

  scheduleDownloadPDF() {
    $('#modalDialogscheduleDownloadClose').click();
    const activeHeader = this.getActiveColumns(this.dbAllcolumns).map(columnStruct => ({
      headerName: columnStruct.headerName,
      fieldName: columnStruct.field,
      filter: []
    }));
    const downloadObj = {
      selectedFilters: JSON.stringify((this.allFilters.length === 0) ? activeHeader : this.allFilters),
      reportName: this.scheduleObj.reportName,
      email: this.scheduleObj.email,
      format: this.scheduleObj.format,
      duration: this.scheduleObj.duration,
      startDate: this.selectedTimeRange['timestamp_start'],
      endDate: this.selectedTimeRange['timestamp_end'],
      timeType: this.selectedTimeRange['timeType']
    };
    this.reportService_.scheduleDownloadReport(downloadObj).subscribe(res => {
      if (res['status'] == true) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Your Report Scheduled Successfully ',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        swal({
          position: 'center',
          type: 'error',
          title: 'Got Error ! while scheduling report ',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }, error => {
      swal({
        position: 'center',
        type: 'error',
        title: 'Got Error ! while scheduling report ',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
  clearModalscheduleDownload() {
    this.scheduleObj.reportName = '';
    this.scheduleObj.email = '';
  }
  // view schedule reports
  loadScheduleReport() {
    this.reportService_.allScheduleReport().subscribe(res => {
      const data = res.status ? res.data : [];
      data.map(fil => {
        fil['value'] = false;
      });
      this.scheduleReport = data;
    }, err => {

    });
  }
  deleteScheduleReport(data) {
    $('#modalDialogScheduleDeleteClose').click();
    this.reportService_.deleteScheduleReportIncident(data.id).subscribe(res => {
      // const data = res.status ? res.data : [];
      if (res['status'] == true) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Your Report Removed Successfully ',
          showConfirmButton: false,
          timer: 1500
        });
        this.loadScheduleReport();
      } else {
        swal('', 'Oops ! Getting Error While Removing Scheduled Report', 'error');
      }
    }, err => {
      swal('', 'Oops ! Getting Error While Removing Scheduled Report', 'error');
    });
  }

}
