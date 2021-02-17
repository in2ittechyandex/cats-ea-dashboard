import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToDate',
  pure: true
})
export class NumberToDatePipe implements PipeTransform {

  transform(value: any, unit: any = 'mn', aliasType: any = 'sm', returntype: any = 'string'): any {
    return this.convertCountToString(value, unit, aliasType);
  }

  convertCountToString(value, valueUnit, aliasType): string {
    const units = {};
    const conv_ = this.validateValue(value, valueUnit);
    value = conv_.value;
    valueUnit = conv_.valueUnit;
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
    } else if (valueUnit == 's') {
      units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365 * 60;
      units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30 * 60;
      units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7 * 60;
      units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60 * 60;
      units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60 * 60;
      units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1 * 60;
      units[aliasType == 'sm' ? 'Sec' : 'Seconds'] = 1;
    } else if (valueUnit == 'ms') {
      units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365 * 60 * 1000;
      units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30 * 60 * 1000;
      units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7 * 60 * 1000;
      units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60 * 60 * 1000;
      units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60 * 60 * 1000;
      units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1 * 60 * 1000;
      units[aliasType == 'sm' ? 's' : 'Seconds'] = 1 * 1000;
      units[aliasType == 'sm' ? 'ms' : 'Milli Seconds'] = 1;
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


  validateValue(value, valueUnit) {
    if (valueUnit == 'h') {
      if (value > 0 && value < 1) {
        valueUnit = 'ms';
        value = (value * 60 * 60 * 1000);
        return { 'value': value, 'valueUnit': valueUnit };
      } else {
        valueUnit = 'mn';
        value = (value * 60 );
        return { 'value': value, 'valueUnit': valueUnit };
      }
    } else if (valueUnit == 'mn') {
      if (value > 0 && value < 1) {
        valueUnit = 'ms';
        value = (value * 60 * 1000);
        return { 'value': value, 'valueUnit': valueUnit };
      }
    }
    return { 'value': value, 'valueUnit': valueUnit };
  }

}



@Pipe({
  name: 'minToHHMMSS',
  pure: true
})
export class MinuteCountToHHMMSS implements PipeTransform {

  transform(mins_num: any): any {

    let hours: any = Math.floor(mins_num / 60);
    let minutes: any = Math.floor((mins_num - ((hours * 3600)) / 60));
    let seconds: any = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));
    // Appends 0 when unit is less than 10
    if (hours < 10) { hours = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }

}

