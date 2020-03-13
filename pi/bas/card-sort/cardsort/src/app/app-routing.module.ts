import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardTestComponent } from './card-test/card-test.component';
import { SortComponent } from './sort/sort.component';
import { AdminComponent } from './adminComponent/adminComponent.component';

const routes: Routes = [
  {
    path: 'card-test',
    component: CardTestComponent
  },

  /* {
     path: 'sort/:json',
     component: SortComponent
   },
      {
       path: '',
       pathMatch: 'full',
       redirectTo: 'sort/root-child1'
     }, */
  {
    path: '',
    component: SortComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }