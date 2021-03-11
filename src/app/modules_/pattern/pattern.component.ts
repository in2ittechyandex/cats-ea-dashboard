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
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';
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
    private numberToDatePipe_: NumberToDatePipe,
    private sharedServices_: SharedServices,
    private timeServices_: TimeFilterService) {
    this.dataSource = this.data;
  }
  ngOnInit() {

    this.themeConf_ = themeConf_;
    this.getAllMessagePattern();
    this.getClusteringChartData();
  }

  alarmIdChange(event){
    console.log(event);
    this.loading=true;
    this.getChartProbability(event.clusterName,event.cluster,event.nms,this.daysClusterData)
  }
  getClusteringChartData() {
    this.loading = true;
    this.isChartDataReceived = false;
    this.dateRange=this.getTimeString().str;
    this.patternService.getClusteringChartData(this.daysClusterData).subscribe(res => {
      if (res['status']) {
        this.chartData = res;
        

        // this.chartData['data'].forEach(element => {
        //   let keys=Object.keys(element);

        // });

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
  getChartProbability(clusterName,cluster,nms,days) {
    // this.loading = true;

    this.patternService.getChartProbability(cluster,nms, days).subscribe((res) => {
      if (res.status) {
        this.data.data = res.data;
        this.dataSource = this.data;

        this.titleChart = clusterName;
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
        this.getChildEventinCluster(clusterName,cluster,nms, days);
        this.getProbabilityOfCluster(cluster,nms);
        document.getElementById('modelDialogButton').click();

      } else {
        this.data.data = [];
        this.dataSource = this.data;
      }
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }
getProbabilityOfCluster(cluster,nms){
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
    this.patternService.getAllProbabilityByMesage(cluster,nms).subscribe((res) => {
      if (res.status) {
        this.probability.next7day = res.data.next7days;
        this.probability.next15days = res.data.next14days;
        this.probability.next30days = res.data.next21days;
        this.probability.next90days = res.data.next28days;
        this.probability.last7days = res.data.last7days;
        this.probability.last15days = res.data.last14days;
        this.probability.last30days = res.data.last21days;
        this.probability.last90days = res.data.last28days;
      } else {
        alert(res.msg);
      }
      this.loaderProbability = false;
    }, (err) => {
      this.loaderProbability = false;
    });
}
  public dbAllcolumns = [
     
    {
      headerName: 'Time',
      field: 'display_time',
      sortable: true,
      filter: true,
      editable: false,
      resizable: true,
      headerTooltip: 'Time',
      minWidth: 100,
      // cellRenderer: 'buttonRenderer',
      // cellRendererParams: {
      //   onClick: this.clickOnEventsId.bind(this),
      //   label: '',
      //   rendererType: 'link'
      // },
      // cellRenderer: function (params) {
      //  return '<span style="cursor:pointer;color:blue;">'+params.value+'</span>'
      // },
      'isActive': true,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
      editable: false,
      draggable: true,
      resizable: true,
      flex: 1,
      minWidth: 200,
      headerTooltip: 'Description',
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;" title="' + params.value + '">' + params.value + '</span>'
      },
      'isActive': true,
    },
    {
      headerName: 'Severity',
      field: 'severity',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Severity',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Host Name',
      field: 'host_name',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Host Name',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'IP',
      field: 'ip',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'IP',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Interface',
      field: 'interface',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Interface',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Input Source',
      field: 'Input Source',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Input Source',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Alias Name',
      field: 'a_name',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Alias Name',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'State',
      field: 'state',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'State',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    }, {
      headerName: 'Location',
      field: 'location',
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Location',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Alarm Name',
      field: 'alarm_name',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Alarm Name',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Alarm Type',
      field: 'alarm_type',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Alarm Type',
      resizable: true,
      'isActive': true,
      minWidth: 150,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    // {
    //   headerName: 'Raw Event',
    //   field: 'rawdata',
    //   sortable: true,
    //   editable: false,
    //   filter: true,
    //   headerTooltip: 'Raw Event',
    //   resizable: true,
    //   'isActive': true,
    //   minWidth: 150,
    //   cellRenderer: function (params) {
    //     var str = params.value;
    //     var str1 = str.split('<').join(' ');
    //     var str2 = str1.split('>').join(' ');
    //     var str3 = str2.split('.').join(' ');
    //     return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;" title="' + str3 + '">' + str3 + '</span>'
    //   },
    // }
  ];
  alarmChildEvent;
  tableHeight="200";
 // timeRange="";
 //timeZone="";
responseTime=0;
showSetting:boolean=false;
title="Child Events";

 
getChildEventinCluster(clusterName,cluster,nms,days) {  
const startTime: number = new Date().getTime();
this.patternService.getChildEventinCluster(cluster,nms,days).subscribe((res) => {
  if (res['status']) {  
        // this.eventChildData = res.data.event; 
        const endTime: number = new Date().getTime();
        const diffTime = endTime - startTime;
        this.responseTime = this.numberToDatePipe_.transform(diffTime, 'ms');
        this.alarmChildEvent=res.data;
       this.title=this.title+" - "+this.data['host_name'];
  }else{
 alert(res['data']);
  } 

  
}, (err) => {  
});


//

this.timeRange=this.getHeaders(this.timeServices_.getstartDateInTimestamp(),this.timeServices_.getendDateInTimestamp());

}
timeRange="";

getHeaders(startDate,endDate) {
const startTime = startDate;
const endTime = endDate;
let str = '';
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const myDateStart = new Date(startTime);
const myDateEnd = new Date(endTime);
str += '';

  str += this.getDatePart1(myDateStart)['full'] + ' - ' + this.getDatePart1(myDateEnd)['full'];

str +=  '';



return str;

}
getDatePart1(myDateStart: Date) {
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
  openFullScreen(content) {
    // this.probability = {
    //   "next7day": 0,
    //   "next15days": 0,
    //   "next30days": 0,
    //   "next90days": 0,
    //   "last7days": 0,
    //   "last15days": 0,
    //   "last30days": 0,
    //   "last90days": 0
    // };
    // this.loaderProbability = true;
    // this.patternService.getAllProbabilityByMesage(msg).subscribe((res) => {
    //   if (res.status) {
    //     this.probability.next7day = res.data.next7days;
    //     this.probability.next15days = res.data.next15days;
    //     this.probability.next30days = res.data.next30days;
    //     this.probability.next90days = res.data.next90days;
    //     this.probability.last7days = res.data.last7days;
    //     this.probability.last15days = res.data.last15days;
    //     this.probability.last30days = res.data.last30days;
    //     this.probability.last90days = res.data.last90days;
    //   } else {
    //     alert(res.msg);
    //   }
    //   this.loaderProbability = false;
    // }, (err) => {
    //   this.loaderProbability = false;
    // });
     
    // this.getChartProbability(this.days);
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
   


}
