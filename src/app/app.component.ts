import { environment } from './../environments/environment';
import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import pageSettings from './config/page-settings';
import { AppConfig } from './config/app.config';
// import * as global from './config/globals';

@Component({
  selector: 'cats-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private titleService: Title,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router,
    private renderer: Renderer2,
    private appConfig: AppConfig) {
    environment._WEBGATEWAY_BASIC_URL_ = appConfig.getConfig('_WEBGATEWAY_BASIC_URL_');
    environment._AUTH_GATEWAY_URL = appConfig.getConfig('_AUTH_GATEWAY_URL');
    environment._AUTH_PRODUCT_SERVICES_URL = appConfig.getConfig('_AUTH_PRODUCT_SERVICES_URL');
    environment._CHATBOT_URL = appConfig.getConfig('_CHATBOT_URL');
    environment.gateWayAuthorization = appConfig.getConfig('gateWayAuthorization')  ? appConfig.getConfig('gateWayAuthorization') : false;
    environment.envConfig = appConfig.getConfig('envConfig')  ? appConfig.getConfig('envConfig') : {};
    router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        if (window.innerWidth < 768) {
          this.pageSettings.pageMobileSidebarToggled = false;
        }
        if (e.url != '/') {
          slimLoadingBarService.progress = 50;
          slimLoadingBarService.start();
        }
      }
      if (e instanceof NavigationEnd) {
        if (e.url != '/') {
          setTimeout(function () {
            slimLoadingBarService.complete();
          }, 300);
        }
      }
    });


  }
  title = 'cats-dashboard-v2';
  pageSettings;

  // window scroll
  pageHasScroll;


  ngOnInit() {
    // page settings
    this.pageSettings = pageSettings;
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
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
