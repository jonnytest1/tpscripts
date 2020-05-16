

interface CustomVEctor {
    x: number; y: number;
}
function isCustomVector(obj): obj is CustomVEctor {
    return typeof obj !== 'number' && 'x' in obj && 'y' in obj;
}

export class Vector2 {


    constructor(x: number | MouseEvent | CustomVEctor, y?: number) {
        if (x instanceof MouseEvent) {
            this.y = x.offsetY;
            this.x = x.offsetX;
        } else if (isCustomVector(x)) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    static ZERO = new Vector2(0, 0);

    readonly x: number;
    readonly y: number;
    limit(arg0: Vector2): Vector2 {
        return new Vector2(Math.min(this.x, arg0.x), Math.min(this.y, arg0.y));
    }

    round(): Vector2 {
        return new Vector2(Math.round(this.x - 0.5), Math.round(this.y - 0.5));
    }

    add(direction: Vector2) {
        return new Vector2(this.x + direction.x, this.y + direction.y);
    }

    addX(x: number): Vector2 {
        return new Vector2(this.x + x, this.y);
    }

    sub(direction: Vector2) {
        return new Vector2(this.x - direction.x, this.y - direction.y);
    }

    magnitude() {
        return Math.sqrt(this.lengthSqr());
    }

    div(divisor: number | Vector2) {
        if (divisor instanceof Vector2) {
            return new Vector2(this.x / divisor.x, this.y / divisor.y);
        }
        return new Vector2(this.x / divisor, this.y / divisor);
    }

    mult(multiplicator: number) {
        return new Vector2(this.x * multiplicator, this.y * multiplicator);
    }


    dot(vector2: Vector2) {
        return this.x * vector2.x + this.y * vector2.y;
    }

    lengthSqr() {
        return (this.x * this.x) + (this.y * this.y);
    }

}
