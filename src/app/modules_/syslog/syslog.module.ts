import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyslogRoutingModule } from './syslog-routing.module';
import { SyslogComponent } from './syslog.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker'; 
import { LayoutsModule } from '../layouts/layouts.module'; 
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxComponent } from '../aggridCommon/mat-checkbox.component';
import { SharedModule } from 'src/app/shared_/shared.module';
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    SyslogRoutingModule, 
    FormsModule,
    NgbModule.forRoot(), 
    LayoutsModule,  
    ReactiveFormsModule,
    Daterangepicker,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
  }) ,
  // AgGridModule.withComponents([MatCheckboxComponent]),
  SharedModule
  ],
  providers:[DaterangepickerConfig,NumberToDatePipe],
  declarations: [SyslogComponent]
})
export class SyslogModule { }
