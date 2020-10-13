import { Observable, Subscription, fromEvent } from 'rxjs';
import { Directive, ElementRef, OnInit, Output, EventEmitter, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';

/**
 * This Directives will detect click outside of an element.
 */

@Directive({
    selector: '[click-outside]'
})
export class ClickOutSideDirectives implements OnInit, OnDestroy, OnChanges {

    private globalClick: Observable<Event>;
    private click$: Subscription = null;

    @Input() Ident: any;
    @Input() listening: Boolean = false;

    constructor(private elRef_: ElementRef) {
        this.listening = false;
    }

    @Output()
    public clickOutSide = new EventEmitter();

    ngOnInit() {
        this.globalClick = fromEvent(document, 'click');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.listening) {
            let sts = (changes.listening['currentValue'] && (!changes.listening['firstChange']));
            if (sts) {
                this.click$ = this.globalClick.subscribe((event: MouseEvent) => {
                    this.onGlobalClick(event);
                })
            } else {
                if (this.click$ != null) {
                    this.click$.unsubscribe();
                    this.click$ = null;
                }
            }

        }
    }

    ngOnDestroy() {
        if (this.click$ != null) {
            this.click$.unsubscribe();
            this.click$ = null;
        }
    }

    onGlobalClick(event: MouseEvent) {
        if (event instanceof MouseEvent && this.listening === true) {
            if (this.isDescendant(this.elRef_.nativeElement, event.target) === true) {

            } else {
                let element: Element = (event.target as Element);
                let isSameElement_ = (element && element.id) ? (element.id == this.Ident) : false;
                if (!isSameElement_) {
                    this.clickOutSide.emit({
                        'target': (event.target || null),
                        'value': true,
                        'isOutSide': true,
                        'Identifier': this.Ident,
                        'listening': this.listening
                    });
                } else {
                }
            }
        }
    }

    isDescendant(parent: Element, child) {
        let node = child;
        while (node !== null) {
            if (node === parent) {
                return true;
            } else {
                node = node.parentNode;
            }
        }
        return false;
    }

}