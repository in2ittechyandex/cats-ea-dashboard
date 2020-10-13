import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: "checkbox-cell",
    template: `
    <i class="ion ion-md-alert fa-2x fa-fw pull-left m-r-10 text-red-lighter"></i>
       `,
    styles: []
})
export class MatCheckboxComponent implements ICellRendererAngularComp , OnDestroy {
    private params: any;
    severity = "MAJOR";
    agInit(params: any): void {
        this.params = params;
        this.severity = this.params.value;

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
