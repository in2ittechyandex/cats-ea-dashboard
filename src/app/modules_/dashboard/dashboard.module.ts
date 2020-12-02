import { DashboardRoutingModule } from './dashboard.routing.module';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { LayoutsModule } from '../layouts/layouts.module'; 
import { SharedModule } from 'src/app/shared_/shared.module';
import { EpisodeComponent } from '../episode/episode.component';
import { CaseComponent } from '../case/case.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
// import { MapulaModule } from '../mapula/mapula.module';

// import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    LayoutsModule,
    FormsModule,
    // MapulaModule,
    // DragDropModule
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [DashboardComponent,EpisodeComponent,CaseComponent]
})
export class DashboardModule { }
