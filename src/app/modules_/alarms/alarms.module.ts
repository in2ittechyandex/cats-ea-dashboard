import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AlarmsRoutingModule } from './alarms-routing.module';
import { AlarmsComponent } from './alarms.component';
import { FormsModule } from '@angular/forms';
import { LayoutsModule } from '../layouts/layouts.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
// import { PagerService } from '../../services_/pager.service';
// import { FusionChartsModule } from 'angular-fusioncharts';

// import * as FusionCharts from 'fusioncharts';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import * as Charts from 'fusioncharts/fusioncharts.charts';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
//  import * as PowerCharts from 'fusioncharts/fusioncharts.powercharts';
//  import * as Widgets from 'fusioncharts/fusioncharts.widgets';
//  import * as Maps from 'fusioncharts/fusioncharts.maps';
//  import * as World from 'fusioncharts/maps/fusioncharts.world';
 import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
// FusionChartsModule.fcRoot(FusionCharts, Charts,PowerCharts, FusionTheme);
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxComponent } from '../aggridCommon/mat-checkbox.component';
import { MatSelectModule, MatFormField, MatFormFieldModule, MatInputModule } from '@angular/material';
// import { TabFilterComponent } from '../../shared_/tab-filter/tab-filter.component';
import { FilterByKeyPipe } from 'src/app/shared_/pipes_/filter-by-key.pipe';
import { SharedModule } from 'src/app/shared_/shared.module';
// import { DataRenderedComponent } from '../aggridCommon/data-renderer.component';
// import { CustomizedAmChartModule } from 'src/app/shared_/customized-am-chart/customized-am-chart.module';
// import { DemoMaterialModule } from 'src/app/shared_/material-module';
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';
import { CustomizedAmChartModule } from '../customized-am-chart/customized-am-chart.module';
import { PagerService } from 'src/app/shared_/pager.service';
// import { PagerService } from 'src/app/services_/pager.services';
// import { NgxMatDatetimePickerModule,NgxNativeDateModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
@NgModule({
  imports: [
    CommonModule,
    AlarmsRoutingModule,
    FormsModule,
    LayoutsModule,
    // FusionChartsModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    CustomizedAmChartModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
  }),
  MatDatepickerModule,
  // AgGridModule.withComponents([MatCheckboxComponent,DataRenderedComponent]),
  MatSelectModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatButtonModule,
    MatButtonToggleModule,
  MatInputModule,
  NgMultiSelectDropDownModule.forRoot(),
  // DemoMaterialModule,
  SharedModule,
      // NgxMatTimepickerModule,
      // NgxMatDatetimePickerModule,
      // NgxMatNativeDateModule
  ],
  declarations: [AlarmsComponent],
  providers: [
    PagerService,
    NumberToDatePipe],
})
export class AlarmsModule { }
