import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TacacsRoutingModule } from './tacacs-routing.module';
import { TacacsComponent } from './tacacs.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutsModule } from '../layouts/layouts.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';  
import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker'; 
import { SharedModule } from 'src/app/shared_/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TacacsRoutingModule,
    CommonModule, 
    FormsModule,
    NgbModule.forRoot(), 
    LayoutsModule,  
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
  }),
  
  SharedModule
  ],
  declarations: [TacacsComponent]
})
export class TacacsModule { }
