import { Component, OnInit, ViewChild, Input, EventEmitter, Output, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import swal from 'sweetalert2'; 
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { string } from '@amcharts/amcharts4/core';
declare var moment: any;

export interface SimpleChanges {
  [propName: string]: SimpleChange
}

@Component({
  selector: 'cats-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.css']
})
export class TabFilterComponent implements OnInit {


  // @Input() dbAllcolumns;
  @Input() timer;
  @Input() showSetting:boolean=true;
  @Input() showCreateEpisode:boolean=false;
  // @Output() reloadClick = new EventEmitter();
  // @Output() downloadClick = new EventEmitter();
  // @Output() headerModify = new EventEmitter();

  // // @ViewChild('emailSchedulesModelDialog') emailSchedulesModelDialog;

  // modelPopupReference: any;
  // closeResult: string;

  // constructor(private modalService: NgbModal) { }

  // ngOnInit() {
  //   // $('.Show').click(function () {
  //   //   console.log("show clicked");
  //   //   $('#target_allSaturation').show(500);
  //   //   $('.Show').hide(0);
  //   //   $('.Hide').show(0);
  //   // });
  //   // $('.Hide').click(function () {
  //   //   console.log("hide clicked");
  //   //   $('#target_allSaturation').hide(500);
  //   //   $('.Show').show(0);
  //   //   $('.Hide').hide(0);
  //   // });
  //   // $('.toggle').click(function () {
  //   //   console.log("toggle clicked");
  //   //   $('#target_allSaturation').toggle('slow');
  //   // });
  // }
  

  // open(content, size) {
  //   this.modelPopupReference = this.modalService.open(content, { size: size ? size : 'lg', backdrop: 'static' });
  //   this.modelPopupReference.result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  // // clkOnEmailPage() {
  // //   this.open(this.emailSchedulesModelDialog, 'lg');
  // // }

  // getActiveColumns(columns_: Array<any>) {
  //   const activeColumns = columns_.filter(elm => {
  //     return elm['isActive'];
  //   });
  //   return activeColumns;
  // }


  // isAllSelected(checklist) {
    
  //   this.headerModify.emit({'eventType': 'headerModify', 'modified': this.getActiveColumns(this.dbAllcolumns)});
  // }


  // clkOnDownloadIcon() {
  //   this.downloadClick.emit({ 'eventType': 'download' });
  // }

  // clkOnReloadIcon() {
  //   this.reloadClick.emit({ 'eventType': 'reload' });
  // }




  selectedTab = "messages";
  isSchedulerTabDisable: boolean = true;
  // activeAttachmentModel:string;
  schedularListData: any;
  schedulerDatepicker: any = new Date();
  // @ViewChild('refHeaderText') refHeaderText: ElementRef<HTMLElement>;

  // reportName: string;
  // timeType: string;
  schedulerReportName: string;
  schedulerRecurs: string = "";
  isSchedularListLoaded: boolean = false;
  headerDetail = { repName: '', timeType: '', customer: '', timeString: '', isLoaded: false, timeTypeKey: '' }

  // @Input() repDetail: { repName: string, timeType: string, customer: string, timeString: string, isLoaded: boolean };
  @Input() repDetail;
  @Input() dbAllcolumns;
  @Output() reloadClick = new EventEmitter();
  @Output() downloadClick = new EventEmitter();
  @Output() headerModify = new EventEmitter();
  @Output() thresholdClick = new EventEmitter();
  @Output() pdfClick = new EventEmitter();

  @Input() allFilters = [];

    

  modelPopupReference: any;
  closeResult: string;

  public flInputCust_ = new FormControl();
  public flTxtCust_: string;
 
  @Input() reportId: string = '';
@Output() createEpisodeEvent=new EventEmitter();
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, router: Router) {
    let routerurl = router.url;
    // this.reportId = routerurl.substring(routerurl.lastIndexOf('/') + 1);
  }
  createEpisode(){
    this.createEpisodeEvent.emit();
  }
checkHeader(headerName){
if(headerName==='Raw Event'){
  return true;
}
return false;
}
  ngOnInit() {
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
  }

 toggle(){
     if(document.getElementById("target_allSaturation").style.display=='none'){
      document.getElementById("target_allSaturation").style.display='block'
     }else{
      document.getElementById("target_allSaturation").style.display='none'
     }
   }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.repDetail) {
      this.onHeaderDataLoad(changes.repDetail.currentValue);
    }
  }

  onHeaderDataLoad(showHeading) {
    this.headerDetail = JSON.parse(showHeading);
    this.headerDetail.timeString = this.headerDetail.timeType + ' ' + this.headerDetail.timeString.split(' - ' + this.headerDetail.timeType)[0];
    // this.headerDetail.timeTypeKey = Object.keys(this.performanceService_.timeMap).find(key => this.performanceService_.timeMap[key] === this.headerDetail.timeType);
    this.schedulerReportName = this.headerDetail.repName;
    // console.log(this.headerDetail)
  }



  /**
*  will detect customer filter search option based on debouncetime
*/
  initFilterInputCustomer() {
    this.flTxtCust_ = '';
    this.flInputCust_
      .valueChanges
      // .debounceTime(500)
      // .distinctUntilChanged()
      .subscribe(term => {
        this.flTxtCust_ = term;
        // // console.log(term);
      });
  }


  open(content, size) {
    this.modelPopupReference = this.modalService.open(content, { size: size ? size : 'lg', backdrop: 'static' });
    this.modelPopupReference.result.then((result) => {
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

   

  getActiveColumns(columns_: Array<any>) {
    const activeColumns = columns_.filter(elm => {
      return elm['isActive'];
    });
    return activeColumns;
  }


  isAllSelected(checklist) {
    // this.gridApi.setColumnDefs([]);
    // this.gridApi.sizeColumnsToFit();
    // this.gridApi.setColumnDefs(this.getActiveColumns(this.dbAllcolumns));
    // this.gridApi.sizeColumnsToFit();

    this.headerModify.emit({ 'eventType': 'headerModify', 'modified': this.getActiveColumns(this.dbAllcolumns) });
  }


  clkOnDownloadIcon() {
    this.downloadClick.emit({ 'eventType': 'download' });
  }

  clkOnReloadIcon() {
    this.reloadClick.emit({ 'eventType': 'reload' });
  }

  // clkOnThreshold() {
  //   this.thresholdClick.emit({ 'eventType': 'threshold' });
  // }

  clkOnPdfIcon() {
    this.pdfClick.emit({ 'eventType': 'pdfClick' });
  }
 
}
