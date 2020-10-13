
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cats-auth',
  template: `<router-outlet></router-outlet>`,
})
export class AuthComponent implements OnInit {

  constructor( private titleService: Title
  ) {
    const title = 'CATS-EA';
    this.titleService.setTitle(title);
   }

  ngOnInit() {

  }
}
