import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule, DatePipe} from "@angular/common";
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { HomeComponent } from './page/home/home.component';
import { TimelineViewerComponent } from './page/timeline-viewer/timeline-viewer.component';
import {HttpClientModule} from "@angular/common/http";
import {
  NgbdDatepickerRangePopupComponent
} from "./component/ngbd-datepicker-range-popup/ngbd-datepicker-range-popup.component";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    TimelineViewerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    NgbModule,
    NgbdDatepickerRangePopupComponent,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
