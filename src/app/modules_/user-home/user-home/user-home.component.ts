import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from '../../../config/theme-settings';
import { ReportService } from '../../../services_/report.services';
import { TabSummary } from '../../../models_/tab';
declare var moment: any;
import * as $ from 'jquery';

@Component({
  selector: 'cats-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserHomeComponent implements OnInit {
  constructor(private modalService: NgbModal, private reporService_: ReportService) { }
  closeResult: string;

  themeConf_;
  summaryCollapsed = false;
  selectedNav = 'chart';
  htktBtnArr = ['expand', 'reload', 'collapse'];
  selectedTimeRange = {
    timestamp_start: Date.parse(moment().subtract(1, 'month')),
    timestamp_end: Date.parse(moment()),
  };

  modalReferenceAddReport: any;
  themeName: 'default';
  public summaryChartDrillDataStr = {
    header: [],
    data: [],
    isPanelLoading: false,
    expand: false,
  };

  heightPixel = 300;
  widthPer = 100;
  public chartHourlytrendticket = {
    'chartData': '',
    'isChartLoaded': false
  };

  @ViewChild('summaryTicketsData') summaryTicketsData;

  public summaryReportUrl: Array<TabSummary> = [{
    'summaryReportId': 0, 'name': 'Open Incidents', 'title': 'Open Incidents',
    'url': 'incident/summary/openincidents', 'summaryData': '',
    'isSummaryLoaded': false, 'link': '', 'ticketsUrl': 'incident/summary/data/openincidents'
  },
  {
    'name': 'Open Incidents (High Priority)', 'url': 'incident/summary/total_incident_high',
    'summaryReportId': 0, 'title': 'Open Incidents (High Priority)', 'summaryData': '',
    'isSummaryLoaded': false, 'link': '', 'ticketsUrl': 'incident/summary/data/total_incident_high'
  },
  {
    'summaryReportId': 0, 'name': 'Open Incidents (Critical Priority)', 'title': 'Open Incidents (Critical Priority)',
    'url': 'incident/summary/total_incident_critical', 'summaryData': '', 'isSummaryLoaded': false,
    'link': '', 'ticketsUrl': 'incident/summary/data/total_incident_critical'
  },
  {
    'summaryReportId': 0, 'name': 'Todays Resolved Incidents', 'title': 'Todays Resolved Incidents',
    'url': 'incident/summary/resolved_today', 'summaryData': '', 'isSummaryLoaded': false,
    'link': '', 'ticketsUrl': 'incident/summary/data/resolved_today'
  }];

  public summaryArray: Array<TabSummary> = [];

  public _smry = {
    colorIcon: [{ 'color': 'bg-gradient-blue', 'icon': 'fa fa-dollar-sign fa-fw' },
    { 'color': 'bg-gradient-teal', 'icon': 'fa fa-globe fa-fw' },
    { 'color': 'bg-gradient-purple', 'icon': 'fa fa-archive fa-fw' },
    { 'color': 'bg-gradient-blue', 'icon': 'fa fa-comment-alt fa-fw' }]
  }

  ngOnInit() {
    this.themeConf_ = themeConf_;
    this.getSummaryReports();
    this.getchartHourlytrendticket();
  }

  open(content, size) {
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

  changeTheme(type) {
    this.themeName = type;
    document.getElementById('themeStyle').setAttribute('href', 'assets/css/' + type + '/style.min.css');
    document.getElementById('themeResponsibe').setAttribute('href', 'assets/css/' + type + '/style-responsive.min.css');
    document.getElementById('themeColor').setAttribute('href', 'assets/css/' + type + '/theme/default.css');
  }
  changeColor(type) {
    document.getElementById('themeColor').setAttribute('href', 'assets/css/' + this.themeName + '/theme/' + type + '.css');
  }

  getchartHourlytrendticket() {
    const urlTocall = 'incident/kpi/homehourlytrendticket';
    const obj_ = {
      'startDate': this.selectedTimeRange.timestamp_start,
      'endDate': this.selectedTimeRange.timestamp_end,
      'timeType': 'td',
     };
    this.reporService_.IncidentHomehourlyTrendTicket(urlTocall, obj_).subscribe(res => {
      if (res.status) {
        this.chartHourlytrendticket.chartData = res.data.charts;
        this.chartHourlytrendticket.isChartLoaded = true;
      }
    }, err => {

    });
  }

  getDrilDataChartHourlyTrendTicket() {
    this.summaryChartDrillDataStr['hTitle'] = 'Hourly Ticket Trends';
    this.open(this.summaryTicketsData, 'lg');
    this.summaryChartDrillDataStr.isPanelLoading = true;
    const ticketsUrl = '/incident/data/homehourlytrendticket';
    this.reporService_.fetchStaticSummaryTicketData(ticketsUrl).subscribe(res => {
      if (res.status) {
        this.summaryChartDrillDataStr.header = res.data.charts.header;
        this.summaryChartDrillDataStr.data = res.data.charts.data;
        this.summaryChartDrillDataStr.isPanelLoading = false;
        // $('#PanelSummaryData').click();
      } else {
        this.summaryChartDrillDataStr.isPanelLoading = false;
      }
    });

  }

  public getSummaryHtmlConf(index, type) {
    index = (index > 3) ? (index % this._smry.colorIcon.length) : index;
    return this._smry.colorIcon[index][type];
  }
  getSummaryReports() {
    this.summaryReportUrl.forEach((element, index) => {
      const summary: TabSummary = new TabSummary(element);
      this.reporService_.fetchStaticSummary(summary.url).subscribe(res => {
        if (res.status) {
          summary.summaryData = res.data;
          summary.isSummaryLoaded = true;
          // this.summaryArray[index] = summary;
          this.summaryReportUrl[index] = summary;
        }
      });
    });
  }

  /**
     * 
     * @param event returned from
     */
  getPanelEvent(event) {
    if (event.eventType === 'close') {
    } else if (event.eventType === 'reload') {
      this.getchartHourlytrendticket();
    } else if (event.eventType === 'print') {
      const reportNdx_ = event.modifiedObj.index;
      const chart_select_id = 'widgetChart-' + reportNdx_;
      let printContents, popupWin;
      printContents = document.getElementById(chart_select_id).innerHTML;
      popupWin = window.open('', '_blank', 'top=10px,left=10px,height=500px,width=500px');
      popupWin.document.open();
      popupWin.document.write(`
       <html>
         <head>
           <title>Analytics</title>
         </head>
     <body onload="window.print();window.close()">${printContents}</body>
       </html>`
      );
      window.setTimeout(function () {
        popupWin.document.close();
      });
    }
  }

  getSumarytickets(summary: TabSummary, index) {
    const ticketsUrl = summary.ticketsUrl;
    this.summaryChartDrillDataStr['hTitle'] = summary.name;
    this.summaryChartDrillDataStr.header = [];
    this.summaryChartDrillDataStr.data = [];
    this.open(this.summaryTicketsData, 'lg');
    this.summaryChartDrillDataStr.isPanelLoading = true;
    if (ticketsUrl && ticketsUrl != '') {
      this.reporService_.fetchStaticSummaryTicketData(ticketsUrl).subscribe(res => {
        if (res.status) {
          this.summaryChartDrillDataStr.header = res.data.charts.header;
          this.summaryChartDrillDataStr.data = res.data.charts.data;
          this.summaryChartDrillDataStr.isPanelLoading = false;
          // $('#PanelSummaryData').click();
        } else {
          this.summaryChartDrillDataStr.isPanelLoading = false;
        }
      });
    }
  }

  onLeftClickDetection(event) {
    const clickedData = event.clickedData ? event.clickedData : [];
    const obj_ = {
      'startDate': this.selectedTimeRange.timestamp_start,
      'endDate': this.selectedTimeRange.timestamp_end,
      'timeType': 'td'
    };

    this.summaryChartDrillDataStr['hTitle'] = 'Hourly Ticket';
    this.summaryChartDrillDataStr.header = [];
    this.summaryChartDrillDataStr.data = [];
    this.open(this.summaryTicketsData, 'lg');
    this.summaryChartDrillDataStr.isPanelLoading = true;
    const ticketsUrl = 'incident/data/homehourlytrendticket';
    this.reporService_.IncidentHomehourlyTrendTicketDrillData(ticketsUrl, obj_, clickedData).subscribe(res => {
      if (res.status) {
        this.summaryChartDrillDataStr.header = res.data.charts.header;
        this.summaryChartDrillDataStr.data = res.data.charts.data;
        this.summaryChartDrillDataStr.isPanelLoading = false;
        $('#PanelTestDrillData').click();
      } else {
        this.summaryChartDrillDataStr.isPanelLoading = false;
      }
    });
  }

}
