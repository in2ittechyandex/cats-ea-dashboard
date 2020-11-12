import { EventsComponent } from './events.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsdetailComponent } from './eventsdetail/eventsdetail.component';
import { EventRouteComponent } from './event_route.component';

const routes: Routes = [
    {
        //  path: '', component: EventsComponent,
    path: '', pathMatch: 'prefix',
    component: EventRouteComponent,
    children: [
        { path: '', component: EventsComponent, data : {some_data : 'some value'}},
        { path: 'eventdetail', loadChildren: './eventsdetail/eventsdetail.module#EventsdetailModule'},
        // { path: '**',redirectTo: 'eventdetail'  }
    ]
}

];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})


export class EventsRoutingModule { }
