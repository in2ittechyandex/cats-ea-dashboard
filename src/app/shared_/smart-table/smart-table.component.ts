import { Component, OnInit, Input, AfterViewInit, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cats-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SmartTableComponent implements OnInit, OnChanges, AfterViewInit {

  constructor() {
  }

  @Input() headers: any = [];
  @Input() data: any = [];

  public width: any = 20;
  public tabLength: any = 20;
  public custFilHeaders: any = [];

  public sortStr = {
    ndx: 0,
    sort: false,
    sortType: '',
    filter: true,
    filterByStr: '',
    filterNdx: 0
  };

  ngOnChanges() {
    // console.log('...ngOnChanges .............. ');
    this.width = this.calculateWidth(this.headers);
    this.tabLength = (this.headers.length > 0 ? (this.width * this.headers.length) : this.width);
    this.prepHeaderFilterConf();
  }


  ngAfterViewInit() {
  }


  calculateWidth(headers: any[]) {
    let wid = this.width;
    headers.forEach((elm: any) => {
      if (elm.length > this.width) {
        wid = elm.length;
      }
    });
    return wid * 3; // assume one letter have approx 3 pixel space.
  }

  public prepHeaderFilterConf() {
    const cHeaders = [];
    this.headers.forEach((element, index) => {
      cHeaders[cHeaders.length] = {
        title: '' + element,
        filter: false ,
        filterByStr: '',
        sort: false,
        sortType: '',
        ndx: index,
        filterNdx: index,
        isAllowFilter: true,
        isAllowSort: true
      };
    });
    this.custFilHeaders = cHeaders;
  }

  getSortIcon(type) {
    if (type === '') {
      return 'sort-by';
    } else if (type === 'asc') {
      return 'sort-by-upper';
    } else if (type === 'desc') {
      return 'sort-by-lower';
    }
  }

  onSearchChange(index) {
    this.custFilHeaders.forEach((element, ndx) => {
      if (ndx === index) {
        // same element
        element['filter'] = true;
        this.sortStr.filterNdx = index;
        this.sortStr.filter = element['filter'];
        this.sortStr.filterByStr = element['filterByStr'];

      } else {
        element['filter'] = false;
        element['filterByStr'] = '';
      }
    });
  }

  sortNavigate(index) {
    this.custFilHeaders.forEach((element, ndx) => {
      if (ndx === index) {
        // same element
        element['sortType'] = (element['sortType'] === '' || element['sortType'] === 'desc') ? 'asc' : 'desc';
        element['sort'] = true;

        this.sortStr.ndx = index;
        this.sortStr.sortType = element['sortType'];
        this.sortStr.sort = element['sort'];
      } else {
        element['sort'] = false;
        element['sortType'] = '';
      }
    });

  }

  ngOnInit() {
  }

}
