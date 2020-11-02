import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EngineerViewComponent } from './engineer-view.component'; 
import { CloudDevOpsComponent } from './cloud-dev-ops/cloud-dev-ops.component';
import { MyAlertsComponent } from './my-alerts/my-alerts.component';

const routes: Routes = [  
  { 
    path: '', 
   component: EngineerViewComponent,
   pathMatch: 'prefix', 
        children: [ 
            { path: 'cloud-dev-ops', component:CloudDevOpsComponent }, 
            { path: 'my-alerts', component:MyAlertsComponent }, 
            { path: '**',redirectTo: 'cloud-dev-ops'  }
        ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EngineerViewRoutingModule { }
