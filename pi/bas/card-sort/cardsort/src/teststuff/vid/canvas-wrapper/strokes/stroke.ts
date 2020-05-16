import { Vector2 } from '../../vector';

export abstract class Stroke {


    attributes: Array<any> = [];


    abstract distance(pos: Vector2): number;
}
