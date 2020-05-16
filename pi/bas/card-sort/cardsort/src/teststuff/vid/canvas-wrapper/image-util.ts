import { CanvasWrapper } from './canvas-wrapper';
import { Vector2 } from '../vector';


interface Pixel {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    x: number;
    y: number;
}
export class ImageUtil {
    canvas: CanvasWrapper;


    constructor(canvas: CanvasWrapper) {
        this.canvas = canvas;
    }

    collision(start: Vector2, end: Vector2, pixel: { x: number, y: number }) {
        if (pixel.x >= start.x && pixel.y >= start.y && pixel.x <= end.x && pixel.y <= end.y) {
            return true;
        }
        return false;

    }

    addImage(image: ImageData, pos: Vector2) {
        pos = pos.round();
        const end = pos.add(new Vector2(image.width, image.height));
        this.map(p => {
            if (this.collision(pos, end, p)) {
                return { ...this.getPixel(image, new Vector2(p).sub(pos)) };
            }
            return p;
        }, { from: pos, to: end });

    }


    getPixel(image: ImageData, pos: Vector2) {
        const index = pos.y * (image.width * 4) + pos.x * 4;
        return {
            red: image.data[index],
            green: image.data[index + 1],
            blue: image.data[index + 2],
            alpha: image.data[index + 3],
            x: pos.x,
            y: pos.y
        };
    }

    map(fnc: (pixel: Pixel, height, width) => Pixel, options: { from?: Vector2, to?: Vector2 } = {}) {
        const imageData = this.canvas.getImageData();

        let start = Vector2.ZERO;
        if (options.from) {
            start = options.from.round();
        }

        let end = this.canvas.rect;
        if (options.to) {
            end = options.to;
        }

        end = end.limit(this.canvas.rect.round());

        for (let x = start.x; x < end.x; x++) {
            for (let y = start.y; y < end.y; y++) {
                const index = y * (imageData.width * 4) + x * 4;

                const rgba = fnc({
                    red: imageData.data[index],
                    green: imageData.data[index + 1],
                    blue: imageData.data[index + 2],
                    alpha: imageData.data[index + 3],
                    x: x,
                    y: y
                }, imageData.height, imageData.width);
                if (rgba) {
                    imageData.data[index] = rgba.red;
                    imageData.data[index + 1] = rgba.green;
                    imageData.data[index + 2] = rgba.blue;
                    imageData.data[index + 3] = rgba.alpha;
                } else {
                    debugger;
                }
            }
        }
        this.canvas.putImageData(imageData);
        return this.canvas;

    }


}
