import { C3Component } from './c3.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
      C3Component
    ],
    imports: [
        RouterModule,
    ],
    providers: [],
    bootstrap: [C3Component]
  })
  export class C3Module { }
