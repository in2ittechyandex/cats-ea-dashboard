import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByNotKey',
  pure: true
})
export class FilterByNotKeyPipe implements PipeTransform {

  transform(array: Array<any>, searchInField: string, shouldNotHaveValue: string): any {
    const arrCust = array;
    array = arrCust.filter((lock) => {
      return !(lock[searchInField].toLowerCase().match(shouldNotHaveValue.toLowerCase()));
    });
    return array;
  }

}
