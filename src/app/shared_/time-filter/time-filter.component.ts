import { Subscription } from 'rxjs/Subscription';
import { TimeFilterService } from './time-filter.service.component';
import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
declare var moment: any;


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class TimeFilterComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private daterangepickerOptions: DaterangepickerConfig,
    private timeFilterService: TimeFilterService,
    // private cdr_:ChangeDetectorRef
  ) {
    this.singleDate = this.timeInfo.timestamp.end;
  }

  public dateFrom: any;
  public dateTo: any;
  public timeZone: any;
  @Input() configStyle: any;

  public dateFormat = 'DD-MM-YYYY h:mm:ss';
  public selectedFilter: string;
  public selectedRange_: any[] = [];
  public tsSubscribers: Subscription;

  public timePicker = false;

  public timeInfo: any = {
    date: {
      start: moment().startOf('day'),
      end: moment().format('DD-MM-YYYY h:mm:ss')
    },
    timestamp: {
      start: Date.parse(moment().startOf('day')),
      end: Date.parse(moment()),
    }
  };

  public dateInputs: any = [
    {
      start: moment().subtract(12, 'month'),
      end: moment().subtract(6, 'month')
    },
    {
      start: moment().subtract(9, 'month'),
      end: moment().subtract(6, 'month')
    },
    {
      start: moment().subtract(4, 'month'),
      end: moment()
    },
    {
      start: moment(),
      end: moment().add(5, 'month'),
    }
  ];


  public defaultRangeList =
    [
      'Last 1 Hour',
      'Today',
      'Yesterday',
      'Last 7 Days',
      'This Month',
      'Last 3 Months',
      'Last 6 Months',
      'Last 90 Days - Raw Data',
      'This Year'
    ];

  /**
   *  will set date range by default
   *  using l1h by default : there have some changes in l1h logic based on requirements
   */
  public mainInput = {
    start: moment().startOf('hour').subtract(1, 'hours'), // moment().startOf('day'),
    end: moment().startOf('hour')
  };

  public singlePicker = {
    singleDatePicker: false,
    showDropdowns: false,
    opens: 'left'
  };

  public singleDate: any;
  public eventLog = '';

  // public timeInfo: any = {
  //   date: {
  //     start: moment().subtract(1, 'month').format(this.dateFormat),
  //     end: moment().format(this.dateFormat)
  //   },
  //   timestamp: {
  //     start: Date.parse(moment().subtract(1, 'month')),
  //     end: Date.parse(moment()),
  //   }
  // };

  ngOnInit() {
    this.timePicker = this.configStyle ? (this.configStyle.timePicker != undefined ? this.configStyle.timePicker : true) : true,
      // console.log('timefilter init........... :' + this.timePicker);
      this.daterangepickerOptions.settings = this.buildConfigurations();
    this.tsSubscribers = this.timeFilterService.getTimeFilterSubscriber().subscribe(timeobj => {
      this.timeInfo = timeobj;
    });
  }

  ngOnDestroy() {
    // console.log('ngOnDestroy....timeFilter');
    if (this.tsSubscribers) {
      this.tsSubscribers.unsubscribe();
    }
  }

  ngAfterViewInit() {
    // // // console.log('viewInit Time............ :' + JSON.stringify(this.configStyle));
  }

  public buildConfigurations2() {
    return {
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day'),
      locale: { format: this.dateFormat },
      alwaysShowCalendars: false,
      opens: this.configStyle ? this.configStyle.openPos ? this.configStyle.openPos : 'right' : 'right',
      timePicker: this.configStyle ? this.configStyle.timePicker ? this.configStyle.timePicker : true : true,
      ranges: this.getCustomRanges()
      // autoUpdateInput: true
    };
  }

  public buildConfigurations() {
    const config_ = {
      minDate: (this.configStyle && this.configStyle.minDate !== undefined) ?
        this.configStyle.minDate : undefined,

      maxDate: (this.configStyle && this.configStyle.maxDate !== undefined) ?
        this.configStyle.maxDate : undefined,

      startDate: this.configStyle ? this.configStyle.startDate ?
        moment(this.configStyle.startDate).toDate() : moment().startOf('day') : moment().startOf('day'),
      endDate: this.configStyle ? this.configStyle.endDate ?
        moment(this.configStyle.endDate).toDate() : moment().endOf('day') : moment().endOf('day'),
      locale: { format: this.dateFormat },
      alwaysShowCalendars: false,
      // drops: this.configStyle ? this.configStyle.drops ? this.configStyle.drops : 'up' : 'up',
      singleDatePicker: this.configStyle ? this.configStyle.singleDatePicker ? this.configStyle.singleDatePicker : false : false,
      opens: this.configStyle ? this.configStyle.openPos ? this.configStyle.openPos : 'right' : 'right',
      // timePicker: this.configStyle ? (this.configStyle.timePicker != undefined ? this.configStyle.timePicker : true) : true,
      timePicker: this.timePicker,
      ranges: this.buildCustomRanges() // this.getCustomRanges()
    };
    this.selectedFilter = this.configStyle ? this.configStyle.timeType ? this.configStyle.timeType : 'td' : 'td';
    let timestamp_start = Date.parse(config_['startDate']);
    let timestamp_end = Date.parse(config_['endDate']);
    this.timeFilterService.setTimeInfo(config_['startDate'], config_['endDate'],
      timestamp_start, timestamp_end, this.selectedFilter, '', this.selectedRange_);
    // this.selectRangeByDefault('Now',config_);
    this.mainInput.start = config_.startDate;
    this.mainInput.end = config_.endDate;
    // this.cdr_.detectChanges();
    return config_;
  }

  // selectRangeByDefault(rangeName, config) {
  //   let rang_ = this.getCustomRanges()[rangeName];
  //   config['startDate'] = rang_[0];
  //   config['endDate'] = rang_[1];

  //   let timestamp_start = Date.parse(rang_[0]);
  //   let timestamp_end = Date.parse(rang_[1]);

  //   if (rangeName === 'Now') {
  //     this.selectedFilter = 'now';
  //   } else if (rangeName === 'Last 1 Hour') {
  //     this.selectedFilter = 'l1h';
  //   } else if (rangeName === 'Today') {
  //     this.selectedFilter = 'td';
  //   } else if (rangeName === 'Yesterday') {
  //     this.selectedFilter = 'yd';
  //   } else if (rangeName === 'Last 7 Days') {
  //     this.selectedFilter = '7d';
  //   } else if (rangeName === 'This Month') {
  //     this.selectedFilter = 'cm';
  //   } else if (rangeName === 'Last Month') {
  //     this.selectedFilter = 'lm';
  //   } else if (rangeName === 'Last 3 Months') {
  //     this.selectedFilter = 'l3m';
  //   } else if (rangeName === 'Last 6 Months') {
  //     this.selectedFilter = 'l6m';
  //   } else if (rangeName === 'This Year') {
  //     this.selectedFilter = 'cy';
  //   } else {
  //     this.selectedFilter = 'cu';
  //   }
  //   this.setDatetoTimeServices(config['startDate'], config['endDate'], timestamp_start, timestamp_end, this.selectedFilter);
  // }





  public buildCustomRanges() {
    const allRanges_ = this.getCustomRanges();
    const customRanges_ = (this.configStyle && this.configStyle.customRanges != undefined)
      ? this.configStyle.customRanges :
      this.defaultRangeList;
    const selectedRange = {};
    customRanges_.forEach(range_ => {
      selectedRange[range_] = allRanges_[range_];
    });
    this.selectedRange_ = customRanges_;
    return selectedRange;
  }

  // Ramji made changes in last 7 days logic : performance  11-05-2020
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

  public selectedDate(value: any, dateInput: any) {
    // console.log('selectedDate: ' + value);
    this.selectedFilter = value.label;
    dateInput.start = value.start;
    dateInput.end = value.end;

    // // console.log('selectedDate compo ... : ' + value + 'adteInput: ' + dateInput);

    if (value.label === 'Now') {
      this.selectedFilter = 'now';
    } else if (value.label === 'Last 1 Hour') {
      this.selectedFilter = 'l1h';
    } else if (value.label === 'Today') {
      this.selectedFilter = 'td';
    } else if (value.label === 'Yesterday') {
      this.selectedFilter = 'yd';
    } else if (value.label === 'Last 7 Days ') {
      this.selectedFilter = 'i7d';
    } else if (value.label === 'Last 7 Days') {
      this.selectedFilter = '7d';
    } else if (value.label === 'This Month ') {
      this.selectedFilter = 'icm';
    } else if (value.label === 'This Month') {
      this.selectedFilter = 'cm';
    } else if (value.label === 'Last Month') {
      this.selectedFilter = 'lm';
    } else if (value.label === 'Last 3 Months ') {
      this.selectedFilter = 'il3m';
    } else if (value.label === 'Last 3 Months') {
      this.selectedFilter = 'l3m';
    } else if (value.label === 'Last 6 Months ') {
      this.selectedFilter = 'il6m';
    } else if (value.label === 'Last 6 Months') {
      this.selectedFilter = 'l6m';
    } else if (value.label === 'Last 90 Days - Raw Data') {
      this.selectedFilter = 'raw';
    } else if (value.label === 'This Year ') {
      this.selectedFilter = 'icy';
    } else if (value.label === 'This Year') {
      this.selectedFilter = 'cy';
    } else {
      this.selectedFilter = 'cu';
    }

    const startDateInTimeStamp = Date.parse(value.start);
    const endDateInTimeStamp = Date.parse(value.end);
    this.setDatetoTimeServices(value.start, value.end, startDateInTimeStamp, endDateInTimeStamp, this.selectedFilter);
  }

  public singleSelect(value: any) {
    this.singleDate = value.start;
  }

  public applyDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    dateInput.end = value.end;
  }

  public calendarEventsHandler(e: any) {
    if (e.event.handleObj.type == 'show') {
      // console.log('calendarEventsHandler : ' + e.picker.chosenLabel);
      const label_ = e.picker.chosenLabel;
      if (label_ == 'Custom Range') {
        // console.log('yes custom Range');
        // this.daterangepickerOptions.settings = (this.daterangepickerOptions.settings['timePicker'] = false);
      } else {
        // console.log('thats not custom Range selection');
        // this.daterangepickerOptions.settings = (this.daterangepickerOptions.settings['timePicker'] = true);
      }
      this.eventLog += '\nEvent Fired: ' + e.event.type;
    } else if (e.event.handleObj.type == 'hide') {
      // const label_ = e.picker.chosenLabel;
      // // console.log('onhide : ' + e.picker.chosenLabel);
      // if (label_ == 'Today' || label_ == 'Last 1 Hour') {
      //   const dataArr_ = this.getCustomRanges()[label_];
      //   // this.daterangepickerOptions.settings['startDate'] = dataArr_[0];
      //   // this.daterangepickerOptions.settings['endDate'] = dataArr_[1];
      //   const value = {
      //     start: dataArr_[0],
      //     end: dataArr_[1],
      //   };
      //   this.selectedFilter = (label_ == 'Today') ? 'td' : 'l1h';
      //   const startDateInTimeStamp = Date.parse(value.start);
      //   const endDateInTimeStamp = Date.parse(value.end);
      //   this.setDatetoTimeServices(value.start, value.end, startDateInTimeStamp, endDateInTimeStamp, this.selectedFilter , 'custMod_');
      // }
    }

  }

  public setDatetoTimeServices(dateStart, dateEnd, tsStart, tsEnd, selectedFilter, ident: any = '') {
    this.timeFilterService.setTimeInfo(dateStart.format(this.dateFormat),
      dateEnd.format(this.dateFormat), tsStart,
      tsEnd, this.selectedFilter, ident, this.selectedRange_);
  }
}
