import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomizedAmChartModule } from './../customized-am-chart/customized-am-chart.module';
import { UserHomeRoutingModule } from './user-home.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHomeComponent } from './user-home/user-home.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { NgbModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { HomeSummaryComponent } from './home-summary/home-summary.component';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxComponent } from '../aggridCommon/mat-checkbox.component';
import { IncidentReportComponent } from './incident-report/incident-report.component';
import { SharedModule } from 'src/app/shared_/shared.module';
import { SmsHistoryComponent } from './sms-history/sms-history.component';
import { SummaryComponent } from './summary/summary.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    UserHomeRoutingModule,
    LayoutsModule,
    CustomizedAmChartModule,
    NgbModule.forRoot(),
    AgGridModule.withComponents([MatCheckboxComponent]),
  ],
  providers: [NgbDropdown],
  declarations: [
    UserHomeComponent,
     HomeSummaryComponent,
      IncidentReportComponent,
      // MatCheckboxComponent,
       SmsHistoryComponent ,
        SummaryComponent]
})
export class UserHomeModule { }
