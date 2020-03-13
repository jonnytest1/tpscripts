import { Component, OnInit } from '@angular/core';
import { Card } from '../model/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { generateExampleJSon } from '../model/example';
import { leave } from '@angular/core/src/profile/wtf_impl';

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
    // this.updatePath();
  }
  displayItems: Array<Array<OptionCard>> = [[], [], [], [], []]; // generateExampleJSon();

  t = [0, 1, 2, 3, 4];

  leaves: Array<Card>;

  connectedChildLists: Array<string>;
  connectedLists: Array<string>;
  getLeafChildren(): Array<OptionCard> {
    const leaves: Array<OptionCard> = [];
    for (let i = 0; i < 20; i++) {
      leaves.push({
        title: 'leaf' + i,
        children: [],
        index: 'leaf' + i
      });
    }
    return leaves;
  }


  getLeavesRecursive(node): Array<OptionCard> {
    if (node.children.length === 0) {
      return [node];
    }
    let leaves = [];
    for (const child of node.children) {
      leaves = [...leaves, ...this.getLeavesRecursive(child)];
    }
    return leaves;
  }

  ngOnInit() {

    this.displayItems = this.displayItems.map((items, index) =>
      [...items, { isAddon: true, title: '', children: [], index: 'group_' + index + items.length }]);
    this.leaves = this.getLeafChildren();

    this.connectedChildLists = this.getConnectedChildLists();
    this.connectedLists = this.getConnectedLists();

    console.log(this.connectedLists, this.connectedChildLists);
  }

  getConnectedChildLists() {
    const ids = [];
    this.displayItems.forEach(displayItem => {
      displayItem.forEach((item) => {
        ids.push(item.index);
      });
    });
    ids.push('leavesPicker');
    return ids;
  }

  getContainer(card: OptionCard, index: string): OptionCard {
    if (card.children.some(child => child.index === index)) {
      return card;
    }
    for (const child of card.children) {
      const indexCard = this.getContainer(child, index);
      if (indexCard) {
        return indexCard;
      }
    }
    return null;
  }

  updateAddons(item: OptionCard) {
    for (const i of this.t) {
      const view = this.displayItems[i];
      for (const card of view) {
        const parentCard = this.getContainer(card, item.index);
        if (parentCard) {
          if (parentCard.isAddon) {
            parentCard.isAddon = false;
            const newIndex = 'group_' + i + view.length;
            view.push({ isAddon: true, title: '', children: [], index: newIndex });
            this.connectedChildLists.push(newIndex);
            console.log(this.connectedChildLists);
          }
        }
      }
    }
  }

  dropped(item: OptionCard) {
    if (!item) {
      return;
    }
    this.updateAddons(item);
    this.displayItems.forEach(columun => {
      for (let i = 0; i < columun.length; i++) {
        if (columun[i].isAddon && i !== columun.length - 1) {
          const addon = columun.splice(i, 1)[0];
          columun.push(addon);
        }

      }
    });


    console.log(this.displayItems);
  }
  getConnectedLists() {
    return this.t.map(i => 'list' + i);
  }

  drop(event: CdkDragDrop<OptionCard[], OptionCard[]>) {
    console.log('rop outer', event.previousContainer.id, event.container.id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.dropped(event.item.data);

  }

  getId() {
    return Math.random().toString();
  }



  updatePath() {
    this.url.paramMap.pipe(
      map(params => params.get('json').split('-')),
    ).subscribe(jsonKeys => {
      jsonKeys.forEach(key => {
        // this.activeCard = this.activeCard.children.find(child => child.title === key);
      });
    });

  }

}
