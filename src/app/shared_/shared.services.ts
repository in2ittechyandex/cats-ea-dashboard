import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SharedServices {
	newSubjectPrintCsv: Subject<boolean> = new Subject<boolean>();
    constructor() {

    }

    public sortTabReportsByColSpan(tabReports) {
        const twelve = Object.assign([], tabReports);
        const six = [];
        const four = [];
        const eight = [];
        let sorted_reports = [];
        this.separateAllBySolSpan(twelve, four, six, eight);
        sorted_reports = this.mergeAll(6, sorted_reports, twelve, six, eight, four);
        sorted_reports = this.mergeAll(12, sorted_reports, twelve, six, eight, four);
        sorted_reports = this.mergeAll(8, sorted_reports, twelve, six, eight, four);
        sorted_reports = this.mergeAll(4, sorted_reports, twelve, six, eight, four);
        sorted_reports = this.mergeAll('all', sorted_reports, twelve, six, eight, four);
        return sorted_reports;
    }

    /**
     *
     * @param type merge by alias
     * @param sorted_reports // target array
     * @param twelve  // array of  elements having colSpan 12
     * @param six   // array of  elements having colSpan 6
     * @param eight // array of  elements having colSpan 8
     * @param four // array of  elements having colSpan 4
     */
    private mergeAll(type, sorted_reports, twelve, six, eight, four) {
        switch (type) {
            case 12:
                sorted_reports = sorted_reports.concat(twelve);
                twelve.length = 0;
                break;
            case 6:
                const arr = (six.length % 2 == 0) ? six.splice(0, six.length) : six.splice(0, six.length - 1);
                sorted_reports = sorted_reports.concat(arr);
                break;
            case 8:
                for (let i = 0; i < eight.length; i++) {
                    if (four.length > 0) {
                        sorted_reports.push(eight.shift());
                        sorted_reports.push(four.shift());
                        i = i - 1;
                    } else {
                        break;
                    }
                }
                break;
            case 4:
                const fourarr = (four.length % 3 == 0) ? four.splice(0, four.length) : four.splice(0, (four.length - four.length % 3));
                sorted_reports = sorted_reports.concat(fourarr);
                break;
            case 'all':
                sorted_reports = sorted_reports.concat(six, four, eight);
        }
        return sorted_reports;
    }

    /**
     * This f/n will separte main array by colSpan to their respectives Arrays.
     * @param twelve array contains all 12's
     * @param four  array contains all 4's
     * @param six array contains all 6's
     * @param eight array contains all 8's
     */
    private separateAllBySolSpan(twelve, four, six, eight) {
        for (let i = 0; i < twelve.length; i++) {
            switch (twelve[i].colSpan) {
                case 4:
                    four.push(twelve[i]);
                    twelve.splice(i, 1);
                    i = i - 1;
                    break;
                case 6:
                    six.push(twelve[i]);
                    twelve.splice(i, 1);
                    i = i - 1;
                    break;
                case 8:
                    eight.push(twelve[i]);
                    twelve.splice(i, 1);
                    i = i - 1;
                    break;
            }
        }
    }

    public chartDataSortByKey(array, key: string) {
        if (key.toLowerCase().trim() === 'date') {
            // return array.sort(function (a: any, b: any) {
            //     const dateA: any = new Date(a[key]);
            //     const dateB: any = new Date(b[key]);
            //     // return dateA - dateB;
            //     return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
            // });
            /**
             * As Date Formate for all api's is DD-MM-YYYY
             * so we are spliting it with (-)
             * Ramji Made changes  on 19-09-2019
             */
          return  array.sort(function(a, b) {
                const aa = a[key].split('-').reverse().join(),
                    bb = b[key].split('-').reverse().join();
                return aa < bb ? -1 : (aa > bb ? 1 : 0);
            });


        } else {
            return array.sort(function (a, b) {
                const x = a[key]; const y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
    }


    public sortByKey(array, key: string) {
        return array.sort(function (a, b) {
            const x = a[key]; const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    getAmChartsTheme() {
        const amChartsTheme = localStorage.getItem('amChartsTheme');
    }


    /**
     * Remove escape-sequences
     * @param value 
     */
    replacer(value) {
        return value.replace(/['"]+/g, '');
    }
	
	
	/**
     * This f/n will reportName alias , to generate a csv
     * @param csv : csv string
     * @param identByHeaderName :
     * @param identByDeviceIP :
     */
    getReportNameAlias(csv: string, identByHeaderName = 'Device Name', identByDeviceIP = 'Device IP') {
        const csvRowSplitBy = '\n';
        const csvColumnSplitBy = ',';
        const lines = csv.split(csvRowSplitBy);
        let rNameAlias = '';
        const headers_ = lines[0].split(csvColumnSplitBy).map((elm) => (this.replacer(elm)).trim());
        const identHeaderNdex = (headers_.indexOf(identByHeaderName) > -1) ? (headers_.indexOf(identByHeaderName)) : -1;
        const identHeaderNdexdeviceIP = (headers_.indexOf(identByDeviceIP) > -1) ? (headers_.indexOf(identByDeviceIP)) : -1;
        const lRow_ = lines.length;
        const lHeader_ = headers_.length;
        let deviceIP_ = '';
        if (identHeaderNdex > -1) {
            for (let i = 1; i < lRow_; i++) {
                const row_ = lines[i].split(csvColumnSplitBy);
                if (i == 1) {
                    rNameAlias = this.replacer(row_[identHeaderNdex]);
                    deviceIP_ = (identHeaderNdexdeviceIP > -1) ? this.replacer(row_[identHeaderNdexdeviceIP]) : '';
                } else if (rNameAlias != this.replacer(row_[identHeaderNdex])) {
                    // TODO: 'There are several device_name/ip in records , return with blank ';
                    this.newSubjectPrintCsv.next(false);
                    return '' + '.csv';
                }
            }
        } else {
            this.newSubjectPrintCsv.next(false);
            return rNameAlias + '.csv';
        }
        this.newSubjectPrintCsv.next(false);
        return '_' + rNameAlias + ((deviceIP_.trim() != '') ? '_' + deviceIP_ : deviceIP_) + '.csv';
    }
	
	deviceReport(){
        this.newSubjectPrintCsv.next(false);
    }

}
