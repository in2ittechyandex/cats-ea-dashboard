import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-contextmenu',
    templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextmenuComponent {

    constructor() { }
    @Input() x = 0;
    @Input() y = 0;
    @Input() menuitems = [];
    theMenuItems = [];
    @Output() menuItemSelected = new EventEmitter();

    ngOnInit() {
        // Build the menu items
        this.theMenuItems = this.menuitems;//.split(';');
    }

    outputSelectedMenuItem( menuitem: string) {
        this.menuItemSelected.emit(menuitem);
    }

}