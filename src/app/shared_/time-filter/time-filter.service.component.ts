import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, EventEmitter } from '@angular/core';
import { TimeFilterComponent } from './time-filter.component';

declare var moment: any;


@Injectable()
export class TimeFilterService {
    public timeInfo: any = {
        date: {
            start: moment().startOf('day'),
            end: moment().format('DD-MM-YYYY h:mm:ss')
        },
        timestamp: {
            start: Date.parse(moment().startOf('day')),
            end: Date.parse(moment()),
        },
        'alias': 'custom',
        timeType: {
            value: 'td'
        },
        range: {
            value : [
                'Today',
                'Yesterday',
                'Last 7 Days',
                'This Month',
                'Last 3 Months',
                'Last 6 Months',
                'This Year'
              ]
        }
    };

    // public timeInfo: any = {
    //     date: {
    //         start: moment(moment().subtract(1, 'month').format("DD-MM-YYYY h:mm:ss")).startOf('day'),
    //         end: moment().format("DD-MM-YYYY h:mm:ss")
    //     },
    //     timestamp: {
    //         start: Date.parse(moment(moment().subtract(1, 'month')).startOf('day')),
    //         end: Date.parse(moment()),
    //     },
    //     "alias": "custom",
    //     timeType: {
    //         value: "td"
    //     }
    // };

    public timeZone = 'UTC';

    public timeSubscriber = new BehaviorSubject(this.timeInfo);

    public getTimeFilterSubscriber() {
        return this.timeSubscriber.asObservable();
    }


    public setTimeInfo(dateStart: any, dateEnd: any, tsStart: any, tsEnd: any, sFilter: any, ident_: any = '' , selectedRange_: any) {
        const obj = {
            date: {
                start: dateStart,
                end: dateEnd
            },
            timestamp: {
                start: tsStart,
                end: tsEnd,
            },
            timeType: {
                value: sFilter
            },
            range: {
                value : selectedRange_
            }
        };
        if (ident_ != '') {
            obj['ident_'] = ident_;
        }
        this.timeInfo = obj;

        // // // console.log('setTimeInfo : ' + JSON.stringify(obj));
        this.getTimeInfo();
    }

    public getTimeInfo() {
        this.sendToSubscribers();
    }

    public sendToSubscribers() {
        this.timeSubscriber.next(this.timeInfo);
    }

    public getstartDate() {
        return this.timeInfo.date.start;
    }

    public getendDate() {
        return this.timeInfo.date.end;
    }

    public getstartDateInTimestamp() {
        return this.timeInfo.timestamp.start;
    }

    public getendDateInTimestamp() {
        return this.timeInfo.timestamp.end;
    }
    public getstartDateInTimestamp1() {
        return moment(this.timeInfo.timestamp.start).format('YYYY-MM-MM hh:mm:ss');
    }

    public getendDateInTimestamp1() {
        return moment(this.timeInfo.timestamp.end).format('YYYY-MM-DD hh:mm:ss');
    }
    public getTimeZone() {
        return this.timeZone;
    }
    public getCurrentTime() {
        // var obj = {
        //     date: {
        //         start: dateStart,
        //         end: dateEnd
        //     },
        //     timestamp: {
        //         start: tsStart,
        //         end: tsEnd,
        //     }
        // };
        // this.timeInfo = obj;


        return Date.parse(moment());
    }
    public getTimeBeforeOneyear() {
        return Date.parse(moment().subtract(12, 'months'));
    }
    public getLastTimeBefore(minutes: number) {
        return Date.parse(moment().subtract(minutes, 'minutes'));
    }

}
