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
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdminComponent } from './adminComponent/adminComponent.component';
import { StoreModule } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { reducer } from './store/reducer';
import { TestModule } from '../teststuff/test.module';
@NgModule({
   declarations: [
      AppComponent,
      CardTestComponent,
      InnerCardComponent,
      SortComponent,
      AdminComponent
   ],
   imports: [
      TestModule,
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatCardModule,
      MatInputModule,
      DragDropModule,
      MatListModule,
      MatButtonModule,
      StoreModule.forRoot({ root: reducer })
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
