import { Component, OnInit, ViewEncapsulation,AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from '../../../config/theme-settings';
 import * as global from 'src/app/config/globals'; 
import pageSettings from '../../../config/page-settings'; 
import { HostListener } from '@angular/core';
@Component({
  selector: 'cats-eventsdetail',
  templateUrl: './eventsdetail.component.html',
  styleUrls: ['./eventsdetail.component.css']
})
export class EventsdetailComponent implements OnInit,OnDestroy {

  pageSettings; 
  global = global;
   closeResult: string;
    
   constructor(private modalService: NgbModal) { 
    this.pageSettings = pageSettings;
    // this.pageSettings.pageWithoutSidebar=true;
   }
 
   themeConf_;
   summaryCollapsed: boolean = true;
 
   ngOnInit() { 
     
     this.themeConf_ = themeConf_;
   }
 
   ngOnDestroy(): void { 
    this.pageSettings.pageWithoutSidebar=false;
  }
    // window scroll
  pageHasScroll;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    if (top > 0) {
      this.pageHasScroll = true;
    } else {
      this.pageHasScroll = false;
    }
  }

  // set page minified
  onToggleSidebarMinified(val: boolean): void {
    if (this.pageSettings.pageSidebarMinified) {
      this.pageSettings.pageSidebarMinified = false;
    } else {
      this.pageSettings.pageSidebarMinified = true;
    }
  }

  // set page right collapse
  onToggleSidebarRight(val: boolean): void {
    if (this.pageSettings.pageSidebarRightCollapsed) {
      this.pageSettings.pageSidebarRightCollapsed = false;
    } else {
      this.pageSettings.pageSidebarRightCollapsed = true;
    }
  }

  // hide mobile sidebar
  onHideMobileSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileSidebarToggled) {
      if (this.pageSettings.pageMobileSidebarFirstClicked) {
        this.pageSettings.pageMobileSidebarFirstClicked = false;
      } else {
        this.pageSettings.pageMobileSidebarToggled = false;
      }
    }
  }

  // toggle mobile sidebar
  onToggleMobileSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileSidebarToggled) {
      this.pageSettings.pageMobileSidebarToggled = false;
    } else {
      this.pageSettings.pageMobileSidebarToggled = true;
      this.pageSettings.pageMobileSidebarFirstClicked = true;
    }
  }


  // hide right mobile sidebar
  onHideMobileRightSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileRightSidebarToggled) {
      if (this.pageSettings.pageMobileRightSidebarFirstClicked) {
        this.pageSettings.pageMobileRightSidebarFirstClicked = false;
      } else {
        this.pageSettings.pageMobileRightSidebarToggled = false;
      }
    }
  }

  // toggle right mobile sidebar
  onToggleMobileRightSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileRightSidebarToggled) {
      this.pageSettings.pageMobileRightSidebarToggled = false;
    } else {
      this.pageSettings.pageMobileRightSidebarToggled = true;
      this.pageSettings.pageMobileRightSidebarFirstClicked = true;
    }
  }


}
