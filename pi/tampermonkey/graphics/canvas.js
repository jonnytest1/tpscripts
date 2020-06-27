const CSS_COLOR_NAMES = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood',
    'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen',
    'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'Darkorange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise',
    'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod',
    'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue',
    'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray',
    'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple',
    'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy',
    'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum',
    'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey',
    'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'];

class CanvasWrapper {

    constructor(canvas) {
        if(!canvas) {
            canvas = document.createElement('canvas');
        }
        if(canvas === true) {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
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
        * @returns {Array<Array<Array<number>>>}
        */
    drawForConv(imageArray, toCanvas = true) {
        const iD = this.draw(imageArray, false);

        if(iD.height !== iD.width) {
            throw new Error('not implementet');
        }
        /**
         * @type {Array<Array<Array<number>>>}
         */
        let array = [];
        const shape1and2 = iD.height;

        for(let i = 0; i < shape1and2; i++) {
            const rowStart = ((i * 4) * shape1and2);
            array[i] = [];
            for(let j = 0; j < shape1and2; j++) {
                const columnSTart = rowStart + (j * 4);
                array[i][j] = [];
                for(let k = 0; k < 4; k++) {
                    const index = columnSTart + k;
                    array[i][j].push(iD.data[index]);
                }
            }
        }

        return array;

    }

    /**
     *
     * @param {Array<any>} imageArray
     * @param {{greyscale?:boolean}} [options]
     */
    draw(imageArray, toCanvas = true, options = {}) {
        let context = this.canvas.getContext('2d');

        let width = imageArray.length;

        let height;
        if(imageArray[0].length && (imageArray[0].length !== 4)) {
            height = imageArray[0].length;
        } else {
            width = height = Math.sqrt(imageArray.length / 4);
            if(width % 1 !== 0) {
                width = height = Math.sqrt(imageArray.length / 3);
            }

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

                var index = ((j * 4) * imageData.width) + (i * 4);
                if(imageArray[j].length) {
                    if(imageArray[j].length <= 4) {
                        const imageArrayIndex = ((i) * imageData.width) + (j);
                        imageData.data[index] = imageArray[imageArrayIndex][0] * multiplier;
                        imageData.data[index + 1] = imageArray[imageArrayIndex][1] * multiplier;
                        imageData.data[index + 2] = imageArray[imageArrayIndex][2] * multiplier;
                        imageData.data[index + 3] = 255;
                    } else if(imageArray[j][i].length) {
                        if(imageArray[j][i].length === 3) {
                            imageData.data[index] = imageArray[j][i][0] * multiplier;
                            imageData.data[index + 1] = imageArray[j][i][1] * multiplier;
                            imageData.data[index + 2] = imageArray[j][i][2] * multiplier;
                            imageData.data[index + 3] = 255;
                        } else if(imageArray[j][i].length === 4) {
                            imageData.data[index] = imageArray[j][i][0] * multiplier;
                            imageData.data[index + 1] = imageArray[j][i][1] * multiplier;
                            imageData.data[index + 2] = imageArray[j][i][2] * multiplier;
                            imageData.data[index + 3] = imageArray[j][i][3] * multiplier;
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
                    if(options.greyscale) {
                        imageData.data[index] = imageArray[imageIndex] * multiplier;
                        imageData.data[index + 1] = imageArray[imageIndex] * multiplier;
                        imageData.data[index + 2] = imageArray[imageIndex++] * multiplier;
                        imageData.data[index + 3] = 255;
                    } else {
                        imageData.data[index] = imageArray[imageIndex++] * multiplier;
                        imageData.data[index + 1] = imageArray[imageIndex++] * multiplier;
                        imageData.data[index + 2] = imageArray[imageIndex++] * multiplier;
                        imageData.data[index + 3] = 255;
                    }

                }
            }
        }
        if(toCanvas) {
            context.putImageData(imageData, 0, 0);
        }
        return imageData;
    }

    noiseWithNumber() {

        var ctx = this.canvas.getContext('2d');
        const number = Math.floor(Math.random() * 10);
        const color = CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];

        const tag = number + '';
        this.canvas.width = this.canvas.height = 160;
        this.randomize();
        ctx.fillStyle = color;
        ctx.font = '64px Tahoma';
        const xT = 10 + (Math.random() * 100);
        const yT = 50 + (Math.random() * 100);
        // console.log(xT, yT, color);
        ctx.fillText(number + '', xT, yT);

        let imageData = ctx.getImageData(0, 0, 160, 160);
        return { imageData, number: tag };
    }
}