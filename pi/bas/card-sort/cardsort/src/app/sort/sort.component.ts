import { Component, OnInit } from '@angular/core';
import { Card } from '../model/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { generateExampleJSon } from '../model/example';

export interface OptionCard extends Card {
  isAddon?: boolean;
}
@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.less']
})

export class SortComponent implements OnInit {


  constructor(private url: ActivatedRoute) {

    for (let i = 0; i < 4; i++) {
      this.json.children.push({
        children: [],
        title: 'level_' + i
      });
      for (let j = 0; j < 2; j++) {
        this.json.children[i].children.push({
          children: [],
          title: i + 'testChild' + j
        });
      }
    }
    // this.updatePath();
  }
  displayItems: Array<Array<OptionCard>> = generateExampleJSon();

  json: Card = {
    title: 'root',
    children: [
      {
        title: 'child1',
        children: []
      }
    ]
  };

  t = [0, 1, 2, 3, 4];

  activeCard: Card;

  leaves: Array<Card>;





  ngOnInit() {

    this.displayItems = this.displayItems.map((items, index) =>
      [...items, { isAddon: true, title: '', children: [], index: 'group_' + index + items.length }]);

  }

  connectedChildLists() {
    const ids = [];
    this.displayItems.forEach(displayItem => {
      displayItem.forEach((item) => {
        ids.push(item.index);
      });
    });
    return ids;
  }

  connectedLists() {
    return this.t.map(i => 'list' + i);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('rop outer', event.previousContainer.id, event.container.id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getId() {
    return Math.random().toString();
  }



  updatePath() {
    this.activeCard = this.json;
    this.url.paramMap.pipe(
      map(params => params.get('json').split('-')),
    ).subscribe(jsonKeys => {
      jsonKeys.forEach(key => {
        // this.activeCard = this.activeCard.children.find(child => child.title === key);
      });
    });

  }

}
