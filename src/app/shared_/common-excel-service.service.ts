import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonExcelServiceService {
    newSubjectPrintXlsx: Subject<boolean> = new Subject<boolean>();
    constructor() { }

    async generateExcel2(data2) {
        const data = [{
            username: 'Satheesh Elumalai',
            email: 'satheesh123@gmail.com',
            phone: '1122334455',
            address: 1000
        }, {
            username: 'Smith',
            email: 'smith123@gmail.com',
            phone: '1122334455',
            address: 1000
        }, {
            username: 'Steve',
            email: 'steve123@gmail.com',
            phone: '1122334455',
            address: 1000
        }, {
            username: 'Wilson',
            email: 'wilson@gmail.com',
            phone: '1122334455',
            address: 1000
        }];

        const header = ['User Name', 'Email', 'Phone Number', 'Address'];
        // Create workbook and worksheet
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet();
        // Cell Style : Fill and Header
        const FileName = 'TestXlsxFileName';
        const headerRow = worksheet.addRow(header);
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFFFFFFF'
                },
                bgColor: {
                    argb: 'FFFFFFFF'
                },
            };
            cell.font = {
                color: {
                    argb: '00000000',
                },
                bold: true
            };
            cell.border = {
                top: {
                    style: 'thin'
                },
                left: {
                    style: 'thin'
                },
                bottom: {
                    style: 'thin'
                },
                right: {
                    style: 'thin'
                }
            };
        });
        data.forEach(d => {
            const row = worksheet.addRow(d);
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFFFFFFF'
                }
            };
            row.font = {
                color: {
                    argb: '00000000',
                },
                bold: false
            }
            row.eachCell((cell, number) => {
                cell.border = {
                    top: {
                        style: 'thin'
                    },
                    left: {
                        style: 'thin'
                    },
                    bottom: {
                        style: 'thin'
                    },
                    right: {
                        style: 'thin'
                    }
                };
            });
        });
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 40;
        worksheet.getColumn(3).width = 20;
        worksheet.getColumn(4).width = 20;
        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fs.saveAs(blob, FileName + '.xlsx');
        });
    }

    async generateExcel(fileName, sheetName, mappedHeader, data, customHedaerRow: any[] = []) {

        const keys_ = Object.keys(mappedHeader);
        const rowHeader = Object.values(mappedHeader);
        const rows = [];
        for (let i = 0; i <= data.length - 1; i++) {
            const arr = [];
            const datsSet = data[i];
            for (let hdrs = 0; hdrs <= keys_.length - 1; hdrs++) {
                arr[hdrs] = datsSet[keys_[hdrs]];
            }
            rows.push(arr);
        }

        // Create workbook & add worksheet
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);


        if (customHedaerRow.length > 0) {
            // TODO: add custom header to csv
            worksheet
                .addRow(customHedaerRow);
        }


        // add column headers
        worksheet
            .addRow(rowHeader);

        // worksheet.columns = [
        //   { header: 'Package', key: 'package_name' },
        //   { header: 'Author', key: 'author_name' }
        // ];

        // Add row using key mapping to columns
        // worksheet.addRow(
        //   { package_name: "ABC", author_name: "Author 1" },
        //   { package_name: "XYZ", author_name: "Author 2" }
        // );

        // Add rows as Array values
        // worksheet
        //   .addRow(["BCD", "Author Name 3"]);

        // Add rows using both the above of rows
        // const rows = [
        //   ["FGH", "Author Name 4"],
        //   { test:"User", package_name: "PQR", author_name: "Author 5" },
        //   { package_name: "PQR", author_name: "Author 5_1" }
        // ];


        worksheet
            .addRows(rows);

        // save workbook to disk
        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fs.saveAs(blob, fileName + '.xlsx');
        });

    }

    async generateAgGridExcel(fileName, sheetName, columns_: Array<any>, data, customHeaderRow: any[] = []) {
        let headerNameArr = [];
        let fieldArr = [];
        columns_.map(item => {
            headerNameArr.push(item.headerName);
            fieldArr.push(item.field);
        });

        const keys_ = fieldArr;
        const rowHeader = headerNameArr;
        const rows = [];
        for (let i = 0; i <= data.length - 1; i++) {
            const arr = [];
            const datsSet = data[i];
            for (let hdrs = 0; hdrs <= keys_.length - 1; hdrs++) {
                arr[hdrs] = datsSet[keys_[hdrs]];
            }
            rows.push(arr);
        }

        // Create workbook & add worksheet
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);


        // Adding Custom Header
        if (customHeaderRow.length > 0) {
            customHeaderRow.forEach(cHRow_ => {
                worksheet.addRow([cHRow_]);
            });
            // worksheet.addRow(customHeaderRow);
            worksheet.addRow([]); // add a blank row
        }


        // add column headers
        worksheet.addRow(rowHeader);

        // let mappingColumns_ = [];
        // columns_.forEach(elm_ => {
        //   mappingColumns_.push({header: elm_['headerName'], key: elm_['field']});
        // });


        // worksheet.columns = mappingColumns_;
        // console.log(mappingColumns_)

        // worksheet.columns = [
        //   { header: 'Package', key: 'package_name' },
        //   { header: 'Author', key: 'author_name' }
        // ];

        // Add row using key mapping to columns
        // worksheet.addRow(
        //   { package_name: "ABC", author_name: "Author 1" },
        //   { package_name: "XYZ", author_name: "Author 2" }
        // );

        // Add rows as Array values
        // worksheet
        //   .addRow(["BCD", "Author Name 3"]);

        // Add rows using both the above of rows
        // const rows = [
        //   ["FGH", "Author Name 4"],
        //   { test:"User", package_name: "PQR", author_name: "Author 5" },
        //   { package_name: "PQR", author_name: "Author 5_1" }
        // ];

        worksheet.addRows(rows);

        const headerStartRow = (customHeaderRow.length + 2);
        columns_.forEach((element, index) => {
            const dobCol = worksheet.getColumn((index + 1));
            dobCol.width = (element['headerName'] == 'Device Name') ? 30 :
            (element['headerName'].length < 15) ? 15 : (element['headerName'].length + 2);
            dobCol.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Header Row
        worksheet.getRow(headerStartRow).font = {
            size: 11,
            bold: true
        };

        // let rowIndex = 3; // start row Data
        // for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
        //     // worksheet.getRow(rowIndex).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
        //     worksheet.getRow(rowIndex).alignment = { vertical: 'middle', horizontal: 'left' , wrapText : true };
        // }

        // save workbook to disk
        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fs.saveAs(blob, fileName + '.xlsx');
        });

        this.newSubjectPrintXlsx.next(false);

    }


}