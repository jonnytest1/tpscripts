
/**
 * @typedef RenderedObject
 * @property {{x:number,y:number}} pos
 */
var Vector2d = class Vector2d {
    constructor(x, y) {
        if(x instanceof Vector2d) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;

        }
        if(window['debug']) {
            const point = document.createElement('div');
            point.style.width = point.style.height = '2px';
            point.style.position = 'fixed';
            point.style.top = this.y + 'px';
            point.style.left = this.x + 'px';
            point.style.backgroundColor = 'red';
            document.body.appendChild(point);
        }
        this.length = this.getLength();
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     *
     * @param {number} length
     * @returns {Vector2d}
     */
    withMagnitude(length) {
        const x = (this.x / this.length) * length;
        const y = (this.y / this.length) * length;
        return new Vector2d(x, y);
    }
    /**
      * @param {number} angle
      * @returns {Vector2d}
      */
    rotated(angle) {
        //turning TO radians
        angle *= Math.PI / 180;
        const x = this.x;
        const y = this.y;
        const newX = (Math.cos(angle) * x) - (Math.sin(angle) * y);
        const newY = (Math.sin(angle) * x) + (Math.cos(angle) * y);
        return new Vector2d(newX, newY).withMagnitude(this.length);
    }

    /**
   * @param {RenderedObject|Vector2d} object1
   * @returns {Vector2d}
   */
    add(object1) {
        if(object1 instanceof Vector2d) {
            return new Vector2d(
                this.x + object1.x,
                this.y + object1.y
            );
        }
        return new Vector2d(
            this.x + object1.pos.x,
            this.y + object1.pos.y
        );
    }

    /**
     * @param {RenderedObject} object1
     * @param {RenderedObject} objectb
     * @returns {Vector2d}
     */
    static sub(object1, objectb) {
        return new Vector2d(
            objectb.pos.x - object1.pos.x,
            objectb.pos.y - object1.pos.y
        );
    }

};