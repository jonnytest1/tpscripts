import { VidComponent } from './vid.component';
import { AdjustmentBase } from './adjustements/base';

export abstract class Control {


    readonly position: ControlPoition;

    abstract run(c: VidComponent, elementRef: HTMLElement): void;

    adjustmentAdded(adjustment: AdjustmentBase): void {

    }

    frameAdded(): void {
    }

    drawCurrent() {

    }

}

export type ControlPoition = 'right' | 'bottom';
