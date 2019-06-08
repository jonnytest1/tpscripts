class CanvasWrapper {

    constructor(canvas) {
        if (!canvas) {
            canvas = document.createElement("canvas");
        }
        this.canvas = canvas;
    }

    map(fnc) {
        let context = this.canvas.getContext('2d');
        let imageData = context.createImageData(100, 100);

        for (let j = 0; j < imageData.height; j++) {
            for (let i = 0; i < imageData.width; i++) {
                var index = ((i * 4) * imageData.width) + (j * 4);

                let rgba = fnc({
                    red: imageData.data[index],
                    green: imageData.data[index + 1],
                    blue: imageData.data[index + 2],
                    alpha: imageData.data[index + 3]
                }, imageData.height, imageData.width);
                if (rgba) {
                    imageData.data[index] = rgba.red;
                    imageData.data[index + 1] = rgba.green;
                    imageData.data[index + 2] = rgba.blue;
                    imageData.data[index + 3] = rgba.alpha;
                }
            }
        }
        context.putImageData(imageData, 0, 0);
        return canvas;

    }
}