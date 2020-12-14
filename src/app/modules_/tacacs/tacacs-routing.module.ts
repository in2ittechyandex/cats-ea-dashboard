import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TacacsComponent } from './tacacs.component';

const routes: Routes = [  { path: '', component: TacacsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TacacsRoutingModule { }
