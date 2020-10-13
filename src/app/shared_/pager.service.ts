import { Injectable } from '@angular/core';

@Injectable()
export class PagerService {


    /**
     *
     * @param totalItems  // total records available in db
     * @param currentPage // current page 
     * @param pageSize      // limit of records per page Default 10.
     */
    getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = this.range(startPage, endPage );

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

/**
 * will created pagination sequence
 * @param start  // show pagination count from 
 * @param end   // show pagination count upto
 */
    range(start:number, end:number) {
        let step =1;
        var range = [];
        var typeofStart = typeof start;
        var typeofEnd = typeof end;
        if (end < start) {
            step = -step;
        }

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

        return range;
    }


}