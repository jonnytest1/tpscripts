import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { C1Component } from './c1/c1.component';
import { C2Component } from './c2/c2.component';
import { C3Component } from './c3/c3.component';

const routes: Routes = [
  {
  path: '',
  pathMatch: 'prefix',
  redirectTo: 'c1'
} ,
  {
    path: 'c1',
    component: C1Component,

  },
  {
    path: 'c2', component: C2Component
  }, {
path: 'c3',
component: C3Component

  }


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
