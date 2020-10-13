import { Pipe, PipeTransform } from '@angular/core';
declare var moment: any;


@Pipe({
  name: 'dateconv',
  pure: true
})
export class DateconvPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // console.log('DateconvPipe  : '+value);
    const date = moment(value, 'DD-MM-YYYY');
    const day = date.toDate().getDate();
    return day;
  }

}



@Pipe({
  name: 'prioritySep',
  pure: true
})
export class PrioritySepPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      const commaSplit = value.split(',');
      const cateObj = {};
      commaSplit.forEach(element => {
          const cateNameCount = element.split(' ');
          cateObj[cateNameCount[0].trim()] = cateNameCount[1];
      });
      return cateObj;
  }

}
