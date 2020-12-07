import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SyslogComponent } from './syslog.component';

const routes: Routes = [  { path: '', component: SyslogComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyslogRoutingModule { }
