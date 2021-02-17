import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JitsiComponent } from './jitsi.component';

@NgModule({
  declarations: [JitsiComponent],
  imports: [
    CommonModule
  ],
  exports: [JitsiComponent]
})
export class JitsiModule { }
