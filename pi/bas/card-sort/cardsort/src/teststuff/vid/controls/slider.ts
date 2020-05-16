import { Control, ControlPoition } from '../control';
import { VidComponent } from '../vid.component';
import { copyStyles } from '@angular/animations/browser/src/util';
import { getMousePos } from '../util';
import { CanvasWrapper } from '../canvas-wrapper/canvas-wrapper';

export class Slider extends Control {

    readonly slider: HTMLInputElement = document.querySelector('#slider');
    position: ControlPoition = 'bottom';
    context: CanvasRenderingContext2D;
    rect: ClientRect;

    clicked = false;
    vidComponent: VidComponent;
    canvasWrapper: CanvasWrapper;
    percent: number;
    constructor() {
        super();
    }
    run(c: VidComponent, elementRef: HTMLElement): void {
        this.vidComponent = c;
        this.canvasWrapper = new CanvasWrapper();
        const slider = this.canvasWrapper.getCanvas();
        // slider.type = 'range';
        // slider.value = '0';
        slider.style.width = '100%';
        slider.style.height = '40px';

        elementRef.appendChild(slider);
        this.rect = this.canvasWrapper.getRect();

        slider.height = 40;
        slider.width = this.rect.width;



        slider.onmousedown = e => {
            this.clicked = true;
        };

        slider.onmousemove = (e) => {
            if (this.clicked) {
                this.calculateFrame(e);
            }
        };
        slider.onmouseup = (e) => {
            this.clicked = false;
            this.calculateFrame(e);
        };
        slider.onmouseleave = e => {
            if (this.clicked) {
                this.clicked = false;
                this.calculateFrame(e);
            }
        };


        this.draw();
    }


    calculateFrame(e) {
        this.percent = this.canvasWrapper.getPercent(e).x;
        const time = this.percent * this.vidComponent.video.duration;
        let startI = Math.round(this.percent * this.vidComponent.vidData.length) - 20;
        startI = Math.max(0, startI);
        for (let i = startI; i < this.vidComponent.vidData.length; i++) {
            const entry = this.vidComponent.vidData[i];
            if (time < entry.time) {
                this.vidComponent.currentEntryIndex = i;
                this.vidComponent.drawCurrent();
                break;
            }
        }
        this.draw();
    }

    drawCurrent() {
        if (this.vidComponent) {
            const currentTime = this.vidComponent.vidData[this.vidComponent.currentEntryIndex].time;
            const newPercent = currentTime / this.vidComponent.video.duration;
            if (this.percent !== newPercent) {
                this.percent = newPercent;
                this.draw();
            }
        }
    }

    draw() {
        this.canvasWrapper.clear();

        this.canvasWrapper.fillAll();

        const start = this.canvasWrapper.height.div(2);
        const lastFrame = this.vidComponent.vidData[this.vidComponent.vidData.length - 1];
        const lastFramePErcent = lastFrame.time / this.vidComponent.video.duration;
        const end = start.add(this.canvasWrapper.width.mult(lastFramePErcent));
        this.canvasWrapper.line(start, end);



        const thumbStart = this.canvasWrapper.width.mult(this.percent);
        const thumbEnd = thumbStart.add(this.canvasWrapper.height);
        this.canvasWrapper.line(thumbStart, thumbEnd);
    }

    frameAdded() {
        if (this.canvasWrapper) {
            this.draw();
        }
    }
}
