import { UserTab } from './../../../models_/tab';
import {
  Component, OnInit, AfterViewChecked, ElementRef,
  HostListener, Input, EventEmitter,
  Output, ViewChild, OnDestroy
} from '@angular/core';
import pageSettings from '../../../config/page-settings';
import pageMenus from '../../../config/page-menus';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from '../../../config/theme-settings';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ReportService } from '../../../services_/report.services';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { LoggedUser } from 'src/app/models_/loggeduser';

@Component({
  selector: 'cats-left-site-bar',
  templateUrl: './left-site-bar.component.html',
  styleUrls: ['./left-site-bar.component.css'],
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
export class LeftSiteBarComponent implements OnInit, AfterViewChecked, OnDestroy {
  menus;
  constructor(private eRef: ElementRef,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private reportService_: ReportService) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.selectedTab = val.url;
      }
    });

    this.userTabSubscr_ = this.reportService_.getUserTabsSubscriber().subscribe(tabs => {
      this.tabList = <UserTab[]>tabs;
    });

    this.menus = pageMenus.userMenu;
    for (let m = 0; m < this.menus.length; m++) {
      this.menus[m].hide = false;
    }

  }

  navProfileState = 'collapse';
  @ViewChild('sidebarScrollbar') private sidebarScrollbar: ElementRef;
  @Output() toggleSidebarMinified = new EventEmitter<boolean>();
  @Output() hideMobileSidebar = new EventEmitter<boolean>();
  @Input() pageSidebarTransparent;
  @Input() pageSidebarMinified;

  // menus = pageMenus;
  pageSettings;
  themeConf_;
  mobileMode;
  desktopMode;
  scrollTop;
  selectedTab = '/dashboard/home';  // '/dashboard/static-widget/map-monitor';//;
  modalReferenceAddWidget: any;
  modalReferenceUpdateWidget: any;

  @ViewChild('modalDialogUpdateTab') modalDialogUpdateTab: ElementRef;

  loggedUser: LoggedUser;

  public model_addnewTab = {
    id: '',
    name: '',
    description: '',
  };

  public model_updateTab = {
    id: '',
    name: '',
    description: '',
    status: true
  };

  public tabList: UserTab[] = [];
  public userTabSubscr_: Subscription;
  closeResult: string;

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
    for (const menu of allMenu) {
      if (menu != currentMenu) {
        menu.state = 'collapse';
      }
    }
    if (currentMenu.state === 'expand' || (active.isActive && !currentMenu.state)) {
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

  ngOnDestroy() {
    this.userTabSubscr_.unsubscribe();
  }

  ngOnInit() {
    if (localStorage.getItem('loggedUser') != null) {
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }

    this.themeConf_ = themeConf_;
    this.pageSettings = pageSettings;
    this.reportService_.fetchUsertabs();
  }

  open(content) {
    this.modalReferenceAddWidget = this.modalService.open(content);
    this.modalReferenceAddWidget.result.then((result) => {
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
    const url = '/dashboard/custom-widget/' + tabId;
    this.router.navigateByUrl(url);
  }

  public clickUpdateTab(obj: any, index: number) {
    this.model_updateTab.id = obj.id;
    this.model_updateTab.name = obj.name;
    this.model_updateTab.description = obj.description;
    this.model_updateTab['status'] = (obj['status'] === 1);
    this.open(this.modalDialogUpdateTab);
  }


  public updateTabDetails(tabObject: any) {
    const objUpdate_ = {
      'tabId': tabObject.id,
      'tabName': tabObject.name,
      'tabDescription': tabObject.description,
      'status': tabObject['status'] ? 1 : 0
    };
    this.modalReferenceAddWidget.close();

    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update It!'
    }).then((result) => {
      if (result.value) {
        this.reportService_.updateExistingTab(objUpdate_).subscribe(res => {
          if (res.status) {
            const res_data = res.data;
            const tabId_ = res_data.id;
            let index_ = 0;
            for (let i_ = 0; i_ < this.tabList.length; i_++) {
              if (this.tabList[i_].id === tabId_) {
                index_ = i_;
              }
            }

            if (res_data['status'] === 0) {
              this.manageRoutingDeleteTab(index_);
            } else {
              this.tabList[index_].name = res_data.name;
              this.tabList[index_].description = res_data.description;
            }
          }
        }, err => {

        });
      }
      if (result.dismiss) {
      }
    }, err => {
    });

  }

  resetCreateTabModal() {
    Object.keys(this.model_addnewTab).forEach(element => {
      this.model_addnewTab[element] = '';
    });
  }


  public createTab() {
    this.modalReferenceAddWidget.close();
    this.reportService_.saveNewTab(this.model_addnewTab.name, this.model_addnewTab.description).subscribe(
      data => {
        if (data.status) {
          const objResult_ = data.data;
          const obj = {
            id: objResult_.id,
            name: objResult_.name,
            description: objResult_.description
          };
          swal({
            position: 'center',
            type: 'success',
            title: objResult_.name,
            titleText: 'Tab Successfully Created',
            showConfirmButton: false,
            timer: 1500
          });
          const createdTab: UserTab = new UserTab(obj);
          this.reportService_.addNewTabToSubscribedList(createdTab);
          const url = '/dashboard/custom-widget/' + createdTab.id;
          return this.router.navigate([url]);
        }
      },
      error => {

      },
      () => this.reportService_.fetchUsertabs()
    );
  }


  public manageRoutingDeleteTab(index) {
    this.tabList.splice(index, 1);
    const url = this.tabList.length > 0 ? ('/dashboard/custom-widget/' + (this.tabList[this.tabList.length - 1].id)) : '/dashboard/home';
    this.reportService_.fetchUsertabs();
    return this.router.navigate([url]);
  }


  /**
   *  Layout dynamic subroutes : start
   */

  public navigateToReport(title, url, tab, filter) {
    // console.log("title"+title+"url"+url+"tab"+tab+"filter"+filter);
    // const url = '/dashboard/custom-widget/' + createdTab.id;
    return this.router.navigate([url]);
  }


}
