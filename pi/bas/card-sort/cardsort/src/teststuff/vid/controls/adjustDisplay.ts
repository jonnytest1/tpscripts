import { Control, ControlPoition } from '../control';
import { VidComponent } from '../vid.component';
import { CanvasWrapper, CustomMouseEvent } from '../canvas-wrapper/canvas-wrapper';
import { AdjustmentBase } from '../adjustements/base';
import { Vector2 } from '../vector';
import { Stroke } from '../canvas-wrapper/strokes/stroke';
import { TextADjust } from '../adjustements/text-adjust';
import { elementEnd } from '@angular/core/src/render3';

export class AdjustDisplay extends Control {
    position: ControlPoition = 'bottom';
    vidComponent: VidComponent;
    canvasWrapper: CanvasWrapper;
    elementRef: HTMLElement;

    adjustmentMap = new Map<Stroke, AdjustmentBase>();

    height = 40;

    selected: AdjustmentBase;

    lastDraw = -1;

    highlighted: { pos: string, adjustment: AdjustmentBase };
    run(c: VidComponent, elementRef: HTMLElement): void {
        this.vidComponent = c;
        this.elementRef = elementRef;

        elementRef.style.overflowY = 'scroll';
        elementRef.style.position = 'absolute';

        elementRef.style.top = '40px';
        elementRef.style.bottom = '0px';
        elementRef.style.right = '0px';
        elementRef.style.left = '0px';

        this.canvasWrapper = new CanvasWrapper({
            width: '100%',
            height: this.height * this.vidComponent.adjustments.length,
            defaultBackground: 'grey',
            parent: this.elementRef,
            click: this.onclick.bind(this),
            mousemove: this.onMouseMove.bind(this),
            mouseleave: () => {
                this.highlighted = undefined;
                this.draw();
            }
        });
        this.adjustmentAdded();
    }


    draw() {
        this.lastDraw = Date.now();
        this.canvasWrapper.clear();

        this.vidComponent.adjustments.forEach((adjustment: AdjustmentBase, index: number) => {
            const isHighlighted = this.highlighted && this.highlighted.adjustment === adjustment;
            const isSelected = this.selected === adjustment;

            const start = new Vector2(0, this.height * index);
            const elementHeight = new Vector2(0, this.height);
            const halfElementHeight = elementHeight.div(2);

            if (adjustment instanceof TextADjust) {
                this.canvasWrapper.text(adjustment.text, start.add(new Vector2(16, 12)), {
                    fontSize: 12
                });
            }

            const adjustmentStart = start.add(this.canvasWrapper.width.mult(adjustment.getStartPercent(this.vidComponent)));
            const adjustmentStartEnd = adjustmentStart.add(elementHeight);

            const isStartHighlight = isHighlighted && this.highlighted.pos === 'start';
            this.adjustmentMap.set(
                this.canvasWrapper.line(adjustmentStart, adjustmentStartEnd, {
                    width: isStartHighlight ? 4 : 3,
                    color: isStartHighlight ? 'red' : 'green',
                    attributes: [adjustment, 'start']
                }),
                adjustment,

            );

            const adjustmentEnd = start.add(this.canvasWrapper.width.mult(adjustment.getEndPercent(this.vidComponent)));
            const adjustmentEndEnd = adjustmentEnd.add(elementHeight);

            const isEndHighlight = isHighlighted && this.highlighted.pos === 'end';
            this.adjustmentMap.set(
                this.canvasWrapper.line(
                    adjustmentEnd,
                    adjustmentEndEnd, {
                    width: isEndHighlight ? 4 : 3,
                    color: isEndHighlight ? 'red' : 'green',
                    attributes: [adjustment, 'end']
                }),
                adjustment
            );

            const connectionSTart = adjustmentStart.add(halfElementHeight);
            const connectionEnd = adjustmentEnd.add(halfElementHeight);

            this.adjustmentMap.set(
                this.canvasWrapper.line(connectionSTart, connectionEnd, {
                    color: 'green',
                    attributes: [adjustment, 'connection']
                }),
                adjustment,
            );

            if (isSelected) {
                const end = start.add(elementHeight).addX(this.canvasWrapper.rect.x);
                this.canvasWrapper.box(start, end, {
                    color: 'orange',
                    width: 2
                });
            }
        });
    }



    adjustmentAdded() {
        this.canvasWrapper.setHeight(this.height * this.vidComponent.adjustments.length);

        this.draw();
    }

    onMouseMove(e: CustomMouseEvent) {
        let hasHighlight = false;
        for (const stroke of e.strokes) {
            if (stroke.stroke.attributes.includes('connection')) {
                continue;
            }
            const newhighlighted = stroke.stroke.attributes.find(att => att instanceof AdjustmentBase);
            if (e.buttons > 0 && this.highlighted && newhighlighted && this.highlighted) {
                hasHighlight = true;
                if (newhighlighted && this.highlighted && this.highlighted.adjustment === newhighlighted) {
                    const newPercent = e.position.div(this.canvasWrapper.rect).x;
                    if (this.highlighted.pos === 'end') {
                        this.highlighted.adjustment.toTime = this.vidComponent.video.duration * newPercent;
                        this.vidComponent.drawCurrent();
                    } else if (this.highlighted.pos === 'start') {
                        this.highlighted.adjustment.fromTime = this.vidComponent.video.duration * newPercent;
                        this.vidComponent.drawCurrent();
                    }
                    // if (this.lastDraw < Date.now() - 800) {
                    this.draw();
                    // }
                    this.vidComponent.drawCurrent();
                }
            } else if (stroke.distance < 20) {
                hasHighlight = true;
                if (newhighlighted !== this.highlighted) {
                    const position = stroke.stroke.attributes.find(att => typeof att === 'string');
                    console.log(newhighlighted.text, position, stroke.distance, e.strokes);
                    this.highlighted = { adjustment: newhighlighted, pos: position };
                    this.draw();
                }
                break;
            }
        }

        if (!hasHighlight && this.highlighted && e.buttons === 0) {
            console.log('unhighlight');
            this.highlighted = undefined;
            this.draw();
        }
    }

    onclick(e: CustomMouseEvent) {
        if (e.strokes && e.strokes.length) {
            const newSelected = this.adjustmentMap.get(e.strokes[0].stroke);
            if (newSelected !== this.selected) {
                this.selected = newSelected;
                this.draw();
            } else {
                this.selected = undefined;
                this.draw();
            }
        }
    }

}
