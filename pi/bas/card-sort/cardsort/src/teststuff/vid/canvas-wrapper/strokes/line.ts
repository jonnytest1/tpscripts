import { Stroke } from './stroke';
import { Vector2 } from '../../vector';

export class Line extends Stroke {
    pos1: Vector2;
    pos2: Vector2;

    constructor(pos1: Vector2, pos2: Vector2) {
        super();
        this.pos1 = pos1;
        this.pos2 = pos2;
    }

    distance(pos: Vector2): number {
        const pos1ToPoint = pos.sub(this.pos1);
        const pos2ToPos1 = this.pos2.sub(this.pos1);

        const dotProduct = pos1ToPoint.dot(pos2ToPos1);
        const lenSqr = pos2ToPos1.lengthSqr();
        let param = -1;
        if (lenSqr !== 0) {
            param = dotProduct / lenSqr;
        }


        let closestPosition;
        if (param < 0) {
            closestPosition = this.pos1;
        } else if (param > 1) {
            closestPosition = this.pos2;
        } else {
            closestPosition = this.pos1.add(pos2ToPos1.mult(param));
        }


        // console.log(this.pos1, this.pos2, result);
        return pos.sub(closestPosition).magnitude();
    }

}
