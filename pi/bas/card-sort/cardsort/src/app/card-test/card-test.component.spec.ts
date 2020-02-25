/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardTestComponent } from './card-test.component';

describe('CardTestComponent', () => {
  let component: CardTestComponent;
  let fixture: ComponentFixture<CardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
