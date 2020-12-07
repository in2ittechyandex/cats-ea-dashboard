import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: "checkbox-cell",
    template: `
    <i class="fa fa-cog fa-2x text-grey-lighter" aria-hidden="true"  (click)="alarmSelected()" *ngIf="!isSelected"></i>
    <i class="fa fa-cog fa-2x text-blue-lighter" aria-hidden="true"  (click)="alarmSelected()" *ngIf="isSelected"></i>
    <i class="ion ion-md-alert fa-2x fa-fw text-red-lighter"></i>
       `,
    styles: []
})
export class MatCheckboxComponent implements ICellRendererAngularComp , OnDestroy {
    private params: any;
    severity = "MAJOR";
    isSelected:boolean=false;
    agInit(params: any): void {
        this.params = params;
        this.severity = this.params.value;

    }
    alarmSelected(){
        this.isSelected=!this.isSelected;
        this.params.context.componentParent.alarmSelected(this.params.node.data);
    }
    public invokeParentMethod() {
        this.params.context.componentParent.methodFromParent();
    }
    // demonstrates how you can do "inline" editing of a cell
    onChange(checked: boolean) {

        // this.params.context.componentParent.methodFromParent(this.params.data,this.checked);


    }

    refresh(params: any): boolean {
        return false;
    }

    ngOnDestroy() {

    }
}
