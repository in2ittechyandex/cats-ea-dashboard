import { UserHomeComponent } from './user-home/user-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeSummaryComponent } from './home-summary/home-summary.component';
import { IncidentReportComponent } from './incident-report/incident-report.component';
import { SmsHistoryComponent } from './sms-history/sms-history.component';
import { SummaryComponent } from './summary/summary.component';


const routes: Routes = [
    {
        path: 'summary', component: UserHomeComponent
    },
    {
        path: 'inc', component: IncidentReportComponent
    },
    {
        path: '', component: SummaryComponent
    }
    // ,
    // {
    //     path: 'sms-history', component: SmsHistoryComponent
    // }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})


export class UserHomeRoutingModule { }
