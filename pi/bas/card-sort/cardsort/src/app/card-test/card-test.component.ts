import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../model/card';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OptionCard } from '../sort/sort.component';

@Component({
  selector: 'app-card-test',
  templateUrl: './card-test.component.html',
  styleUrls: ['./card-test.component.less']
})
export class CardTestComponent implements OnInit {


  editTitle: boolean;

  @Input()
  card: OptionCard;

  @Input()
  connected: Array<string>;

  constructor() { }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('innerDrop', event.previousContainer.id, event.container.id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
