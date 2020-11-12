// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular'; 

@Component({
  selector: 'app-button-renderer',
  template: `
    <ng-container *ngIf="rendererType=='button'">
    <button type="button" [style.background-color]="colorSelected" style="color:#fff; padding:2px 5px; border:0; border-radius:4px; cursor:pointer; " (click)="onClick($event)">{{label}}</button>
    </ng-container>
    <ng-container *ngIf="rendererType=='link'">
    <span style="cursor:pointer;color:blue;" (click)="onClick($event)">{{params.value}}</span> 
    </ng-container>
    `
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;
  rendererType:string;
  colorSelected='#007bff'
  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
    this.rendererType = this.params.rendererType || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}