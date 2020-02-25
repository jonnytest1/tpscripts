import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardTestComponent } from './card-test/card-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InnerCardComponent } from './inner-card/inner-card.component';
import { MatInputModule } from '@angular/material/input';
import { SortComponent } from './sort/sort.component';

import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
   declarations: [
      AppComponent,
      CardTestComponent,
      InnerCardComponent,
      SortComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatCardModule,
      MatInputModule,
      DragDropModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
