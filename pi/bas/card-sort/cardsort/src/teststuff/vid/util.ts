import { Vector2 } from './vector';

export function getMousePos(evt) {
    // let rect = canvas.getBoundingClientRect();

    return new Vector2(evt.offsetX, evt.offsetY);
    // return new Vector2(evt.clientX - rect.left, evt.clientY - rect.top);

}
