import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, 
Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[noDoubleClick]'
})
export class NoDoubleClickDirective implements OnInit, OnDestroy {
  
  @Input() 
  debounceTime = 500;

  @Output() 
  click = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.click.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}