import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: "data-render",
    template: `
    <a (click)="invokeParentMethod($event); "style="cursor: pointer;" class="btn btn-xs btn-green width-70 m-r-2" style="color:#fff;"><i class="fa fa-times-circle"></i> Remove</a>
    `,
    styles: []
})
export class DataRenderedComponent implements ICellRendererAngularComp , OnDestroy{
    private params: any;
 

    agInit(params: any): void {
        this.params = params;
     }
    public invokeParentMethod(event) {
        // this.params.context.componentParent.methodFromParent(this.params.data);
        this.params.context.componentParent.methodFromParent(this.params.data);
        // console.log(this.params.value);
        // console.log(event);
        return false;
    }
    // demonstrates how you can do "inline" editing of a cell
    onChange(checked: boolean) {
      
        // this.params.context.componentParent.methodFromParent(this.params.data,this.checked);
       
        
    }

    refresh(params: any): boolean {
        return false;
    }

    ngOnDestroy(){
       
    }
}