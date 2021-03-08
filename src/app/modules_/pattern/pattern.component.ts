import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { PatternService } from './pattern.service';
import { EventsService } from '../events/events.service';
import { ActivatedRoute } from '@angular/router';
declare var moment: any;
import themeConf_ from '../../config/theme-settings';
import { SharedServices } from 'src/app/shared_/shared.services';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
@Component({
  selector: 'cats-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css']
})
export class PatternComponent implements OnInit {
  closeResult: string;
  modalRef;
  size: number = 20;
  sizeCi: number = 5;
  patternlist = [];
  patternclickarray: boolean[] = [];
  cilist = [];
  ciMsg = "View";
  msg = "";
  totalEventCount = 0;
  msgCount = 0;
  data = {
    "chart": {

      "pYAxisName": "",
      "sYAxisName": "",


      "caption": "",
      "subcaption": "",
      "xaxisname": " ",
      "yaxisname": "",
      "formatNumberScale": "0",
      "numberprefix": "",
      "exportenabled": "0",
      "theme": "fusion",
      "bgColor": "#ffffff",
      "bgAlpha": "100",
      "showLabels": "1",
      "labelStep": "4",
      "rotateLabels": "0",
      "labelDisplay": "wrap",
      "slantLabel": "1",
      "showCanvasBorder": "0",
      "divlinecolor": "#000000",
      "divLineColor": "#6699cc",
      "divLineAlpha": "0",
      "divLineDashed": "0",
      "showAlternateHGridColor": "0",
      "showValues": "0",
      "rotateValues": "1",
      "showYAxisValues": "1",
      "showLegend": "1",
      "plotToolText": "$label : $value",
    },
    "data": []

  };
  width = "100%";
  height = 130;
  type = 'column2d';
  dataFormat = 'json';
  dataSource;
  loading: boolean = false;
  themeConf_;
  chartId = "patternChart"
  titleChart = "patternChart";
  daysClusterData = '7';
  chartData: Array<any> = [];
  isChartDataReceived: boolean = false;
  modelButton = {
    "isButton7DaysClicked": true,
    "isButton14DaysClicked": false,
    "isButton21DaysClicked": false,
    "isButton28DaysClicked": false
  }
  constructor(private router: Router,
    private route: ActivatedRoute,
    private userService: EventsService,
    private modalService: NgbModal,
    private patternService: PatternService,
    private renderer: Renderer2,
    private sharedServices_: SharedServices,
    private timeServices_: TimeFilterService) {
    this.dataSource = this.data;
  }
  ngOnInit() {

    this.themeConf_ = themeConf_;
    this.getAllMessagePattern();
    this.getClusteringChartData();
  }
  getClusteringChartData() {
    this.loading = true;
    this.isChartDataReceived = false;
    this.dateRange=this.getTimeString().str;
    this.patternService.getClusteringChartData(this.daysClusterData).subscribe(res => {
      if (res['status']) {
        this.chartData = res;
        this.isChartDataReceived = true;
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }

    )
  }
  changeDaysClusterData(days) {



    switch (days) {
      case '7': {
        this.modelButton.isButton7DaysClicked = true;
        this.modelButton.isButton14DaysClicked = false;
        this.modelButton.isButton21DaysClicked = false;
        this.modelButton.isButton28DaysClicked = false;
        break;
      }
      case '14': {
        this.modelButton.isButton14DaysClicked = true;
        this.modelButton.isButton7DaysClicked = false;
        this.modelButton.isButton21DaysClicked = false;
        this.modelButton.isButton28DaysClicked = false;
        break;
      }
      case '21': {
        this.modelButton.isButton21DaysClicked = true;
        this.modelButton.isButton14DaysClicked = false;
        this.modelButton.isButton7DaysClicked = false;
        this.modelButton.isButton28DaysClicked = false;
        break;
      }
      case '28': {
        this.modelButton.isButton28DaysClicked = true;
        this.modelButton.isButton14DaysClicked = false;
        this.modelButton.isButton21DaysClicked = false;
        this.modelButton.isButton7DaysClicked = false;
        break;
      }

      default:
        break;
    }
    this.daysClusterData = days;
    this.getClusteringChartData();
  }
  dateRange;
  getCustomRanges(days){
    return [moment().subtract(days, 'days').startOf('day'), moment().endOf('day')]
  }
  getTimeString() {
    const tAlias = '';//this.sharedServices_.timeMap[timeType];
    var daysT= parseInt( this.daysClusterData);
    const t = this.getCustomRanges((daysT-1));
    const startTime = t[0];
    const endTime = t[1];
    let str = tAlias + ' ';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const myDateStart = new Date(startTime);
    const myDateEnd = new Date(endTime);
    str += '(';
    // if (timeType == 'l1h') {
    //   str += this.getDatePart(myDateStart)['full'] + ' - ' + this.getDatePart(myDateEnd)['full'];
    // } else {
      str += this.getDatePart(myDateStart)['d_'] + '' + ' - ' + this.getDatePart(myDateEnd)['d_'] + '';
    // }
    str += ')';
    return { str: str, startDate: Date.parse(startTime), endDate: Date.parse(endTime) };
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
  getAllMessagePattern() {
    this.patternService.getAllMessagePattern(this.size).subscribe((res) => {
      if (res.status) {
        this.patternlist = res.data;
        this.totalEventCount = res['Count'];
        this.msg = this.patternlist[0].tag;
        this.getAllCIByMsg(this.msg);
        for (var i = 0; i < this.patternlist.length; i++) {
          this.patternclickarray[i] = false;
        }
        this.patternclickarray[0] = true;
      } else {
        alert(res.msg);
      }
    }, (err) => {
    });

  }
  clickedOnMsg(index, msg) {
    this.msg = msg;
    this.getAllCIByMsg(this.msg);
    this.ciMsg = 'View';
    this.showCilist = false;
    this.patternclickarray = [false];
    this.patternclickarray[index] = true;
  }
  getAllCIByMsg(msg) {
    this.loading = true;
    this.patternService.getAllCIByMesage(msg, this.sizeCi).subscribe((res) => {
      if (res.status) {
        this.cilist = res.data;
        this.msgCount = res['msgcount'];
      } else {
        alert(res.msg);
      }
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }
  loaderProbability: boolean = false;
  getProbabilityByMsg(msg) {

    this.patternService.getAllCIByMesage(msg, this.sizeCi).subscribe((res) => {
      if (res.status) {
        this.cilist = res.data;
        this.msgCount = res['msgcount'];
      } else {
        alert(res.msg);
      }

    }, (err) => {

    });
  }
  showCilist: boolean = false;
  viewEvent() {
    if (this.ciMsg == 'View') {

      this.ciMsg = 'Hide';
      this.showCilist = true;

    } else {
      this.showCilist = false;
      this.ciMsg = 'View';
    }
  }
  getChartProbability(days) {
    // this.loading = true;

    this.patternService.getChartProbability(this.msg, days).subscribe((res) => {
      if (res.status) {
        this.data.data = res.data;
        this.dataSource = this.data;

      } else {
        this.data.data = [];
        this.dataSource = this.data;
      }
      // this.loading = false;
    }, (err) => {
      // this.loading = false;
    });
  }
  probability = {
    "next7day": 0,
    "next15days": 0,
    "next30days": 0,
    "next90days": 0,
    "last7days": 0,
    "last15days": 0,
    "last30days": 0,
    "last90days": 0
  };
  days = 90;
  openFullScreen(content, msg) {
    this.probability = {
      "next7day": 0,
      "next15days": 0,
      "next30days": 0,
      "next90days": 0,
      "last7days": 0,
      "last15days": 0,
      "last30days": 0,
      "last90days": 0
    };
    this.loaderProbability = true;
    this.patternService.getAllProbabilityByMesage(msg).subscribe((res) => {
      if (res.status) {
        this.probability.next7day = res.data.next7days;
        this.probability.next15days = res.data.next15days;
        this.probability.next30days = res.data.next30days;
        this.probability.next90days = res.data.next90days;
        this.probability.last7days = res.data.last7days;
        this.probability.last15days = res.data.last15days;
        this.probability.last30days = res.data.last30days;
        this.probability.last90days = res.data.last90days;
      } else {
        alert(res.msg);
      }
      this.loaderProbability = false;
    }, (err) => {
      this.loaderProbability = false;
    });
    this.titleChart = this.msg;
    var len = this.titleChart.length;
    var finalString = "";
    var desiredLength = 100;
    if (len > desiredLength) {
      var str = (len / desiredLength).toFixed();
      var upper: number = parseInt(str);
      for (var i = 0; i <= upper; i++) {
        var subStr = this.titleChart.substring(desiredLength * i, desiredLength * (i + 1));
        finalString = finalString + " " + subStr + "\n";
      }
      this.titleChart = finalString;
    }
    this.getChartProbability(this.days);
    this.modalRef = this.modalService.open(content, { windowClass: 'my-class' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  clickOnHost(host) {
    this.userService.changeSelectionType({ "clickName": "event", "msgpattern": this.msg, "host": host, "nms": "" });

    this.router.navigateByUrl('/dashboard/events');
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close() {
    this.modalRef.close();
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
  swalPrimary() {
    swal('Question Type', 'description here', 'question');
  }

  swalInfo() {
    swal('Info Type', 'description here', 'info');
  }

  swalSuccess() {
    swal('Success Type', 'description here', 'success');
  }

  swalWarning() {
    swal('Warning Type', 'description here', 'warning');
  }

  swalDanger() {
    swal('Error Type', 'description here', 'error');
  }


}
