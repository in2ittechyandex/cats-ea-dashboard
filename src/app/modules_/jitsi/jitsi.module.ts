import { DemoMaterialModule } from 'src/app/shared_/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JitsiComponent } from './jitsi.component';

@NgModule({
  declarations: [JitsiComponent],
  imports: [
    CommonModule,
    DemoMaterialModule
  ],
  exports: [JitsiComponent],
  entryComponents:[JitsiComponent]
})
export class JitsiModule { }
