import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule,DatePipe } from '@angular/common';
import { TimeFilterService } from './time-filter/time-filter.service.component';
import { NgModule } from '@angular/core';
import { TimeFilterComponent } from './time-filter/time-filter.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ClickOutSideDirectives } from '../directives_/clickOutSide.directive';
import { SharedServices } from './shared.services';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { FieldSortByPipe, StateTrans } from './pipes_/field-sort-by.pipe';
import { StatisticDiffPipe } from './pipes_/statistic-diff.pipe';
import { DateconvPipe, PrioritySepPipe } from './pipes_/dateconv.pipe';
import { FilterByNotKeyPipe } from './pipes_/filter-by-not-key.pipe';
import { FilterByKeyPipe, SearchSortByKeyPipe } from './pipes_/filter-by-key.pipe';
import { NoDoubleClickDirective } from '../directives_/noDoubleClick.directive';
import { NumberToDatePipe, MinuteCountToHHMMSS } from './pipes_/number-to-date.pipe';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { GridSmartTableComponent } from './grid-smart-table/grid-smart-table.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridTableComponent } from './ag-grid-table/ag-grid-table.component';
import { DataRenderedComponent } from '../modules_/aggridCommon/data-renderer.component';
import { ButtonRendererComponent } from '../modules_/aggridCommon/button-renderer.component';
import { MatCheckboxComponent } from '../modules_/aggridCommon/mat-checkbox.component';
import { TabFilterComponent } from './tab-filter/tab-filter.component';
import { ContextmenuComponent } from './context-menu/contextMenu.component';
import { PopupService } from './popup/popup.service';
import { ViewIncidentComponent } from './popup/view-incident/view-incident.component';
import { ViewSiaComponent } from './popup/view-sia/view-sia.component';
import { ViewSendMailComponent } from './popup/view-send-mail/view-send-mail.component';
import { ViewSendSmsComponent } from './popup/view-send-sms/view-send-sms.component';
import { D3Service } from "../modules_/d3/d3.service";
import { GraphComponent } from "../modules_/visuals/graph/graph.component";
import { SHARED_VISUALS } from "../modules_/visuals/shared";
import { D3_DIRECTIVES } from "../modules_/d3";
import { ViewAlarmComponent } from './popup/view-alarm/view-alarm.component';
import { ViewNiaComponent } from './popup/view-nia/view-nia.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DemoMaterialModule } from './material-module';

import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    MatTableModule,
    MatPaginatorModule,
    AgGridModule.withComponents([MatCheckboxComponent, DataRenderedComponent,ButtonRendererComponent]),
    // Ng2SmartTableModule,
    NgbModule.forRoot(),
    DemoMaterialModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    ScrollingModule  // vertual scrolling
  ],
  declarations: [
    TimeFilterComponent,
    ClickOutSideDirectives,
    SmartTableComponent,
    FieldSortByPipe,
    StateTrans,
    StatisticDiffPipe,
    DateconvPipe,
    PrioritySepPipe,
    FilterByNotKeyPipe,
    FilterByKeyPipe,
    NoDoubleClickDirective,
    NumberToDatePipe,
    SearchSortByKeyPipe,
    GridSmartTableComponent,
    AgGridTableComponent,
    DataRenderedComponent,
    ButtonRendererComponent,
    TabFilterComponent,
    ContextmenuComponent,
    MatCheckboxComponent,
    ViewAlarmComponent,
    ViewIncidentComponent,
    ViewNiaComponent,
    ViewSiaComponent,
    ViewSendMailComponent,
    ViewSendSmsComponent, 
    GraphComponent,
    SHARED_VISUALS,D3_DIRECTIVES,
    MinuteCountToHHMMSS
  ],
  entryComponents: [ViewAlarmComponent,
    ViewIncidentComponent,
    ViewNiaComponent,
    ViewSiaComponent,
    ViewSendMailComponent,
    ViewSendSmsComponent],
  exports: [
    TimeFilterComponent,
    ClickOutSideDirectives,
    SmartTableComponent,
    StateTrans,
    StatisticDiffPipe,
    DateconvPipe,
    PrioritySepPipe,
    FilterByNotKeyPipe,
    FilterByKeyPipe,
    NoDoubleClickDirective,
    NumberToDatePipe,
    SearchSortByKeyPipe,
    GridSmartTableComponent,
    AgGridTableComponent,
    DataRenderedComponent,
    ButtonRendererComponent,
    TabFilterComponent,
    ContextmenuComponent,
    MatCheckboxComponent,
    GraphComponent,
    SHARED_VISUALS,NumberToDatePipe,
    D3_DIRECTIVES,
    MinuteCountToHHMMSS
  ],
  providers: [TimeFilterService, SharedServices,PopupService,D3Service,DatePipe
  ]
})
export class SharedModule { }
