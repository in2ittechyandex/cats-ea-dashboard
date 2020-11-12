import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsdetailComponent } from './eventsdetail.component';
 
const routes: Routes = [
    
  {
       path: '', component: EventsdetailComponent,
  // path: '',
  // component: EventsdetailComponent,
  // children: [ 
  //     { path: 'eventdetail', component: EventsdetailComponent}, 
  //     { path: '**',redirectTo: 'eventdetail'  }
  // ]
} 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsdetailRoutingModule { }
