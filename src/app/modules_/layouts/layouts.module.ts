import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftSiteBarComponent } from './left-site-bar/left-site-bar.component';
import { RightSiteBarComponent } from './right-site-bar/right-site-bar.component';
import { PanelComponent } from './panel/panel.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [HeaderComponent, FooterComponent, LeftSiteBarComponent, RightSiteBarComponent, PanelComponent],
  exports: [HeaderComponent, FooterComponent, LeftSiteBarComponent, RightSiteBarComponent, PanelComponent]
})
export class LayoutsModule { }
