import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class CustomExcelService {

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

    async generateExcel(fileName, sheetName, mappedHeader, data, customHedaerRow: any[] = [], customChartTitle: string = '') {
        
        if (customChartTitle) {
            let chartTitle = customChartTitle;
            let startDate = '';
            let endDate = '';
            if ((chartTitle.split("(").length - 1) == 2) {
                chartTitle = "(" + chartTitle.split("(")[chartTitle.split("(").length - 1];
            }

            if (chartTitle.indexOf('To') !== -1) {
                startDate = ((chartTitle.split('(')[1]).split(')')[0]).split(' To ')[0];
                endDate = ((chartTitle.split('(')[1]).split(')')[0]).split(' To ')[1];
            } else if (chartTitle.indexOf('to') !== -1) {
                startDate = ((chartTitle.split('(')[1]).split(')')[0]).split(' to ')[0];
                endDate = ((chartTitle.split('(')[1]).split(')')[0]).split(' to ')[1];
            } else {
                startDate = (chartTitle.split('(')[1]).split(')')[0];
                endDate = (chartTitle.split('(')[1]).split(')')[0];
            }

            let arrayReport = customHedaerRow.findIndex(element => element.includes("Report:"))
            if (arrayReport !== -1) {
                let reportValue = customHedaerRow[arrayReport];
                customHedaerRow.splice(arrayReport, 1);
                customHedaerRow.push(reportValue.split(' (')[0]);
                if (reportValue.indexOf(') - ') !== -1) {
                    customHedaerRow.push("Time Range: " + reportValue.split(') - ')[1]);
                }
            }

            if (startDate) {
                customHedaerRow.push("Start Date: " + startDate);
            }
            if (endDate) {
                customHedaerRow.push("End Date: " + endDate);
            }
        }
        // console.log(customHedaerRow);

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
        // Adding Custom Header
        if (customHedaerRow.length > 0) {
            customHedaerRow.forEach(cHRow_ => {
                worksheet.addRow([cHRow_]);
            });
            worksheet.addRow([]); // add a blank row
        }

        // add column headers
        worksheet
            .addRow(rowHeader);

        // Add XlSx Row
        worksheet
            .addRows(rows);

        // Add Header width & Alignment
        const headerStartRow =(customHedaerRow.length==0)?1: (customHedaerRow.length + 2);
        rowHeader.forEach((element, index) => {
            const dobCol = worksheet.getColumn((index + 1));
            dobCol.width = (('' + element).length < 31) ? 30 : (('' + element).length + 2);
            dobCol.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Add Header Size & Font
        worksheet.getRow(headerStartRow).font = {
            size: 11,
            bold: true
        };

        // save workbook to disk
        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fs.saveAs(blob, fileName + '.xlsx');
        });

    }
}
