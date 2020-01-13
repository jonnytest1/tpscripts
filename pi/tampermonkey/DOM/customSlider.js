/// <reference path="../customTypes/index.d.ts" />
//tslint:disable-next-line variable-name
var CustomSlider = class CustomSliderC {
    /**
     * @typedef SliderOptions
     * @property {number} [scale]
     *  @property {string} [color]
     *  @property {number} [arcWidth]
     * @property {boolean} [skipInit] =false
     * @property {boolean} [skipMouseMove] =false
     * @property {number} [viewRotation]
     * @property {Vector} [positionOffset]
     * @property {(value:number)=>number} [mapping]
     */
    /**
     * @typedef {HTMLElement} Slider
    * */
    /**
     * @typedef {HTMLElement & {
    *  dim?:Dimensions
    *  sliding?:Slider
    *  setRotation?:(angle:number)=>void
    * }} SliderContainer
    *
    /**
     *
     * @param {HTMLElement} parent
     * @param {Vector} position
     * @param {(number)=>void} onMouse number is 0 to 100
     * @param {number} start 0 to 100
     * @param {SliderOptions} options
     */
    constructor(parent, position, onMouse, start, options = {}) {
        this.parent = parent;
        this.position = position;
        this.onMouse = onMouse;
        this.start = start;
        this.positionOffset = options.positionOffset || { x: 0, y: 0 };
        this.viewRotation = options.viewRotation || 0;
        this.mapping = options.mapping;
        this.scale = options.scale || 1;
        this.color = options.color || 'blue';
        this.arcWidth = options.arcWidth || 2;
        this.skipMouseMove = options.skipMouseMove || false;

        this.canvasWidth = 100 * this.scale;
        this.canvasHeight = 50 * this.scale;
        this.canvasRadius = 48 * this.scale;

        /**
         * @type {SliderContainer}
         */
        this.container = this.createContainer();

        this.canvas = this.createArcCanvas();
        this.drawArc();
        this.sliding = this.createSlider();

        if(isNaN(start)) {
            start = 0;
        }
        this.setRotation();
        this.setPercent(start / 100);
        if(this.mapping) {
            this.text = this.createText();
            this.container.appendChild(this.text);
        }

        if(!options.skipInit) {
            if(onMouse) {
                this.setValue(start);
            }
        }

        this.container.appendChild(this.canvas);
        parent.appendChild(this.container);
        this.container.sliding = this.sliding;
    }

    setValue(value) {
        if(this.mapping) {
            value = this.mapping(value);
            this.text.textContent = (value + '').substr(0, 6);
        }
        this.onMouse(value);
    }

    createText() {
        const text = document.createElement('div');
        text.style.position = 'absolute';
        text.style.top = '50%';
        text.style.left = '50%';
        text.style.transform = 'translate(-50%, -50%)';
        return text;
    }

    createContainer() {
        /**@type { SliderContainer } */
        let container = document.createElement('canvascontainer');
        container.style.borderTopLeftRadius = '2000px';
        container.style.borderTopRightRadius = '2000px';
        container.style.position = 'fixed';
        container.style.top = this.position.y + 'px';
        container.style.left = this.position.x + 'px';
        container.dim = { width: this.canvasWidth, height: 50, ...this.position };

        return container;
    }

    createArcCanvas() {
        /**
        * @type {HTMLCanvasElement & { type?:string}}
        */
        let canvas = document.createElement('canvas');
        // object.style.backgroundColor = "rgba(0, 0, 53, 0.29)";
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;

        canvas.style.borderTopLeftRadius = '2000px';
        canvas.style.borderTopRightRadius = '2000px';
        canvas.style.width = canvas.width + 'px';
        canvas.type = 'range';
        if(!this.skipMouseMove) {
            canvas.onmousemove = (ev) => this.onCanvasMove.call(this, ev);
        }
        return canvas;
    }

    onCanvasMove(ev) {
        let direction = { x: this.canvasHeight - ev.offsetX, y: (this.canvasWidth / 2) - ev.offsetY };

        let rotation = Math.atan2(direction.y, direction.x);
        let degrees = (rotation * 180) / Math.PI;
        this._setPosition(degrees);

        if(this.onMouse) {
            this.setValue(Math.round(degrees * 100 / 180));
        }
    }
    drawArc() {
        let context = this.canvas.getContext('2d');
        context.strokeStyle = this.color;
        context.arc(this.canvas.height, this.canvas.width / 2, this.canvasRadius, 0, 2 * Math.PI);
        context.lineWidth = this.arcWidth;
        context.stroke();
    }
    createSlider() {
        /**
        * @type {Slider}
        */
        let sliding = document.createElement('div');
        sliding.style.left = '5px';
        sliding.style.top = '5px';
        sliding.style.borderRadius = '2000px';
        sliding.style.height = '1px';
        sliding.style.width = '1px';
        sliding.style.border = 'solid black 4px';
        sliding.style.position = 'absolute';
        sliding.style.transform = `translate(${((this.canvasWidth / 2) - (3))}px,${(this.canvasHeight - 3)}px)`;
        this.container.appendChild(sliding);

        return sliding;
    }
    _setPosition(angle) {
        angle = 180 + angle;

        let conv = Math.PI / 180;
        let top = (Math.sin(angle * conv) * this.canvasRadius);
        let left = (Math.cos(angle * conv) * this.canvasRadius);// (object.width / 2) +
        this.sliding.style.left = Math.floor(left) + 'px';
        this.sliding.style.top = Math.floor(top) + 'px';
        //console.log("sl:", sliding.style.top, sliding.style.left)
    }

    setPercent(percent) {
        this._setPosition(percent * 180);
    }

    setRotation() {
        let rotationStyle = `rotate(${this.viewRotation}deg)`;
        const offsetX = this.positionOffset.x - (this.container.dim.width / 2);
        const offsetY = this.positionOffset.y - (this.container.dim.height * this.scale / 2);
        const positionStyle = `translate(${offsetX}px,${offsetY}px)`;
        this.container.style.transform = `${positionStyle} ${rotationStyle} translateY(${- this.container.dim.height * this.scale / 2}px)`;

    }

    blink() {
        this.sliding.style.borderColor = this.sliding.style.borderColor === 'white' ? 'black' : 'white';
    }

    remove() {
        this.container.remove();
    }
};

new EvalScript('', {});
