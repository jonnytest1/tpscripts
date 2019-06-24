import { Vector } from 'p5';

interface p5a {
    await: Function,
    ln: (start: Vector, end: Vector) => HTMLElement
    tr: (pos1: Vector, pos2: Vector, pos3: Vector) => void
    crcl: (position: Vector, radius: number) => HTMLElement
    rct: (position: Vector, width: number, height: number, ...radii: Array<number>) => void
    outOfBounds: (position: Vector) => boolean
}
declare interface Window {
    p5a: p5a
}
declare let p5a: p5a;

declare global {
    let p5a: p5a;
}