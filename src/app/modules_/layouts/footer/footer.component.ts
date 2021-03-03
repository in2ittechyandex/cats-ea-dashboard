import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cats-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public footerCopyrights = '';
  public footerPoweredBy = '';
  constructor() { 
    this.footerCopyrights =  environment.envConfig['footer_Copyrights']? environment.envConfig['footer_Copyrights']:'';
    this.footerPoweredBy =  environment.envConfig['footer_poweredBy']? environment.envConfig['footer_poweredBy']:'';
  }

  ngOnInit() {
  }

}
