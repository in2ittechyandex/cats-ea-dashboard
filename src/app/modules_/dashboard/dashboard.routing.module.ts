import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EngineerViewComponent } from '../engineer-view/engineer-view.component';


const routes: Routes = [
    {
        path: '', pathMatch: 'prefix',
        component: DashboardComponent,
        children: [
            {
                path: 'custom-widget/:tabId', loadChildren: '../widgets/custom-widget/custom-widget.module#CustomWidgetModule',
                data: { preload: false, delay: false  }
            },
            {
                path: 'home', loadChildren: '../user-home/user-home.module#UserHomeModule',
                data: { preload: true, delay: false }
            },
            // {
            //     path: 'engineer-view', component: EngineerViewComponent,
            //     data: { preload: true, delay: false }
            // },
            { path: 'engineer-view',loadChildren:'../engineer-view/engineer-view.module#EngineerViewModule',
            data: { preload: true, delay: false }
     },
            { path: '**', redirectTo: 'home' }
        ]
    }

];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})


export class DashboardRoutingModule { }
