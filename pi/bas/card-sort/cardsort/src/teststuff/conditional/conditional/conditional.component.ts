import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-conditional',
  templateUrl: './conditional.component.html',
  styleUrls: ['./conditional.component.css']
})
export class ConditionalComponent implements OnInit {

  @ContentChild(TemplateRef) detailRef;


  @Input()
  condition: boolean;

  @Input()
  height: number;

  constructor() { }

  ngOnInit() {
  }

}
