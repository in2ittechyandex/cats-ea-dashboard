import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatternRoutingModule } from './pattern-routing.module';
import { PatternComponent } from './pattern.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';   
import { CustomizedAmChartModule } from '../customized-am-chart/customized-am-chart.module';
import { SharedModule } from 'src/app/shared_/shared.module';
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';
@NgModule({
  imports: [
    CommonModule,
    PatternRoutingModule, 
    FormsModule,   
    NgbModule.forRoot(), 
    ReactiveFormsModule,
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
  providers: [NumberToDatePipe],
  declarations: [PatternComponent]
})
export class PatternModule { }
