import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {


  clicked: boolean;

  getString(): string {
    if (this.clicked) {
      return 'test';
    }
    return null;
  }

  setWorking() {
    this.clicked = !this.clicked;
  }

  log() {
    console.log('test');
    return 'test'
  }

  constructor() { }

  ngOnInit() {
  }

}
