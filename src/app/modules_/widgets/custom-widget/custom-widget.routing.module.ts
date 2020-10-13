
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomWidgetComponent } from './custom-widget/custom-widget.component';


const routes: Routes = [
    {
        path: '', component: CustomWidgetComponent
    }

];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})


export class CustomWidgetRoutingModule { }
