import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statisticDiff'
})
export class StatisticDiffPipe implements PipeTransform {

  transform(data, today, yesterday): any {
    const diff_ = today - yesterday;
    const statPos_ = diff_ === 0 ? 'v' : diff_ > 0 ? 'up' : 'down';
    if (yesterday === 0) {
      return { 'val': today, 'statPos_': statPos_ };
    } else if (today === 0) {
      return { 'val': yesterday, 'statPos_': statPos_ };
    } else {
      const per_ = (diff_ * 100) / yesterday;
      return { 'val': per_.toFixed(2), 'statPos_': statPos_ };
    }

  }

}
