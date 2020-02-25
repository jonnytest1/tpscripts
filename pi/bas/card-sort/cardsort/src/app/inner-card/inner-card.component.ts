import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-inner-card',
  templateUrl: './inner-card.component.html',
  styleUrls: ['./inner-card.component.less']
})
export class InnerCardComponent implements OnInit {

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
  }

}
