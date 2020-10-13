import { Component, Input, AfterViewInit, OnInit, Output, EventEmitter } from '@angular/core';

declare var moment: any;




@Component({
    selector: 'cats-tick-calender',
    templateUrl: './tick-calender.component.html',
    styleUrls: ['./tick-calender.component.css'],
})
export class TickCalenderComponent implements OnInit, AfterViewInit {

    @Input() chartUniqueId;
    @Input() chartType;
    @Input() dataProvider;
    @Input() chartTitleName;
    @Input() heightPixel;
    @Input() widthPer;

    @Input() reportSequence;
    @Input() reportId;


    // tslint:disable-next-line: no-output-on-prefix
    @Output() onClickNext = new EventEmitter();

    // tslint:disable-next-line: no-output-on-prefix
    @Output() onClickPrev = new EventEmitter();
    @Output() leftClickDetection = new EventEmitter();

    public display = false;
    public days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    public months = ['January', 'February', 'March', 'April',
     'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'];
    public data: any[] = [];
    public prevDates: any[] = [];
    public afterDates: any[] = [];
    public monthYear = '';
    public currentDate = '';

    constructor() { }

    ngOnInit() {
        this.display = false;
        this.getRawCells();
    }

    ngAfterViewInit() {

    }

    public getRawCells() {
        if (this.dataProvider && this.dataProvider.data.length > 0) {
            this.data = this.dataProvider.data;
            const firstDate = this.data[0]['Date'];
            this.currentDate = firstDate;
            const lastDate = this.data[this.data.length - 1]['Date'];
            this.prevDates = this.getPreviousDays(firstDate);
            this.afterDates = this.getAfterDays(lastDate);
            this.display = true;
        } else {
            this.display = false;
        }

    }

    getPreviousDays(firstDate) {
        const date = moment(firstDate, 'DD-MM-YYYY');
        const day = date.toDate().getDay();
        this.monthYear = this.months[date.toDate().getMonth()] + ' ' + date.toDate().getFullYear();
        const cells = [];
        for (let i = (day - 1); i > 0; i--) {
            const d = new Date();
            d.setDate(date.toDate().getDate() - i);
            cells[cells.length] = { dtp_: d.getDate() };
        }
        return cells;
    }


    getAfterDays(lastDate) {
        const dateMomLast_ = moment(lastDate, 'DD-MM-YYYY');
        const lastDay = dateMomLast_.toDate().getDay();
        const cellAfter = [];
        for (let i = 1; i <= (7 - lastDay); i++) {
            const dateMomLast = moment(lastDate, 'DD-MM-YYYY').add('day', i);
            cellAfter[cellAfter.length] = { dta_: dateMomLast.toDate().getDate() };
        }
        return cellAfter;
    }


    clickPrevious() {
        const dateMomLast = moment(this.currentDate, 'DD-MM-YYYY').subtract('month', 1);
        const res = {
            reportId: this.reportId,
            reportSequence: this.reportSequence,
            lastDate: this.currentDate,
            month: (dateMomLast.toDate().getMonth() + 1),
            year: dateMomLast.toDate().getFullYear()
        };
        this.onClickPrev.emit(res);
    }


    clickNext() {
        const dateMomLast = moment(this.currentDate, 'DD-MM-YYYY').add('month', 1);
        const res = {
            reportId: this.reportId,
            reportSequence: this.reportSequence,
            lastDate: this.currentDate,
            month: (dateMomLast.toDate().getMonth() + 1),
            year: dateMomLast.toDate().getFullYear()
        };
        this.onClickNext.emit(res);
    }

    downloadCSV() {
        const data = this.dataProvider.data;
        const rows = [];
        for (let i = 0; i <= data.length - 1; i++) {
            const prioritySplit = data[i].Priority.toString().split(',');
            const criticalP = prioritySplit[0].toString().substring(prioritySplit[0].toString().indexOf(' ') + 1).trim();
            const highP = prioritySplit[1].toString().substring(prioritySplit[1].toString().indexOf(' ') + 1).trim();
            const modP = prioritySplit[2].toString().substring(prioritySplit[2].toString().indexOf(' ') + 1).trim();
            const lowP = prioritySplit[3].toString().substring(prioritySplit[3].toString().indexOf(' ') + 1).trim();
            const reqP = prioritySplit[4].toString().substring(prioritySplit[4].toString().indexOf(' ') + 1).trim();
            rows.push([data[i].Date, lowP, modP, highP, criticalP, reqP]);
        }

        let csvContent = 'data:text/csv;charset=utf-8,';
        const row = ['Date', 'Low', 'Modrate', 'High', 'Critical', 'Request'];
        csvContent += row + '\r\n';
        rows.forEach(function (rowArray) {
            const row_ = rowArray.join(',');
            csvContent += row_ + '\r\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'calender.csv');
        document.body.appendChild(link); // Required for FF

        link.click();

    }

    clickOnChart(event, obj_) {
        const xCord = event.pageX;
        const yCord = event.pageY;
        const screenX = event.screenX;
        const screenY = event.screenY;
        const res = {
            screenX: screenX,
            screenY: screenY,
            clientX: xCord,
            clientY: yCord,
            reportId: this.reportId,
            reportSequence: this.reportSequence
        };

        const dataContextNextFilter_ = obj_['nextFilter'];
        const filterName_ = this.dataProvider.config['filterName'];
        const arrayDrill: any[] = [];
        arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
        res['clickedData'] = arrayDrill;
        this.leftClickDetection.emit(res);
    }


}



