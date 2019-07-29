
/**
 * @typedef RenderedObject
 * @property {{x:number,y:number}} pos
 */
class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
   * @param {RenderedObject} object1
   * @returns {Vector2d}
   */
    add(object1) {
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

}