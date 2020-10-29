import { DashboardRoutingModule } from './dashboard.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { EngineerViewComponent } from '../engineer-view/engineer-view.component';
import { SharedModule } from 'src/app/shared_/shared.module';
// import { MapulaModule } from '../mapula/mapula.module';

// import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    LayoutsModule
    // MapulaModule,
    // DragDropModule
  ],
  declarations: [DashboardComponent,
    EngineerViewComponent]
})
export class DashboardModule { }
