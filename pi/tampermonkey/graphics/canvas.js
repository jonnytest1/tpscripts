class CanvasWrapper {

    constructor(canvas) {
        if(!canvas) {
            canvas = document.createElement('canvas');
        }
        /**@type {HTMLCanvasElement} */
        this.canvas = canvas;
    }
    randomize() {
        this.map(obj => ({
            red: Math.floor(Math.random() * 255),
            blue: Math.floor(Math.random() * 255),
            green: Math.floor(Math.random() * 255),
            alpha: 255,
        }));
    }
    /**
     * @typedef rgba;
     * @property {number} red
     * @property {number} blue
     * @property {number} green
     * @property {number} alpha
     *
     *
     * @param {(rgbaO:rgba,height:number,width:number)=>rgba} fnc
     */
    map(fnc) {
        let context = this.canvas.getContext('2d');
        let imageData = context.createImageData(this.canvas.width, this.canvas.height);

        for(let j = 0; j < imageData.height; j++) {
            for(let i = 0; i < imageData.width; i++) {
                var index = ((i * 4) * imageData.width) + (j * 4);

                let rgba = fnc({
                    red: imageData.data[index],
                    green: imageData.data[index + 1],
                    blue: imageData.data[index + 2],
                    alpha: imageData.data[index + 3]
                }, imageData.height, imageData.width);
                if(rgba) {
                    imageData.data[index] = rgba.red;
                    imageData.data[index + 1] = rgba.green;
                    imageData.data[index + 2] = rgba.blue;
                    imageData.data[index + 3] = rgba.alpha;
                }
            }
        }
        context.putImageData(imageData, 0, 0);
        return this.canvas;

    }

    /**
     *
     * @param {Array<any>} imageArray
     */
    draw(imageArray, toCanvas = true) {
        let context = this.canvas.getContext('2d');

        let width = imageArray.length;

        let height;
        if(imageArray[0].length) {
            height = imageArray[0].length;
        } else {
            width = height = Math.sqrt(imageArray.length);
        }
        this.canvas.height = height;
        this.canvas.width = width;
        let imageData = context.createImageData(width, height);

        function max(arr) {
            let highest = 0;
            for(let e of arr) {
                /**@type {Number} */
                let value = 0;
                if(typeof e === 'number') {
                    value = e;
                } else if(e instanceof Array) {
                    value = max(e);
                }
                if(value > highest) {
                    highest = value;
                }
            }
            return highest;
        }
        let multiplier = 1;
        if(max(imageArray) <= 1) {
            multiplier = 255;
        }
        let imageIndex = 0;
        for(let j = 0; j < imageData.height; j++) {
            for(let i = 0; i < imageData.width; i++) {

                var index = ((i * 4) * imageData.width) + (j * 4);
                if(imageArray[j].length) {
                    if(imageArray[j][i].length) {
                        if(imageArray[j][i].length === 3) {
                            imageData.data[index] = imageArray[j][i][0] * multiplier;
                            imageData.data[index + 1] = imageArray[j][i][1] * multiplier;
                            imageData.data[index + 2] = imageArray[j][i][2] * multiplier;
                            imageData.data[index + 3] = 255;
                        } else {
                            throw 'not implemented';
                        }

                    } else {
                        imageData.data[index] = imageArray[j][i] * multiplier;
                        imageData.data[index + 1] = imageArray[j][i] * multiplier;
                        imageData.data[index + 2] = imageArray[j][i] * multiplier;
                        imageData.data[index + 3] = 255;
                    }
                } else {
                    imageData.data[index] = imageArray[imageIndex] * multiplier;
                    imageData.data[index + 1] = imageArray[imageIndex] * multiplier;
                    imageData.data[index + 2] = imageArray[imageIndex++] * multiplier;
                    imageData.data[index + 3] = 255;
                }
            }
        }
        if(toCanvas) {
            context.putImageData(imageData, 0, 0);
        }
        return imageData;
    }
}