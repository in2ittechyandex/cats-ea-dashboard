import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldSortBy'
})
export class FieldSortByPipe implements PipeTransform {
  transform(array: Array<any>,
     orderField: string, orderType: string,
      sort: boolean, filter: boolean,
       filterByStr: string, filterNdx: any): Array<string> {
    if (filter && filterByStr.trim() != '') {
      const arrCust = array;
      array = arrCust.filter((lock) => {
        return lock[filterNdx].toLowerCase().match(filterByStr.toLowerCase());
      });
    }

    if (!sort) {
      return array;
    }

    if (orderType == '') {
      return array;
    } else if (orderType == 'asc') {
      array.sort((a: any, b: any) => {
        const ae = a[orderField];
        const be = b[orderField];
        if (ae == undefined && be == undefined) { return 0; }
        if (ae == undefined && be != undefined) { return orderType ? 1 : -1; }
        if (ae != undefined && be == undefined) { return orderType ? -1 : 1; }
        if (ae == be) { return 0; }
        return orderType ? (ae.toString().toLowerCase() > be.toString().toLowerCase() ? -1 : 1) :
         (be.toString().toLowerCase() > ae.toString().toLowerCase() ? -1 : 1);
      });
      return array;
    } else if (orderType == 'desc') {
      array.sort((a: any, b: any) => {
        const ae = a[orderField];
        const be = b[orderField];
        if (ae == undefined && be == undefined) { return 0; }
        if (ae == undefined && be != undefined) { return orderType ? 1 : -1; }
        if (ae != undefined && be == undefined) { return orderType ? -1 : 1; }
        if (ae == be) { return 0; }
        return orderType ? (be.toString().toLowerCase() > ae.toString().toLowerCase() ? -1 : 1) :
         (ae.toString().toLowerCase() > be.toString().toLowerCase() ? -1 : 1);
      });
      return array;
    }

  }

}



@Pipe({
  name: 'stateTrans',
  pure: true
})
export class StateTrans implements PipeTransform {

  transform(obj, today, yesterday) {
    return {'val': '13%', 's': 'up'};
  }
}
