import { Vector2 } from '../vector';
import { CanvasWrapper } from '../canvas-wrapper/canvas-wrapper';
import { VidComponent } from '../vid.component';
import { PositionedAdjust } from './positioned-adjust';

export class TextADjust extends PositionedAdjust {

    readonly type = 'text';
    text: string;
    constructor(text: string, position: Vector2, uuid: number) {
        super(position, uuid);
        this.text = text;
    }

    draw(context: CanvasWrapper, preview: boolean, time: number, vid: VidComponent) {
        const position = this.getCurrentPosition(time, vid);

        context.text(this.text, position);

        super.draw(context, preview, time, vid);
    }
}
