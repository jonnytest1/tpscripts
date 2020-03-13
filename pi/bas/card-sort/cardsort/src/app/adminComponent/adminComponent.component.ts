import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducer';
import { Observable } from 'rxjs';
import { Leaf } from '../model/leaf';
import { addLeaf } from '../store/actions';
import { map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-adminComponent',
  templateUrl: './adminComponent.component.html',
  styleUrls: ['./adminComponent.component.css']
})
export class AdminComponent implements OnInit {

  $leafs: Observable<Array<Leaf>>;
  constructor(private store: Store<{ root: State }>) {
    this.$leafs = store.select(s => s.root.leafs).pipe(tap(console.log));
  }

  ngOnInit() {
  }


  addLeaf(leafInput: HTMLInputElement) {
    this.store.dispatch(addLeaf({ leaf: { name: leafInput.value } }));
  }
}
