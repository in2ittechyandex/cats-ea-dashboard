import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatternComponent } from './pattern.component';

const routes: Routes = [{ path: '', component: PatternComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatternRoutingModule { }
