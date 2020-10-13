import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private router: Router) { }
  isPrinting = false;
  newSubjectPrintPDF: Subject<boolean> = new Subject<boolean>();

  public pConfig = {
    headers: [],
    data: [],
    reportTitle: '',
    pdfTitle: '',
    customer: '',
    customerPNG: '',
    rowCount: 0,
    filterApplied: []
  };

  printDocument(documentName: string, documentData: string) {
    this.isPrinting = true;
    this.router.navigate(['/',
      {
        outlets: {
          'print': ['print', documentName, documentData]
        }
      }]);
  }

  // makePrint(documentName: string, documentData: string) {
  //   this.isPrinting = true;
  //   this.router.navigate(['/',
  //     { outlets: {
  //       'print': ['print', documentName, documentData]
  //     }}]);
  // }


  // printPDF(){
  //   this.isPrinting = true;
  //   this.router.navigate(['/',
  //     { outlets: {
  //       'print': ['print', documentName, documentData]
  //     }}]);
  // }

  onDataReady(docTitle: string, reportTitle: string) {
    this.newSubjectPrintPDF.next(false);
    setTimeout(() => {
      var originalTitle = document.title;
      document.title = reportTitle; // localStorage.getItem('reportPageTitle'); // "Report";
      window.print();
      document.title = originalTitle;
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null } }]);
    });
  }

  setPrintConfig(obj) {
    this.pConfig = obj;
  }

  getCustomerLogo(cust_) {
    let custLogoMap = {
      'Transnet': 'transnet',
      'WCG': 'wcg',
      'ECG': 'ecg'
    };
    return custLogoMap.hasOwnProperty(cust_) ? 'assets/' + custLogoMap[cust_] + '.png' : 'assets/transnet.png';

  }

  getPrintConfig() {
    return this.pConfig;
  }

}
