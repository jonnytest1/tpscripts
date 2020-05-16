import { TextADjust } from './adjustements/text-adjust';
import { AdjustmentBase } from './adjustements/base';

export interface Frame {

    time: number
    data: ImageData
    adjustements: Array<AdjustmentBase>

    preRendered?: ImageData

}
