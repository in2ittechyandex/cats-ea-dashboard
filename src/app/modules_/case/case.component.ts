import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cats-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {

  constructor() { 
  
  }

  showDDNMS(event) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      //obj_['isListenOnBlur'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

 

  ngOnInit() {
    
  }

}
