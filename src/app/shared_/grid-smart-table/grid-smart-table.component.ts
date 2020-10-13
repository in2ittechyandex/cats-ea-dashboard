import themeConf_ from 'src/app/config/theme-settings';
import { FormControl } from '@angular/forms';
import {
  Component, OnInit,
  Output, EventEmitter,
  Input, ViewEncapsulation,
  ChangeDetectionStrategy,
  SimpleChanges, OnChanges, AfterViewInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import pageSettings from 'src/app/config/page-settings';
import * as $ from 'jquery';
import { Subscription } from 'rxjs/Subscription';
import { SharedServices } from '../shared.services';
import { CommonExcelServiceService } from '../common-excel-service.service';
import { PrintService } from 'src/app/print.service';

@Component({
  selector: 'cats-grid-smart-table',
  templateUrl: './grid-smart-table.component.html',
  styleUrls: ['./grid-smart-table.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridSmartTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  //#region agGrid declaration end

  isXlsxLoaded: boolean = false;
  protected _XlsxSubscription: Subscription;

  isCsvLoaded: boolean = false;
  protected _CsvSubscription: Subscription;

  constructor(private commonExcelService_: CommonExcelServiceService, private printService: PrintService, public sharedServices_: SharedServices, private ref: ChangeDetectorRef) {
    this._XlsxSubscription = commonExcelService_.newSubjectPrintXlsx.subscribe((value) => {
      // console.log(value);
      this.isXlsxLoaded = value;
      this.ref.detectChanges();
    });

    this._CsvSubscription = sharedServices_.newSubjectPrintCsv.subscribe((value) => {
      this.isCsvLoaded = value;
      this.ref.detectChanges();
    });

    this.pageSettings = pageSettings;
    // this.columnDefs = this.getActiveColumns(this.dbAllcolumns);
    this.defaultColDef = {
      filter: true,
      editable: false,
      resizable: true,
      sortable: true
    };
    this.context = { componentParent: this };
    this.getRowHeight = function (params) {
      return 50;
    };
    this.allFilters = [];
  }

  pageSettings;
  themeConf_;
  public flInputCust_ = new FormControl();
  public flTxtCust_: string;
  //#region: filter_model end

  //#region agGrid declaration start
  @Input() incidentList: any[] = [];
  @Input() chartTitle = '';
  @Input() chartStartDate = '';
  @Input() chartEndDate = '';
  @Input() chartTimeType = '';
  // @Input() dbAllcolumns: any[] = [];
  @Input() heightPx = 400;
  @Input() widthPer = 100;
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

  @Input() paginationPageSize = 20;
  @Input() paginationLimits = [10, 20, 50, 100, 500, 1000];
  @Output() pageSizeChange = new EventEmitter();

  @Input() rowSelection = 'single'; // multiple
  @Input() suppressRowClickSelection = true;
  @Output() eventDetect = new EventEmitter();

  @Input() url = '';


  modPagination = {
    'totalRecords': 0,
    'currentPage': 0,
    'totalPages': 0,
    'recordsOnPage': 0,
    'isLastPage': false
  };

  @Input() dbAllcolumns = [
    {
      'headerName': 'Ticket Type',
      'field': 'ticket_type',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Ticket Type'
    },
    // {
    //   'headerName': 'Parent',
    //   'field': 'parent',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Parent'
    // },
    // {
    //   'headerName': 'Incident Type',
    //   'field': 'incident_type',
    //   'width': 40,
    //   'isActive': true,
    //   'headerTooltip': 'Incident Type'
    // },
    // {
    //   'headerName': 'Watch List',
    //   'field': 'watch_list',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Watch List'
    // },
    // {
    //   'headerName': 'Upon Reject',
    //   'field': 'upon_reject',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Upon Reject'
    // },
    // {
    //   'headerName': 'Customer Category',
    //   'field': 'customer_category',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Customer Category'
    // },
    // {
    //   'headerName': 'Vendor Ticket Reference',
    //   'field': 'vendor_ticket_reference',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Vendor Ticket Reference'
    // },
    {
      'headerName': 'State',
      'field': 'state1',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'State'
    },



    // {
    //   'headerName': 'Approval History',
    //   'field': 'approval_history',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Approval History'
    // },
    {
      'headerName': 'Number',
      'field': 'number',
      'width': 40,
      'isActive': true,
      'headerTooltip': 'Number'
    },
    // {
    //   'headerName': 'Last Reopened By',
    //   'field': 'last_reopened_by',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Last Reopened By'
    // },
    // {
    //   'headerName': 'Problem',
    //   'field': 'problem',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Problem'
    // },
    // {
    //   'headerName': 'Vendor Subject',
    //   'field': 'vendor_subject',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Vendor Subject'
    // },
    // {
    //   'headerName': 'Knowledge',
    //   'field': 'knowledge',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Knowledge'
    // },
    // {
    //   'headerName': 'Nms Name',
    //   'field': 'nms_name',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Nms Name'
    // },
    // {
    //   'headerName': 'Delivery Plan',
    //   'field': 'delivery_plan',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Delivery Plan'
    // },
    // {
    //   'headerName': 'Impact',
    //   'field': 'impact',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Impact'
    // },
    // {
    //   'headerName': 'Destinations',
    //   'field': 'destinations',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Destinations'
    // },
    // {
    //   'headerName': 'Work Notes List',
    //   'field': 'work_notes_list',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Work Notes List'
    // },
    // {
    //   'headerName': 'Active',
    //   'field': 'active',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Active'
    // },

    {
      'headerName': 'Incident State',
      'field': 'incident_state',
      'width': 60,
      'isActive': true,
      'headerTooltip': 'Incident State'
    },
    {
      'headerName': 'Assigned To',
      'field': 'assigned_to',
      'width': 80,
      'isActive': true,
      'headerTooltip': 'Assigned To'
    },
    // {
    //   'headerName': 'Caused By Change',
    //   'field': 'caused_by_change',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Caused By Change'
    // },
    // {
    //   'headerName': 'Last Reopened At',
    //   'field': 'last_reopened_at',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Last Reopened At'
    // },
    // {
    //   'headerName': 'Tags',
    //   'field': 'tags',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Tags'
    // },
    // {
    //   'headerName': 'Customer Ticket Reference',
    //   'field': 'customer_ticket_reference',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Customer Ticket Reference'
    // },
    // {
    //   'headerName': 'Group List',
    //   'field': 'group_list',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Group List'
    // },
    // {
    //   'headerName': 'Business Duration',
    //   'field': 'business_duration',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Business Duration'
    // },
    // {
    //   'headerName': 'Domain',
    //   'field': 'domain',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Domain'
    // },
    // {
    //   'headerName': 'Updated By',
    //   'field': 'updated_by',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Updated By'
    // },
    {
      'headerName': 'Opco',
      'field': 'opco',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Opco'
    },
    // {
    //   'headerName': 'Incident Fix Time',
    //   'field': 'incident_fix_time',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Incident Fix Time'
    // },
    // {
    //   'headerName': 'Approval Set',
    //   'field': 'approval_set',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Approval Set'
    // },
    // {
    //   'headerName': 'Updated By2',
    //   'field': 'updated_by2',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Updated By2'
    // },
    // {
    //   'headerName': 'Inms Name',
    //   'field': 'inms_name',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Inms Name'
    // },
    {
      'headerName': 'Short Description',
      'field': 'short_description',
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Short Description',
      // 'cellRenderer': function (params) {
      //   return params.value;
      // }
    },
    // {
    //   'headerName': 'Internal Peering Request',
    //   'field': 'internal_peering_request',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Internal Peering Request'
    // },
    // {
    //   'headerName': 'Delivery Task',
    //   'field': 'delivery_task',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Delivery Task'
    // },
    // {
    //   'headerName': 'Correlation Display',
    //   'field': 'correlation_display',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Correlation Display'
    // },
    // {
    //   'headerName': 'Additional Assignee List',
    //   'field': 'additional_assignee_list',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Additional Assignee List'
    // },
    // {
    //   'headerName': 'Service Order',
    //   'field': 'service_order',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Service Order'
    // },
    // {
    //   'headerName': 'Peering Category',
    //   'field': 'peering_category',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Peering Category'
    // },
    // {
    //   'headerName': 'Notify',
    //   'field': 'notify',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Notify'
    // },
    // {
    //   'headerName': 'Alert Type',
    //   'field': 'alert_type',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Alert Type'
    // },
    {
      'headerName': 'Service Offering',
      'field': 'service_offering',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Service Offering'
    },
    // {
    //   'headerName': 'Follow Up',
    //   'field': 'follow_up',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Follow Up'
    // },
    {
      'headerName': 'Closed By',
      'field': 'closed_by',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Closed By'
    },
    {
      'headerName': 'Parent Incident',
      'field': 'parent_incident',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Parent Incident'
    },
    // {
    //   'headerName': 'Resource Type Search',
    //   'field': 'resource_type_search',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Resource Type Search'
    // },
    {
      'headerName': 'Reassignment Count',
      'field': 'reassignment_count',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Reassignment Count'
    },
    // {
    //   'headerName': 'First Close',
    //   'field': 'first_close',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'First Close'
    // },
    // {
    //   'headerName': 'Resolved',
    //   'field': 'resolved',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Resolved'
    // },
    // {
    //   'headerName': 'Updated By Customer',
    //   'field': 'updated_by_customer',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Updated By Customer'
    // },
    // {
    //   'headerName': 'Sla Due',
    //   'field': 'sla_due',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Sla Due'
    // },
    // {
    //   'headerName': 'Comments And Work Notes',
    //   'field': 'comments_and_work_notes',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Comments And Work Notes'
    // },
    // {
    //   'headerName': 'Alert Category',
    //   'field': 'alert_category',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Alert Category'
    // },
    // {
    //   'headerName': 'Traffic Direction',
    //   'field': 'traffic_direction',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Traffic Direction'
    // },
    // {
    //   'headerName': 'Additional Comments',
    //   'field': 'additional_comments',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Additional Comments'
    // },
    {
      'headerName': 'Resolution Category',
      'field': 'resolution_category',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resolution Category'
    },
    // {
    //   'headerName': 'Upon Approval',
    //   'field': 'upon_approval',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Upon Approval'
    // },
    // {
    //   'headerName': 'Escalation',
    //   'field': 'escalation',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Escalation'
    // },
    // {
    //   'headerName': 'Business Resolve Time',
    //   'field': 'business_resolve_time',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Business Resolve Time'
    // },
    // {
    //   'headerName': 'Vendor Communication',
    //   'field': 'vendor_communication',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Vendor Communication'
    // },
    // {
    //   'headerName': 'Correlation Id',
    //   'field': 'correlation_id',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Correlation Id'
    // },
    {
      'headerName': 'Closed',
      'field': 'closed',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Closed'
    },
    // {
    //   'headerName': 'Task Type',
    //   'field': 'task_type',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Task Type'
    // },
    // {
    //   'headerName': 'Order1',
    //   'field': 'order1',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Order1'
    // },
    // {
    //   'headerName': 'Made Sla',
    //   'field': 'made_sla',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Made Sla'
    // },
    // {
    //   'headerName': 'Netcool User',
    //   'field': 'netcool_user',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Netcool User'
    // },
    // {
    //   'headerName': 'Peering Customer',
    //   'field': 'peering_customer',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Peering Customer'
    // },
    // {
    //   'headerName': 'Child Incidents',
    //   'field': 'child_incidents',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Child Incidents'
    // },
    {
      'headerName': 'Resolved By',
      'field': 'resolved_by',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resolved By'
    },
    {
      'headerName': 'Resolved',
      'field': 'resolved',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Resolved'
    },
    // {
    //   'headerName': 'User Input',
    //   'field': 'user_input',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'User Input'
    // },
    {
      'headerName': 'Opened By',
      'field': 'opened_by',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Opened By'
    },
    // {
    //   'headerName': 'Alert Id',
    //   'field': 'alert_id',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Alert Id'
    // },
    // {
    //   'headerName': 'Actual End',
    //   'field': 'actual_end',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Actual End'
    // },
    {
      'headerName': 'Actual Start Time',
      'field': 'actual_start_time',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Actual Start Time'
    },
    // {
    //   'headerName': 'Ne Name',
    //   'field': 'ne_name',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Ne Name'
    // },
    // {
    //   'headerName': 'Created',
    //   'field': 'created',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Created'
    // },
    // {
    //   'headerName': 'Escalated',
    //   'field': 'escalated',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Escalated'
    // },
    // {
    //   'headerName': 'Amo Search',
    //   'field': 'amo_search',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Amo Search'
    // },
    // {
    //   'headerName': 'Resolve Time',
    //   'field': 'resolve_time',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Resolve Time'
    // },
    // {
    //   'headerName': 'Peering Exchange',
    //   'field': 'peering_exchange',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Peering Exchange'
    // },
    {
      'headerName': 'Business Service',
      'field': 'business_service',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Business Service'
    },
    {
      'headerName': 'Opened',
      'field': 'opened',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Opened'
    },
    // {
    //   'headerName': 'Linked Incident',
    //   'field': 'linked_incident',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Linked Incident'
    // },
    // {
    //   'headerName': 'Created By',
    //   'field': 'created_by',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Created By'
    // },
    // {
    //   'headerName': 'Time Worked',
    //   'field': 'time_worked',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Time Worked'
    // },
    // {
    //   'headerName': 'Expected Start',
    //   'field': 'expected_start',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Expected Start'
    // },
    // {
    //   'headerName': 'Service Flag1',
    //   'field': 'service_flag1',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Service Flag1'
    // },
    // {
    //   'headerName': 'Voice Tags',
    //   'field': 'voice_tags',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Voice Tags'
    // },
    // {
    //   'headerName': 'Configuration Item',
    //   'field': 'configuration_item',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Configuration Item'
    // },
    // {
    //   'headerName': 'Service Flag2',
    //   'field': 'service_flag2',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Service Flag2'
    // },
    // {
    //   'headerName': 'First Occurence',
    //   'field': 'first_occurence',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'First Occurence'
    // },
    // {
    //   'headerName': 'Work Notes',
    //   'field': 'work_notes',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Work Notes'
    // },
    // {
    //   'headerName': 'Subcategory',
    //   'field': 'subcategory',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Subcategory'
    // },
    {
      'headerName': 'Updated',
      'field': 'updated',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Updated'
    },
    // {
    //   'headerName': 'Vendor List',
    //   'field': 'vendor_list',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Vendor List'
    // },
    // {
    //   'headerName': 'Amo',
    //   'field': 'amo',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Amo'
    // },
    // {
    //   'headerName': 'Incident Duration',
    //   'field': 'incident_duration',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Incident Duration'
    // },
    {
      'headerName': 'Assignment Group',
      'field': 'assignment_group',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Assignment Group'
    },
    {
      'headerName': 'Description',
      'field': 'description',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Description'
    },
    // {
    //   'headerName': 'On Hold Reason',
    //   'field': 'on_hold_reason',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'On Hold Reason'
    // },
    // {
    //   'headerName': 'Updates',
    //   'field': 'updates',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Updates'
    // },
    {
      'headerName': 'Close Notes',
      'field': 'close_notes',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Close Notes'
    },
    // {
    //   'headerName': 'Duration',
    //   'field': 'duration',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Duration'
    // },
    {
      'headerName': 'Contact Type',
      'field': 'contact_type',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Contact Type'
    },
    // {
    //   'headerName': 'Alert Subcategory',
    //   'field': 'alert_subcategory',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Alert Subcategory'
    // },
    // {
    //   'headerName': 'Probable Cause',
    //   'field': 'probable_cause',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Probable Cause'
    // },
    // {
    //   'headerName': 'Activity Due',
    //   'field': 'activity_due',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Activity Due'
    // },
    // {
    //   'headerName': 'Responded',
    //   'field': 'responded',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Responded'
    // },
    // {
    //   'headerName': 'Owner',
    //   'field': 'owner',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Owner'
    // },
    // {
    //   'headerName': 'Approval',
    //   'field': 'approval',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Approval'
    // },
    // {
    //   'headerName': 'Due Date',
    //   'field': 'due_date',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Due Date'
    // },
    {
      'headerName': 'Reopen Count',
      'field': 'reopen_count',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Reopen Count'
    },
    // {
    //   'headerName': 'Service ID Received',
    //   'field': 'service_id_received',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Service ID Received'
    // },
    // {
    //   'headerName': 'Caller',
    //   'field': 'caller',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Caller'
    // },
    // {
    //   'headerName': 'Domain Path',
    //   'field': 'domain_path',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Domain Path'
    // },
    // {
    //   'headerName': 'Fms Severity',
    //   'field': 'fms_severity',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Fms Severity'
    // },
    // {
    //   'headerName': 'Location',
    //   'field': 'location',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Location'
    // },
    // {
    //   'headerName': 'Time',
    //   'field': 'time',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Time'
    // },
    // {
    //   'headerName': 'Urgency2',
    //   'field': 'urgency2',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Urgency2'
    // },
    // {
    //   'headerName': 'Owner Group',
    //   'field': 'owner_group',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Owner Group'
    // },
    {
      'headerName': 'Category',
      'field': 'category',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Category'
    },
    // {
    //   'headerName': 'Urgency1',
    //   'field': 'urgency1',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Urgency1'
    // },
    // {
    //   'headerName': 'Change Request',
    //   'field': 'change_request',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Change Request'
    // },
    // {
    //   'headerName': 'Alert Name',
    //   'field': 'alert_name',
    //   'width': 100,
    //   'isActive': false,
    //   'headerTooltip': 'Alert Name'
    // },
    {
      'headerName': 'Priority',
      'field': 'priority',
      'width': 40,
      'isActive': true,
      'headerTooltip': 'Priority'
    },
    {
      'headerName': 'Customer',
      'field': 'customer',
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Customer'
    }
  ];


  public colChangeKPI = [
    {
      'headerName': 'Number',
      'field': 'number',
      'width': 40,
      'isActive': true,
      'headerTooltip': 'Number'
    },
    {
      'headerName': 'Assignment Group',
      'field': 'assignment_group',
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Assignment Group'
    },
    {
      'headerName': 'State',
      'field': 'state1',
      'width': 100,
      'isActive': true,
      'headerTooltip': 'State'
    },
    {
      'headerName': 'Short Description',
      'field': 'short_description',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Short Description'
    },

    {
      'headerName': 'Impact',
      'field': 'impact',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Impact'
    },
    {
      'headerName': 'Description',
      'field': 'description',
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Description'
    },
    {
      'headerName': 'Type',
      'field': 'type',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Type'
    },
    {
      'headerName': 'Opened At',
      'field': 'opened_at',
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Opened At'
    },
    {
      'headerName': 'Requested By',
      'field': 'requested_by',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Requested By'
    },

    {
      'headerName': 'Device Priority',
      'field': 'u_device_priority',
      'width': 40,
      'isActive': false,
      'headerTooltip': 'Device Priority'
    },
    {
      'headerName': 'Risk',
      'field': 'risk',
      'width': 40,
      'isActive': false,
      'headerTooltip': 'Risk'
    },
    {
      'headerName': 'Category',
      'field': 'category',
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Category'
    },
    {
      'headerName': 'Region',
      'field': 'u_region',
      'width': 100,
      'isActive': false,
      'headerTooltip': 'Region'
    },
    {
      'headerName': 'Assigned To',
      'field': 'assigned_to',
      'width': 80,
      'isActive': false,
      'headerTooltip': 'Assigned To'
    },
    {
      'headerName': 'Company',
      'field': 'company',
      'width': 80,
      'isActive': true,
      'headerTooltip': 'Company'
    }
  ];


  //#region :aggrid report filters
  allFilters: { headerName: any; fieldName: any; filter: any[]; }[] = [];

  onGridReady(params) {
    // console.log('....onGridReady...');
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

  ngOnChanges(changes_: SimpleChanges) {
    //  if (!changes_.incidentList.firstChange){
    // this.onPaginationChanged(null);
    //  }
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
    if (this.incidentList.length > 0) {
      this.gridApi.setRowData(this.incidentList);
    }
  }

  ngOnDestroy() {
    if (this._XlsxSubscription) {
      this._XlsxSubscription.unsubscribe();
    }
    if (this._CsvSubscription) {
      this._CsvSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    if (this.url !== '' && this.url.indexOf('change/') > -1) {
      this.dbAllcolumns = this.colChangeKPI;
    }

    this.allFilters = [];
    this.columnDefs = this.getActiveColumns(this.dbAllcolumns);
    this.themeConf_ = themeConf_;
    $('.Show').click(function () {
      $('#target_allSaturation_gridSmart').show(500);
      $('.Show').hide(0);
      $('.Hide').show(0);
    });
    $('.Hide').click(function () {
      $('#target_allSaturation_gridSmart').hide(500);
      $('.Show').show(0);
      $('.Hide').hide(0);
    });
    $('.toggle').click(function () {
      $('#target_allSaturation_gridSmart').toggle('slow');
    });

    this.initFilterInputCustomer();
  }

  ngAfterViewInit() { }


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
        // // console.log(term);
      });
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

  /**
   *  agGrid : custom pagination end
   */

  /** Download Reports start */
  exportReportData() {
    this.isCsvLoaded = false;
    setTimeout(() => {
      const params = {
        'skipHeader': false,
        'columnGroups': true,
        'skipGroups': false,
        'allColumns': true,
        'fileName': this.chartTitle,
        'customHeader': this.getFilterString(),
        'columnSeparator': ''
      };

      this.gridApi.exportDataAsCsv(params);
      this.sharedServices_.deviceReport();
    });
  }

  onExcelDownloadClick() {
    this.isXlsxLoaded = true;
    setTimeout(() => {
      const items: Array<any> = [];
      this.gridApi.forEachNodeAfterFilterAndSort(function (node) {
        items.push(node.data);
      });

      this.commonExcelService_.generateAgGridExcel(this.chartTitle, this.chartTitle,
        this.getActiveColumns(this.dbAllcolumns), items, this.getFilterString().split(','));
    });

  }



  getFilterString() {
    if (!this.chartTimeType && !this.chartStartDate && !this.chartEndDate) {
      return 'Report Name: ' + this.chartTitle + '\n';
    }
    return 'Report Name: ' + this.chartTitle + ',Time Range: ' + this.chartTimeType + ',Start Date: ' + this.chartStartDate + ',End Date: ' + this.chartEndDate + '\n';
  }

  clkOnPdfIcon() {
    this.printPdfForTable();
  }
  printPdfForTable2() {
    // let PDFfilterList = [];
    // this.allFilters.map(obj=>{
    //   if(obj.filter.length>0){
    //     PDFfilterList.push(obj);
    //   }
    // });
    // localStorage.setItem('agGridfilterList',JSON.stringify(PDFfilterList));

    var headers = this.getActiveColumns(this.dbAllcolumns)
    var rowData = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function (rowNode, index) {
      var data = {};
      headers.forEach((header) => {
        data[header["field"]] = rowNode.data[header["field"]];
      });
      rowData.push(data);
    });
    localStorage.setItem('printdata', JSON.stringify(rowData));
    this.printService.printDocument('printreport', JSON.stringify(headers));
  }

  printPdfForTable() {
    let PDFfilterList = [];
    this.allFilters.map(obj => {
      if (obj.filter.length > 0) {
        PDFfilterList.push(obj);
      }
    });
    const headers = this.getActiveColumns(this.dbAllcolumns);
    var rowData = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function (rowNode, index) {
      var data = {};
      headers.forEach((header) => {
        data[header['field']] = rowNode.data[header['field']];
      });
      rowData.push(data);
    });
    this.printService.setPrintConfig({
      headers: headers,
      data: rowData,
      reportTitle: 'Report',
      pdfTitle: 'Report',
      customer: '-',
      customerPNG: this.printService.getCustomerLogo('-'),
      rowCount: rowData.length,
      filterApplied: PDFfilterList
    });

    this.printService
      .printDocument('printreport', 'customer');
  }

  /** End Download Reports  */


  onRowSelected(event) {
    // console.log('onRowSelected : ' + event);
    // window.alert(
    //   'row ' + event.node.data.athlete + ' selected = ' + event.node.selected
    // );
  }

  onSelectionChanged(event) {
    // console.log('onSelectionChanged : ' + event);
    var rowCount = event.api.getSelectedNodes().length;
    var rows = event.api.getSelectedRows();
    var nodes = event.api.getSelectedNodes();
    // window.alert('selection changed, ' + rowCount + ' rows selected');

    this.eventDetect.emit({ 'type': 'onSelectionChanged', 'data': event.api.getSelectedRows(), 'event_': event });
  }

  filterAccept(params) {
    const finalValue = this.getActiveColumns(this.dbAllcolumns).map(columnStruct => ({
      headerName: columnStruct.headerName,
      fieldName: columnStruct.field,
      filter: [],
      filterType: columnStruct.filter
    }));
    Object.keys(params.api.filterManager.allFilters).map(function (key) {
      const filtermanagerVal = params.api.filterManager.allFilters[key].filterPromise.resolution.appliedModel;
      if (filtermanagerVal != null) {
        if (filtermanagerVal.filterType == 'date') {
          if (filtermanagerVal.type == 'inRange') {
            finalValue.find(o => o.fieldName === key).filter = (filtermanagerVal.filterType == 'number') ?
              [{ 'value': filtermanagerVal.filter + '_' + filtermanagerVal.filterTo, 'type': filtermanagerVal.type }] :
              [{ 'value': filtermanagerVal.dateFrom + '_' + filtermanagerVal.dateTo, 'type': filtermanagerVal.type }];
          } else {
            finalValue.find(o => o.fieldName === key).filter =
              [{ 'value': filtermanagerVal.dateFrom, 'type': filtermanagerVal.type }];
          }

        } else if (filtermanagerVal.filterType == 'number') {
          if (filtermanagerVal.type == 'inRange') {
            finalValue.find(o => o.fieldName === key).filter =
              [{ 'value': filtermanagerVal.filter + ' to ' + filtermanagerVal.filterTo, 'type': filtermanagerVal.type }]
          } else {
            finalValue.find(o => o.fieldName === key).filter =
              [{ 'value': filtermanagerVal.filter, 'type': filtermanagerVal.type }];
          }
        } else {
          finalValue.find(o => o.fieldName === key).filter =
            [{ 'value': filtermanagerVal.filter, 'type': filtermanagerVal.type }];
        }
      }
    });
    this.allFilters = finalValue;
  }

}
