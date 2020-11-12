import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { EventsRoutingModule } from './events.routing.module';
// import { FormsModule } from '@angular/forms';
// import { PagerService } from '../../services_/pager.service';
// Import angular-fusioncharts
// import { FusionChartsModule } from 'angular-fusioncharts';

// import * as FusionCharts from 'fusioncharts';

// import * as Charts from 'fusioncharts/fusioncharts.charts';

//  import * as PowerCharts from 'fusioncharts/fusioncharts.powercharts';
//  import * as Widgets from 'fusioncharts/fusioncharts.widgets';
//  import * as Maps from 'fusioncharts/fusioncharts.maps';
//  import * as World from 'fusioncharts/maps/fusioncharts.world';

// import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventsdetailComponent } from './eventsdetail/eventsdetail.component';
import { EventRouteComponent } from './event_route.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxComponent } from '../aggridCommon/mat-checkbox.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { TabFilterComponent } from '../../shared_/tab-filter/tab-filter.component';
import { SharedModule } from 'src/app/shared_/shared.module';
// import { CustomizedAmChartModule } from 'src/app/shared_/customized-am-chart/customized-am-chart.module';
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';
import { CustomizedAmChartModule } from '../customized-am-chart/customized-am-chart.module';
import { PagerService } from 'src/app/shared_/pager.service';


// FusionChartsModule.fcRoot(FusionCharts, Charts,PowerCharts, FusionTheme);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // FusionChartsModule,
    LayoutsModule,
    NgbModule.forRoot(),
    EventsRoutingModule,
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
    // AgGridModule.withComponents([MatCheckboxComponent]),
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule
  ],
  providers: [
    PagerService,
    NumberToDatePipe
  ],
  declarations: [EventsComponent, EventRouteComponent]
})
export class EventsModule { }
