import { Vector2 } from '../vector';
import { getMousePos } from '../util';
import { Stroke } from './strokes/stroke';
import { Line } from './strokes/line';


export interface CustomMouseEvent extends MouseEvent {
    strokes?: Array<{ distance: number, stroke: Stroke }>;

    startEvent?: CustomMouseEvent;
    movement?: Vector2;

    position?: Vector2;
}
export interface CanvasOptions {
    canvas?: HTMLCanvasElement;
    width?: number | string;
    height?: number | string;

    defaultBackground?: string;

    parent?: HTMLElement;

    click?: (e: CustomMouseEvent) => void;

    mousemove?: (e: CustomMouseEvent) => void;
    mouseleave?: (e: CustomMouseEvent) => void;

    source?: HTMLImageElement | HTMLVideoElement;
}

export class CanvasWrapper {


    strokes: Array<Stroke> = [];

    options: CanvasOptions;


    canvas: HTMLCanvasElement;
    _context: CanvasRenderingContext2D;

    constructor(options: CanvasOptions = {}) {
        if (!options.canvas) {
            options.canvas = document.createElement('canvas');
        }
        this.options = options;
        if (options.source) {
            options.height = options.source.height;
            options.width = options.source.width;
        }
        this.canvas = options.canvas;
        if (options.height !== undefined) {
            if (typeof options.height === 'number') {
                this.canvas.style.height = options.height + 'px';
            } else {
                this.canvas.style.height = options.height;
            }
        }

        if (options.width !== undefined) {
            if (typeof options.width === 'number') {
                this.canvas.style.width = options.width + 'px';
            } else {
                this.canvas.style.width = options.width;
            }
        }

        this._context = this.canvas.getContext('2d');

        if (options.parent) {
            options.parent.appendChild(this.canvas);
        }


        const rect = this.getRect();
        this.canvas.height = rect.height;
        this.canvas.width = rect.width;

        if (options.click) {
            let mouseDownEvent;
            /* this.canvas.onclick = e => {
                 if (this.options.click) {
                     this.addStrokesToEvent(e);
                     this.options.click(e);
                 }
             };*/
            this.canvas.onmousedown = e => {
                mouseDownEvent = e;
                this.addStrokesToEvent(mouseDownEvent);
            };

            this.canvas.onmouseup = (e: CustomMouseEvent) => {
                if (this.options.click) {
                    e.startEvent = mouseDownEvent;
                    e.movement = getMousePos(e).sub(getMousePos(mouseDownEvent));
                    this.addStrokesToEvent(e);
                    this.options.click(e);
                }
                mouseDownEvent = undefined;
            };

        }

        if (options.mousemove) {
            this.canvas.onmousemove = e => {
                if (this.options.mousemove) {
                    this.addStrokesToEvent(e);
                    this.options.mousemove(e);
                }
            };
        }

        if (options.mouseleave) {
            this.canvas.onmouseleave = (e: CustomMouseEvent) => {
                if (this.options.mouseleave) {
                    this.addStrokesToEvent(e);
                    this.options.mouseleave(e);
                }
            };
        }
        this.clear();
    }

    getImageData(from?: Vector2, to?: Vector2) {
        if (!from) {
            from = Vector2.ZERO;
        }
        if (!to) {
            to = this.rect;
        }
        const newLocal = to.sub(from);
        return this.context.getImageData(from.x, from.y, newLocal.x, newLocal.y);
    }

    putImageData(imageData: ImageData, pos?: Vector2) {
        if (!pos) {
            pos = Vector2.ZERO;
        }
        this.context.putImageData(imageData, pos.x, pos.y);
    }


    setHeight(height: number) {
        this.canvas.height = height;
        this.canvas.style.height = height + 'px';
    }


    setWidth(width: number) {
        this.canvas.width = width;
        this.canvas.style.width = width + 'px';
    }

    addStrokesToEvent(e: CustomMouseEvent) {
        const pos = getMousePos(e);
        const strokes = this.strokes
            .map(stroke => ({ stroke, distance: stroke.distance(pos) }))
            .sort((a, b) => a.distance - b.distance);
        e.strokes = strokes;
        e.position = pos;
    }


    getPercent(e: MouseEvent) {
        const mouse = getMousePos(e);
        return mouse.div(this.rect);
    }

    get rect() {
        const rect = this.getRect();
        if (rect.width === 0 && rect.height === 0) {
            return new Vector2(+this.options.width, +this.options.height);
        }
        return new Vector2(rect.width, rect.height);
    }

    getRect() {
        return this.canvas.getBoundingClientRect();
    }

    getCanvas() {
        return this.canvas;
    }

    get context() {
        return this._context;
    }

    line(pos1: Vector2, pos2: Vector2, options: { width?: number, color?: string, attributes?: Array<any> } = {}): Line {
        this._context.beginPath();
        this._context.moveTo(pos1.x, pos1.y);
        this._context.lineWidth = options.width || 1;
        this._context.strokeStyle = options.color || 'red';
        this._context.lineTo(pos2.x, pos2.y);
        this._context.stroke();
        const line = new Line(pos1, pos2);
        if (options.attributes) {
            line.attributes.push(...options.attributes);
        }
        this.strokes.push(line);
        return line;
    }

    text(text: string, start: Vector2, options: { color?: string, fontSize?: number } = {}) {
        // this.context.lineWidth = options.width || 1;
        // this.context.strokeStyle = options.color || 'red';
        // this.context.beginPath();
        this._context.strokeStyle = options.color || 'black';
        this._context.lineWidth = options.fontSize || 6;
        this._context.fillStyle = options.color || 'black';
        this._context.font = `${options.fontSize || 12}px Arial`;
        this._context.fillText(text, start.x, start.y);
        // this.context.stroke();
    }
    box(topLeft: Vector2, bottomRight: Vector2, options: { width?: number, color?: string } = {}) {
        this._context.beginPath();
        this._context.lineWidth = options.width || 2;
        this._context.strokeStyle = options.color || 'red';
        const wH = bottomRight.sub(topLeft);
        this._context.rect(topLeft.x, topLeft.y, wH.x, wH.y);
        this._context.stroke();
        // const line = new Line(pos1, pos2);
        // this.strokes.push(line);
        // return line;
    }

    clear() {
        this.strokes.length = 0;
        const rect = this.canvas.getBoundingClientRect();
        this._context.clearRect(0, 0, rect.width, rect.height);
        if (this.options.defaultBackground) {
            this.fillAll({ color: this.options.defaultBackground });
        }
    }

    fillAll(options: { color?: string } = {}) {
        const rect = this.canvas.getBoundingClientRect();
        this._context.beginPath();
        this._context.rect(0, 0, rect.width, rect.height);
        this._context.fillStyle = options.color || 'grey';
        this._context.fill();
    }

    get height() {
        const rect = this.canvas.getBoundingClientRect();
        return new Vector2(0, rect.height);
    }

    get width() {
        const rect = this.canvas.getBoundingClientRect();
        return new Vector2(rect.width, 0);
    }
}
