import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { C1Component } from './c1/c1.component';
import { C2Component } from './c2/c2.component';
import { C3Module } from './c3/c3.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    C1Component,
    C2Component
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    C3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
