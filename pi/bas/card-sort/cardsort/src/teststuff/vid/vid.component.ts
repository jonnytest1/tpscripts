import { Component, OnInit, Type } from '@angular/core';
import { Input, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import { Control } from './control';
import { getContext } from '@angular/core/src/render3/context_discovery';
import { preload } from './preload';
import { Frame } from './frame';
import { PausePlay } from './controls/pauseplay';
import { AddText } from './controls/addText';
import { Slider } from './controls/slider';
import { TextADjust } from './adjustements/text-adjust';
import { AdjustmentBase } from './adjustements/base';
import { AdjustDisplay } from './controls/adjustDisplay';
import { CanvasWrapper } from './canvas-wrapper/canvas-wrapper';
import { AddImage } from './controls/add-image';
import { Build } from './controls/build';

declare const ReactHtml5VideoEditor: any;
@Component({
  selector: 'app-vid',
  templateUrl: './vid.component.html',
  styleUrls: ['./vid.component.css']
})
export class VidComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  rootDomID: string;

  constrols: Array<Control> = [];

  controlMap = new Map<Control, number>();
  rightControls: Array<{ id: number, ctrl: Control }> = [];
  bottomControl: Array<{ id: number, ctrl: Control }> = [];

  canvas: CanvasWrapper;

  vidData: Array<Frame> = [];

  adjustments: Array<AdjustmentBase> = [];


  currentEntryIndex: number;


  video: HTMLVideoElement;
  constructor() { }

  controlIds(ctrl: Control) {
    const id = Math.random() * 100000;
    this.controlMap.set(ctrl, id);
    return { ctrl, id };
  }

  ngOnInit() {
    this.canvas = new CanvasWrapper({
      canvas: document.querySelector('#canvas')
    });
    this.constrols.push(new PausePlay(), new AddText(),
      new Slider(), new AdjustDisplay(), new Build(),
      new AddImage());


    this.rightControls = this.constrols.filter(ctrl => ctrl.position === 'right')
      .map(this.controlIds.bind(this));

    this.bottomControl = this.constrols.filter(ctrl => ctrl.position === 'bottom')
      .map(this.controlIds.bind(this));

    // const loadin = setInterval(() => this.setLloading(Date.now() / 100 % 360), 100);
    preload('/assets/small.mp4', this).then(data => {
      this.canvas.setHeight(data.height);
      this.canvas.setWidth(data.width);
      this.video = data.video;
      this.currentEntryIndex = 1;
      // this.vidData = data.vidData;
      // clearInterval(loadin);
      if (this.vidData.length > 0) {
        this.drawCurrent(this.currentEntryIndex, true);
      }

      [...this.rightControls, ...this.bottomControl].forEach(ctrl => {
        ctrl.ctrl.run(this, document.getElementById('' + this.controlMap.get(ctrl.ctrl)));
      });
    });
  }


  addFrame(frame: Frame) {
    this.vidData.push(frame);
    this.constrols.forEach(ctrl => ctrl.frameAdded());
  }

  addAdjustment(adjustment: AdjustmentBase) {
    // this.vidData[this.currentEntryIndex].adjustements.push(adjustment);
    this.adjustments.push(adjustment);

    this.constrols.forEach(ctrl => ctrl.adjustmentAdded(adjustment));
  }


  click(callback: Function) {
    callback();
  }

  ngOnDestroy(): void {
  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {

  }
  ngAfterViewInit(): void {

  }

  drawCurrent(index?: number, preview: boolean = true, preRender = false) {
    if (index === undefined) {
      index = this.currentEntryIndex;
    }

    const current = this.vidData[index];
    if (current.preRendered) {
      this.canvas.putImageData(current.preRendered);
    } else {

      this.canvas.context.putImageData(current.data, 0, 0);

      for (const adjustment of this.adjustments) {
        if ((adjustment.fromTime == null
          || adjustment.fromTime < current.time)
          && (adjustment.toTime == null
            || adjustment.toTime > current.time)) {
          adjustment.draw(this.canvas, preview, current.time, this);
        }
      }

      for (const control of this.constrols) {
        control.drawCurrent();
      }

      // current.preRendered = this.canvas.getImageData();
    }




  }
}
