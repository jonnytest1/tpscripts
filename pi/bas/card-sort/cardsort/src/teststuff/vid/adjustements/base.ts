import { VidComponent } from '../vid.component';
import { CanvasWrapper } from '../canvas-wrapper/canvas-wrapper';

export abstract class AdjustmentBase {
    protected original;


    referenceId: number;

    abstract type: string;

    fromTime: number;

    toTime: number;

    constructor(referenceId?: number) {
        this.fromTime = null;
        this.toTime = null;
        this.referenceId = referenceId;
    }
    isOriginal() {
        return this.original;
    }

    getStartPercent(vid: VidComponent): number {
        if (this.fromTime == null) {
            return 0.001;
        }
        return this.fromTime / (vid.video.duration);
    }

    getEndPercent(vid: VidComponent): number {
        if (this.toTime == null) {
            return 0.99;
        }
        return this.toTime / (vid.video.duration);
    }

    getTimePercent(time: number, vid: VidComponent) {
        const from = this.fromTime || 0;
        return (time - from) / ((this.toTime || vid.video.duration) - from);
    }
    abstract draw(context: CanvasWrapper, preview: boolean, time: number, id: VidComponent): void;
}
