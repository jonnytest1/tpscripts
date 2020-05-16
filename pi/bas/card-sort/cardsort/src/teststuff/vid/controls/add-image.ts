import { ControlPoition } from '../control';
import { VidComponent } from '../vid.component';
import { getMousePos } from '../util';
import { ImageAdjust } from '../adjustements/image-adjust';
import { AddAdjustment } from './add-adjustment';
import { CanvasWrapper } from '../canvas-wrapper/canvas-wrapper';
import { Vector2 } from '../vector';

export class AddImage extends AddAdjustment {
    onclick: () => void;

    position: ControlPoition = 'right';
    mouseDownEvent: MouseEvent;

    addingText = true;

    run(c: VidComponent, id: HTMLElement) {

        const addButton = document.createElement('button');
        addButton.textContent = 'Bild Einfügen';
        addButton.onclick = () => this.addingText = true;

        const text = document.createElement('input');
        text.type = 'file';
        // text.value = 'text hier einfügen';

        id.appendChild(addButton);
        id.appendChild(text);

        c.canvas.getCanvas().onmousedown = e => {
            this.mouseDownEvent = e;
        };

        c.canvas.getCanvas().onmouseup = async event => {
            if (this.addingText) {
                if (c.currentEntryIndex !== undefined) {
                    const position = getMousePos(this.mouseDownEvent);

                    const uuid = Math.random() * 1000000;
                    const img = new Image;
                    img.src = URL.createObjectURL(text.files[0]);


                    img.onload = () => {
                        const canvas = new CanvasWrapper({
                            defaultBackground: 'red',
                            source: img,
                            parent: document.body
                        });
                        canvas.getCanvas().style.position = 'fixed';
                        canvas.getCanvas().style.opacity = '0';
                        const context = canvas.context;
                        context.drawImage(img, 0, 0);
                        const adjustment = new ImageAdjust(canvas.getImageData(), position, uuid);

                        adjustment.direction = getMousePos(event).sub(position);
                        c.addAdjustment(adjustment);
                        c.drawCurrent(c.currentEntryIndex, true);
                    };
                    // document.body.appendChild(img);

                }
                this.addingText = false;
            }
        };
    }
}
