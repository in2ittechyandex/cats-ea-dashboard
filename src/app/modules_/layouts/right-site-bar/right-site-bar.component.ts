import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../config/page-settings';
import themeConf_ from '../../../config/theme-settings';

@Component({
  selector: 'cats-right-site-bar',
  templateUrl: './right-site-bar.component.html',
  styleUrls: ['./right-site-bar.component.css']
})
export class RightSiteBarComponent implements OnInit {
  themeConf_;
  pageSettings;
  constructor() { }

  ngOnInit() {
    this.pageSettings = pageSettings;
    this.themeConf_ = themeConf_;
  }

  onToggleRightSideBar() {
    this.pageSettings.openRightSideBar = (!this.pageSettings.openRightSideBar);
  }

  changeTheme(type) {
    this.themeConf_.selectedTheme = type;
    this.themeConf_.selectedColor = this.themeConf_.defaultColor;
    localStorage.setItem('amChartsTheme', this.themeConf_.appThemeAMChartsThemeMapping[type]);
    this.themeConf_.amChartsTheme = localStorage.getItem('amChartsTheme') ?
      localStorage.getItem('amChartsTheme') : themeConf_.amChartsTheme;
    document.getElementById('themeStyle')
      .setAttribute('href', 'assets/css/' + this.themeConf_.selectedTheme + '/style.min.css');
    document.getElementById('themeResponsibe')
      .setAttribute('href', 'assets/css/' + this.themeConf_.selectedTheme + '/style-responsive.min.css');
    document.getElementById('themeColor')
      .setAttribute('href', 'assets/css/' + this.themeConf_.selectedTheme + '/theme/' + this.themeConf_.selectedColor + '.css');
  }
  changeColor(type) {
    this.themeConf_.selectedColor = type;
    document.getElementById('themeColor')
      .setAttribute('href', 'assets/css/' + this.themeConf_.selectedTheme + '/theme/' + type + '.css');
  }




}
