class Vector2 {
	/**
	 *
	 * @param {MouseEvent|number} x
	 * @param {number} [y]
	 */
    constructor(x, y) {
        if(x instanceof MouseEvent) {
            this.y = x.offsetY;
            this.x = x.offsetX;
        } else {

            this.x = x;
            this.y = y;
        }
    }
	/**
	 *
	 * @param {Vector2} direction
	 */
    added(direction) {
        return new Vector2(this.x + direction.x, this.y + direction.y);
    }
	/**
	 *
	 * @param {Vector2} direction
	 */
    minus(direction) {
        return new Vector2(this.x - direction.x, this.y - direction.y);
    }

    magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    divided(divisor) {
        return new Vector2(this.x / divisor, this.y / divisor);
    }

}