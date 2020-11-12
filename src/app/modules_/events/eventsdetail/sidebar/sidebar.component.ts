import { Component, OnInit, AfterViewChecked, ElementRef, HostListener, Input, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import pageMenus from '../../../../config/page-menus';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from '../../../../config/theme-settings';
import { Router, Params, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ReportService } from '../../../../services_/report.services';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { EventsService } from '../../../events/events.service';

@Component({
  selector: 'cats-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('expand', style({ height: '*', overflow: 'hidden', display: 'block' })),
      state('collapse', style({ height: '0px', overflow: 'hidden', display: 'block' })),
      state('active', style({ height: '*', overflow: 'hidden', display: 'block' })),
      transition('expand <=> collapse', animate(100)),
      transition('active => collapse', animate(100))
    ])
  ]
})
export class SidebarComponent implements OnInit, AfterViewChecked, OnDestroy {

  navProfileState = 'collapse';
  @ViewChild('sidebarScrollbar') private sidebarScrollbar: ElementRef;
  @Output() toggleSidebarMinified = new EventEmitter<boolean>();
  @Output() hideMobileSidebar = new EventEmitter<boolean>();
  @Input() pageSidebarTransparent;
  @Input() pageSidebarMinified;

  menus;
  pageSettings;
  themeConf_;
  mobileMode;
  desktopMode;
  scrollTop;
  selectedTab = '/dashboard/home';

  public model_addnewTab = {
    id: '',
    name: '',
    description: ''
  };

  public tabList: any[] = [];
  public userTabSubscr_: Subscription;



  // public tabList: any[] = [{ "tabId": 1, "tabName": "Custom Report 1", "desc": "Testing Tab" }, { "tabId": 2, "tabName": "Custom Report 2", "desc": "Testing Tab" }, { "tabId": 3, "tabName": "Custom Report 3", "desc": "Testing Tab" }];


  toggleNavProfile() {
    if (this.navProfileState == 'collapse') {
      this.navProfileState = 'expand';
    } else {
      this.navProfileState = 'collapse';
    }
  }

  toggleMinified() {
    this.toggleSidebarMinified.emit(true);
    this.scrollTop = 0;
  }

  expandCollapseSubmenu(currentMenu, allMenu, active) {
    for (let menu of allMenu) {
      if (menu != currentMenu) {
        menu.state = 'collapse';
      }
    }
    if (currentMenu.state == 'expand' || (active.isActive && !currentMenu.state)) {
      currentMenu.state = 'collapse';
    } else {
      currentMenu.state = 'expand';
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.hideMobileSidebar.emit(true);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.scrollTop = (this.pageSettings.pageSidebarMinified) ? event.srcElement.scrollTop + 40 : 0;
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('sidebarScroll', event.srcElement.scrollTop);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewChecked() {
    if (typeof (Storage) !== 'undefined' && localStorage.sidebarScroll) {
      if (this.sidebarScrollbar && this.sidebarScrollbar.nativeElement) {
        this.sidebarScrollbar.nativeElement.scrollTop = localStorage.sidebarScroll;
      }
    }
  }
  closeResult: string;
  constructor(private eRef: ElementRef,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private userService: EventsService) {
      this.menus = pageMenus.adminMenu;
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }

     

    this.getEventsCounts();
  }
  myMenu=[];
  countEvent='';
  public getEventsCounts() {
    console.log("getAllServiceDesks ....");
    this.userService.getEventsCounts().subscribe((res) => {
        console.log("res : " + res);
        if (res.Status) {
             this.myMenu=res.data;
             this.countEvent=res.count;
             this.manageMenu();
        }
    }, (err) => {
        //this.auth_.handleHttpExceptions(err);
    });
}
manageMenu(){
  var submenu=[];
  
  for(var i=0;i<this.myMenu.length;i++){
    let str={
      'url': 'switch',
      'title': 'switch',
      'count': '6',
      'caret': '',
      'submenu' :[]
    };
    var mainMenu=this.myMenu[i];
    str.url=mainMenu["device"];
    str.title=mainMenu["device"];
    str.count=mainMenu["totalCount"];
    if(mainMenu["objList"].length>0){
      str.caret='true';
      
      var indata=mainMenu["objList"];
       for(var j=0;j<indata.length;j++){
        let instr={
          'url': 'switch',
          'title': 'switch',
          'count': '6',
          'caret': '',
          'submenu' :[]
        };
         var data=indata[j];
        instr.url=data["ci_id"];
        instr.title=data["ci_name"];
        instr.count=data["count"];
        str.submenu.push(instr);
       }
    }
      submenu.push(str);
  }
  console.log(JSON.stringify(submenu));
  
  for(var m=0;m<this.menus.length;m++){
    if(this.menus[m].title=="Events"){
      this.menus[m].submenu=[];
      this.menus[m].count='0';
      this.menus[m].submenu=submenu;
      this.menus[m].count=this.countEvent;
    }
  }
}
public navigateToReport(url,tab,filter) {
  console.log(tab);
// var url = "/widget/ireport/"+tab;
// this.userService.eventtypeId=tab;
this.userService.eventTypeFilter=filter;
if(this.userService.eventTypeFilter=="name"){
  this.userService.eventtypeId="";
  this.userService.eventTypeName=tab;
}else if(this.userService.eventTypeFilter=="id"){
  this.userService.eventtypeId=tab;
  this.userService.eventTypeName="";
  url=url+"/eventdetail";
}else{
  this.userService.eventtypeId="";
  this.userService.eventTypeName="";
}
if(filter==''){
this.getEventsCounts();
}
this.userService.changeSelectionType({"clickName":filter});
this.router.navigateByUrl(url);

}
  /**
      *  here we unsubscribe our observable services
      */
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
     
  }

  ngOnInit() {
    this.themeConf_ = themeConf_;
    this.pageSettings = pageSettings;
     
  }




  open(content) {
    this.modalService.open(content).result.then((result) => {
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


  public navidateTo(tabId) {
    var url = "/dashboard/custom-widget/" + tabId;
    this.router.navigateByUrl(url);
  }

  /**
     *  will delete/inactive tab 
     * 
     */
  public clickDeleteTab(tabId: number, index: number) {
    var sts = confirm("Are You Sure Want to Delete This Tab ");
    if (sts) {
      // code for deActivate User Tabs...... 
      // this.reportService_.deleteExistingTabFromDB(tabId).subscribe((res) => {
        //    this.alertService.success("Tab SuccessFully Deleted", false, 2500);
      //   this.manageRoutingDeleteTab(tabId, index);
      // }, (err) => {
        // this.auth_.handleHttpExceptions(err);
        // this.alertService.error(err, false, 2500);
    //   });
    // } else {
      //do nothing , use refuse to delete it.
    }

  }

  resetCreateTabModal() {
    Object.keys(this.model_addnewTab).forEach(element => {
      this.model_addnewTab[element] ="";
    });
  }

 


}
