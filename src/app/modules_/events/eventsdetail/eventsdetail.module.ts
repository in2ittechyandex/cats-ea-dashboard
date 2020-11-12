import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsdetailRoutingModule } from './eventsdetail-routing.module'; 
import { EventsdetailComponent } from 'src/app/modules_/events/eventsdetail/eventsdetail.component';
import { DetailComponent } from './detail/detail.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
// import { FusionChartsModule } from 'angular-fusioncharts';
import { LayoutsModule } from '../../layouts/layouts.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
// import { CustomizedAmChartModule } from 'src/app/shared_/customized-am-chart/customized-am-chart.module';
import { SharedModule } from 'src/app/shared_/shared.module';
import { CustomizedAmChartModule } from '../../customized-am-chart/customized-am-chart.module';

@NgModule({
  imports: [
    CommonModule,
    EventsdetailRoutingModule, 
    FormsModule,
    // FusionChartsModule,
    LayoutsModule,
    NgbModule.forRoot(), 
    ReactiveFormsModule,
    Daterangepicker,
    SharedModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
  }),
  CustomizedAmChartModule,
  SharedModule
  ],
  declarations: [EventsdetailComponent,DetailComponent,SidebarComponent]
})
export class EventsdetailModule { }
