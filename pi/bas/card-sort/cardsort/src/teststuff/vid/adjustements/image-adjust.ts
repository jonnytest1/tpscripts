import { Vector2 } from '../vector';
import { CanvasWrapper } from '../canvas-wrapper/canvas-wrapper';
import { VidComponent } from '../vid.component';
import { PositionedAdjust } from './positioned-adjust';
import { ImageUtil } from '../canvas-wrapper/image-util';


export class ImageAdjust extends PositionedAdjust {


    readonly type = 'text';
    data: ImageData;

    constructor(text: ImageData, position: Vector2, uuid: number) {
        super(position, uuid);
        this.data = text;
    }

    draw(context: CanvasWrapper, preview: boolean, time: number, vid: VidComponent) {
        const position = this.getCurrentPosition(time, vid);



        new ImageUtil(context).addImage(this.data, position);
        // context.text(this.data, position);
        super.draw(context, preview, time, vid);
    }
}
