import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';

declare var moment: any;

@Component({
  selector: 'cats-engineer-view',
  templateUrl: './engineer-view.component.html',
  styleUrls: ['./engineer-view.component.css']
})
export class EngineerViewComponent implements OnInit, OnDestroy {
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
  constructor(private timeServices_: TimeFilterService) {
    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.onTsModified(obj);
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
    this.globalFilterModal.timeType = info.timeType.value;
    console.log(this.selectedTimeRange)
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.timeServicesSubsc$ && this.timeServicesSubsc$ != null) {
      this.timeServicesSubsc$.unsubscribe();
    }
  }

}
