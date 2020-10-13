import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKey',
  pure: true
})
export class FilterByKeyPipe implements PipeTransform {

  transform(array: Array<any>, searchInField: string, shouldHaveValue: string): any {
    const arrCust = array;
    array = arrCust.filter((lock) => {
      return (lock[searchInField].toLowerCase().match(shouldHaveValue.toLowerCase()));
    });
    return array;
  }

}


@Pipe({
  name: 'searchSortByKey',
  pure: true
})
export class SearchSortByKeyPipe implements PipeTransform {

  transform(array: Array<any>, searchInField: string, shouldHaveValue: string): any {
    const arrCust = array;
    array = arrCust.filter((lock) => {
      return (lock[searchInField].toLowerCase().match(shouldHaveValue.toLowerCase()));
    });
    return this.doSorting(array, shouldHaveValue, searchInField);
  }


  doSorting(columns: any[], tablePrefix, searchInField) {
    columns.sort(function (a, b) {
      if (a[searchInField].toLowerCase().indexOf(tablePrefix.toLowerCase())) {
        if (b[searchInField].toLowerCase().indexOf(tablePrefix.toLowerCase())) {
          return a[searchInField].toLowerCase().localeCompare(b[searchInField].toLowerCase());
        } else {
          return 1;
        }
      } else {
        if (b[searchInField].toLowerCase().indexOf(tablePrefix.toLowerCase())) {
          return -1;
        } else {
          return 0; // All prefixed are considered equal
        }
      }
    });
    return columns;
  }
}
