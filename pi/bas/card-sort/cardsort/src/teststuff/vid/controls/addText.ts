import { ControlPoition } from '../control';
import { VidComponent } from '../vid.component';
import { getMousePos } from '../util';
import { TextADjust } from '../adjustements/text-adjust';
import { AddAdjustment } from './add-adjustment';

export class AddText extends AddAdjustment {
    onclick: () => void;

    position: ControlPoition = 'right';
    mouseDownEvent: MouseEvent;

    addingText = true;

    run(c: VidComponent, id: HTMLElement) {

        const addButton = document.createElement('button');
        addButton.textContent = 'Text Hinzufügen';
        addButton.onclick = () => this.addingText = true;

        const text = document.createElement('input');
        text.value = 'text hier einfügen';

        id.appendChild(addButton);
        id.appendChild(text);

        c.canvas.getCanvas().addEventListener(

            "mousedown", e => {
                this.mouseDownEvent = e;
            });

        c.canvas.getCanvas().addEventListener('mouseup', event => {
            if (this.addingText) {
                if (c.currentEntryIndex !== undefined) {
                    const position = getMousePos(this.mouseDownEvent);

                    const uuid = Math.random() * 1000000;

                    const adjustment = new TextADjust(text.value, position, uuid);
                    const direction = getMousePos(event).sub(position);
                    adjustment.direction = direction;
                    c.addAdjustment(adjustment);
                    c.drawCurrent(c.currentEntryIndex, true);
                }
                this.addingText = false;
            }
        });
    }
}
