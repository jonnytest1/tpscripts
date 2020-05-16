import { AdjustmentBase } from './base';
import { Vector2 } from '../vector';
import { VidComponent } from '../vid.component';
import { CanvasWrapper } from '../canvas-wrapper/canvas-wrapper';

export abstract class PositionedAdjust extends AdjustmentBase {
    pos: Vector2;
    direction?: Vector2 = Vector2.ZERO;


    constructor(position: Vector2, uuid: number) {
        super(uuid);
        this.pos = position;
    }


    getCurrentPosition(time: number, vid: VidComponent) {
        const percent = this.getTimePercent(time, vid);
        return this.pos.add(this.direction.mult(percent));
    }

    protected drawDebugLine(context: CanvasWrapper, preview: boolean) {
        if (preview && this.direction.magnitude()) {
            const finish = this.pos.add(this.direction);
            context.line(this.pos, finish, {
                color: 'red',
                width: 1
            });
        }
    }

    draw(context: CanvasWrapper, preview: boolean, time: number, vid: VidComponent) {
        this.drawDebugLine(context, preview);
    }
}
