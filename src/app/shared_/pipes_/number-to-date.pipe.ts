import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToDate',
  pure: true
})
export class NumberToDatePipe implements PipeTransform {

  transform(value: any, unit: any = 'mn' , aliasType: any = 'sm'): any {
    return this.convertCountToString(value, unit, aliasType);
  }

  convertCountToString(value, valueUnit, aliasType): string {
    const units = {};
    if (valueUnit == 'mn') {
     units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365;
     units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30;
     units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7;
     units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60;
     units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60;
     units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1;
    } else if (valueUnit == 'h') {
      units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 365;
      units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 30;
      units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 7;
      units[aliasType == 'sm' ? 'D' : 'Day'] = 24;
      units[aliasType == 'sm' ? 'H' : 'Hours'] = 1;
    }
    const result = [];

    // tslint:disable-next-line: forin
    for (const name in units) {
      const p = Math.floor(value / units[name]);
      if (p === 1) { result.push(p + ' ' + name); }
      if (p >= 2) { result.push(p + ' ' + name); }
      value %= units[name];
    }

    let strTobeReturn = '';
    result.map(elm => {
      strTobeReturn += (strTobeReturn === '') ? elm : ',' + elm;
    });
    return strTobeReturn;
  }

}
