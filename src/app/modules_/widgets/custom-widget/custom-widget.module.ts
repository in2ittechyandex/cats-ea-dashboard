import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomWidgetComponent } from './custom-widget/custom-widget.component';
import { CustomWidgetRoutingModule } from './custom-widget.routing.module';
import { LayoutsModule } from '../../layouts/layouts.module';
import { CustomizedAmChartModule } from '../../customized-am-chart/customized-am-chart.module';
import { SharedModule } from '../../../shared_/shared.module';
import { SharedServices } from 'src/app/shared_/shared.services';
import { Daterangepicker } from 'ng2-daterangepicker';


// import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    CommonModule,
    CustomWidgetRoutingModule,
    LayoutsModule,
    Daterangepicker,
    CustomizedAmChartModule,
    NgbModule.forRoot() ,

    // DragDropModule
  ],
  declarations: [CustomWidgetComponent],
  providers: [SharedServices]

})
export class CustomWidgetModule { }
