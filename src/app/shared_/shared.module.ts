import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { NumberToDatePipe } from './pipes_/number-to-date.pipe';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { GridSmartTableComponent } from './grid-smart-table/grid-smart-table.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridTableComponent } from './ag-grid-table/ag-grid-table.component';
import { DataRenderedComponent } from '../modules_/aggridCommon/data-renderer.component';
import { ButtonRendererComponent } from '../modules_/aggridCommon/button-renderer.component';
import { MatCheckboxComponent } from '../modules_/aggridCommon/mat-checkbox.component';
import { TabFilterComponent } from './tab-filter/tab-filter.component';
import { ContextmenuComponent } from './context-menu/contextMenu.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    MatTableModule,
    MatPaginatorModule,
    AgGridModule.withComponents([MatCheckboxComponent, DataRenderedComponent,ButtonRendererComponent]),
    // Ng2SmartTableModule
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
    MatCheckboxComponent
  ],
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
    MatCheckboxComponent
  ],
  providers: [TimeFilterService, SharedServices
  ]
})
export class SharedModule { }
