import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: "checkbox-cell",
    template: `
    <i class="fa fa-cog fa-2x text-grey f-s-15 check_icon" aria-hidden="true" (click)="alarmSelected()" *ngIf="!isSelected" style="top:1px; left:-3px;"></i>
    <i class="fa fa-cog fa-2x text-blue-lighter f-s-15 check_icon" aria-hidden="true" (click)="alarmSelected()" *ngIf="isSelected" style="top:1px; left:-3px;"></i>
    <a (click)="invokeParentMethod();" (contextmenu)="onRightClick($event)" [style.background-color]="colorSelected" style="color:#ffffff;padding:2px 7px; border-radius:5px;cursor:pointer;" >Act</a>
   `,
    styles: []
})
export class MatCheckboxComponent implements ICellRendererAngularComp , OnDestroy {
    private params: any;
    severity="MAJOR";
    severityList = [{ name: 'ERROR', color: '#ff9494' },
      { name: 'MINOR', color: '#FFF633' },
      { name: 'Indeterminate', color: '#8E44AD' },
      { name: 'CRITICAL', color: '#FF4933' },
      { name: 'MAJOR', color: '#FFCA33' },
      { name: 'ALERT', color: '#a64452' },
      { name: 'DEBUG', color: '#bada55' },
      { name: 'WARNING', color: '#33D4FF' },
      { name: 'INFO', color: '#5ac8fa' },
      { name: 'NOTICE', color: '#ff0000' },
      { name: 'CLEAR', color: '#27AE60' }]
    colorSelected='grey'
    isSelected:boolean=false;
        agInit(params: any): void {
            this.params = params;
            this.severity=this.params.value;
            if(this.severity!=""&&this.severity!=null&&this.severity!=undefined){
            for(var i=0;i<this.severityList.length;i++){
                if(this.severityList[i].name.toUpperCase()===this.severity.toUpperCase()){
                    this.colorSelected=this.severityList[i].color;
                    break;
                }
            }}
            
        }
        public invokeParentMethod() {
            this.params.context.componentParent.methodFromParent(this.params.data,this.severity);
        }
        onRightClick(event){
            
            this.params.context.componentParent.onRightClick(event,this.params.data);
        }
        // demonstrates how you can do "inline" editing of a cell
        onChange(checked: boolean) {
          
            // this.params.context.componentParent.methodFromParent(this.params.data,this.checked);
           
            
        }
    alarmSelected(){
        this.params.context.componentParent.alarmSelected(this.params.node.data);
        
        this.isSelected=!this.isSelected;
    }
     

    refresh(params: any): boolean {
        return false;
    }

    ngOnDestroy() {

    }
}
