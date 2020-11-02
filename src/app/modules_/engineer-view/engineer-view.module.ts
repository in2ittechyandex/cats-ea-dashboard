import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngineerViewRoutingModule } from './engineer-view-routing.module';
import { EngineerViewComponent } from './engineer-view.component'; 
import { CloudDevOpsComponent } from './cloud-dev-ops/cloud-dev-ops.component';
import { MyAlertsComponent } from './my-alerts/my-alerts.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutsModule } from '../layouts/layouts.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';  
import { SharedModule } from 'src/app/shared_/shared.module';
@NgModule({
  imports: [
    CommonModule,
    EngineerViewRoutingModule, 
    FormsModule,
    LayoutsModule,  
    NgbModule.forRoot(),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [EngineerViewComponent,CloudDevOpsComponent,MyAlertsComponent] 
})
export class EngineerViewModule { }
