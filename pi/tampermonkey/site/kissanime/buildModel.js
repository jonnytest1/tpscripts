
/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="../../time.js" />
/// <reference path="../../customTypes/tensorflow.d.ts" />
/// <reference path="../../http.js" />
/// <reference path="../../graphics/canvas.js" />

/**
 * @typedef tag
 * @property {String} tag
 * @property {number} id
 *
 *
 * @typedef {Array<number>} ImageTensorArray
  * @typedef ImageElement
  * @property {ImageTensorArray} imageData
  * @property {Array<tag>} tags classified (0 or 1 depending onwether its confirmed)
  * @property {Array<String>} tagNames
  *
* @typedef TrainingData
* @property {Array<tag>} tagList
* @property {Array<ImageElement>} data
*/
/**
 * @type {HTMLOrSVGScriptElement & CustomScript } */
let buildModelScript = document.currentScript;
buildModelScript.isAsync = true;

(async function buildModel() {

    const txt = document.createElement('div');
    txt.id = 'text';
    txt.textContent = 'loading require';
    document.body.appendChild(txt);

    const dataReady = document.createElement('div');
    dataReady.textContent = 'loading data';
    dataReady.style.left = '0px';
    dataReady.style.top = '0px';
    dataReady.style.position = 'fixed';
    document.body.appendChild(dataReady);

    const classifierReady = document.createElement('div');
    classifierReady.textContent = 'loading classifier';
    classifierReady.style.left = '0px';
    classifierReady.style.top = '20px';
    classifierReady.style.position = 'fixed';
    document.body.appendChild(classifierReady);

    let [_tensorflow, progress, _canvas, _time] = await reqS([
        'learning/tensorflow',
        'DOM/progress-overlay',
        'graphics/canvas',
        'time']);
    let knnIO;// = await reqS('learning/knnIO');

    /*knnIO('knnAnime')
                    .load()
                    .then(res)
                    .catch(() => {
                        console.log('new');
                        knnIO('knnAnime')
                            .new()
                            .then(res); */

    async function getClassifier() {
        return new Promise((res, err) => {
            knnIO('knnAnime')
                .new()
                .then(res)
                .catch(err);
        });
    }
    // @ts-ignore
    new FontFace('Tahoma', `url(${window.backendUrl}/site/kissanime/Tahoma.ttf)`).load();
    txt.textContent = 'loading classifier';

    let classifier;

    /* Promise.all([
         getClassifier()
             .then(c => {
                 classifier = c;
                 classifierReady.textContent = 'clasifier laoded';
             })
             .catch(e => {
                 classifierReady.textContent = 'failed loading';
             }),

     ])
         .then((promises) => {
             txt.textContent = `got ${data.data.length} datapoints`;
         });*/

    /*new CustomTime().evaluateDuration(getPreviousTrainingData, t => console.log(`fetching data took ${t} ms`))
        .then(d => {
            data = d;
            dataReady.textContent = 'loaded data';
        });*/

    /**
    * @typedef TagConfirmation
    * @property {boolean} chosen
    * @property {Array<number>} img
    * @property { Array<String>} tags
    */
    /**
     * @type {TrainingData}
     */
    let data;

    const canvas = document.createElement('canvas');
    canvas.style.backgroundColor = '#439ae65e';
    canvas.height = canvas.width = 79;
    document.body.appendChild(canvas);
    const cWrapper = new CanvasWrapper(canvas);

    sc.menu.addToMenu({
        name: 'train',
        isValid: () => classifier && !!data,
        mouseOver: () => {
            txt.textContent = 'traingin';
            setTimeout(() => train(classifier, cWrapper, data)
                .then(() => {
                    txt.textContent = 'finished training';
                }), 50);
        }
    });
    sc.menu.addToMenu({
        name: 'draw',
        isValid: () => !!data,
        mouseOver: () => {
            setTimeout(() => {
                try {
                    const imageData = data.data[0].imageData;

                    const size = Math.sqrt(imageData.length / 4);
                    cWrapper.canvas.width = size;
                    cWrapper.canvas.height = size;
                    const context = cWrapper.canvas.getContext('2d');
                    let iD = context.createImageData(size, size);
                    for(let i = 0; i < imageData.length; i++) {
                        iD.data[i] = imageData[i];
                    }
                    context.putImageData(iD, 0, 0);
                } catch(e) {
                    handleError(e);
                }

            }, 50);
        }
    });
    sc.menu.addToMenu({
        name: 'trainN',
        isValid: () => classifier || true,
        mouseOver: () => {
            txt.textContent = 'traingin';
            setTimeout(() => trainNumbers(classifier, cWrapper, data)
                .then(() => {
                    txt.textContent = 'finished training';
                }), 50);
        }
    });
    sc.menu.addToMenu({
        name: 'save',
        isValid: () => classifier,
        mouseOver: () => {
            knnIO('knnAnime')
                .save(classifier)
                .then(() => {
                    txt.textContent = 'saved';
                });
        }
    });

    sc.menu.addToMenu({
        name: 'evaluate',
        isValid: () => classifier && !!data,
        mouseOver: () => {
            test(classifier, cWrapper, data)
                .then((acc) => {
                    querydoc('#text').textContent = 'finished with ' + acc;
                });
        }
    });
    sc.menu.addToMenu({
        name: 'evalN',
        isValid: () => classifier || true,
        mouseOver: () => {
            testNumbers(classifier, cWrapper, data)
                .then((acc) => {
                    querydoc('#text').textContent = 'finished with ' + acc;
                });
        }
    });
    console.log('added menu');

    /**
 * @param {TrainingData} data
 * @param {CanvasWrapper } cWrapper
 */
    async function trainNumbers(classifier, cWrapper, data) {
        return new Promise(async (res) => {
            const amount = 600;
            const batchSize = 100;
            (async function trainer(data, index = 0) {
                if(index > amount) {
                    document.querySelector('#text').textContent = 'done';
                    res();
                    return;
                }
                document.querySelector('#text').textContent = `${index}/${amount}`;
                //const dataAr = await getData(batchSize);

                const [response, newdata] = await Promise.all(
                    [
                        fetch('http://localhost:8080/trainrandomnumbers', {
                            body: JSON.stringify(data),
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }),
                        getData(batchSize)
                    ]
                );

                //classifier.addExampleClass(rData.tag.id, rData.iD);

                setTimeout(trainer, 1, newdata, index + batchSize);
            })(await getData(batchSize));
        });

        async function getData(batchSize) {
            const dataAr = [];
            const progressOtionsRef = await progress(o => 0, { text: 'generating data', max: batchSize });
            for(let i = 0; i < batchSize; i++) {
                const dataEl = cWrapper.noiseWithNumber();
                await Promise.delayed();
                dataAr.push({ tag: dataEl.number, image: [...dataEl.imageData.data] });
                progressOtionsRef.count = i;
            }
            progressOtionsRef.count = progressOtionsRef.max;
            return dataAr;
        }
    }

    finished(classifier, true, buildModelScript);
})();
var testContainer;
/**
 *
 * @param {*} classifier
 * @param {CanvasWrapper } cWrapper
 * @param {*} data
 */
async function testNumbers(classifier, cWrapper, data) {
    return new Promise(async (resolver) => {
        let correct = 0;
        if(testContainer) {
            testContainer.remove();
            testContainer = undefined;
        }

        testContainer = document.createElement('container');
        testContainer.appendChild(document.createElement('br'));
        document.body.appendChild(testContainer);

        for(let ind = 0; ind < 4; ind++) {
            document.querySelector('#text').textContent = `${ind}/50`;

            const canvas = document.createElement('canvas');
            const cW = new CanvasWrapper(canvas);
            testContainer.appendChild(canvas);

            const div = document.createElement('div');

            testContainer.appendChild(div);
            testContainer.appendChild(document.createElement('br'));
            const rData = cW.noiseWithNumber();
            let dataArray = [];
            for(let j of rData.imageData.data) {
                dataArray.push(j);
            }
            // length 102399
            const result = await fetch('http://localhost:8080/eval', {
                method: 'POST',
                body: JSON.stringify(dataArray),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            /**
             * @type {import('../../node/classifier').evalResponse} */
            const pred = await result.json();
            let bestones = '<table style="margin-left:50px;">';
            let first = true;
            for(let p of pred.sort((a, b) => b.prob - a.prob)) {
                if(!isNaN(+p.tag)) {
                    if(first) {
                        bestones += `<tr><td style="color:green">${p.tag}</td><td>${Math.round(p.prob * 100) / 100}</td></tr>`;
                        first = false;
                    } else {
                        bestones += `<tr><td>${p.tag}</td><td>${Math.round(p.prob * 100) / 100}</td></tr>`;
                    }
                }
            }

            div.innerHTML = bestones;
        }
        document.querySelector('#text').textContent = `percent : ${correct / 50}`;
        resolver();
    });

}

/**
 *
 * @param {*} classifier
 * @param {*} cWrapper
 * @param {TrainingData} data
 */
async function test(classifier, cWrapper, data) {
    let correct = 0;
    return new Promise(async (resolver) => {
        (async function testing(index = 0) {
            try {

                if(index % 10 === 0) {
                    document.querySelector('#text').textContent = (index / data.data.length) + '';
                }

                if(index >= data.data.length) {
                    resolver(correct / data.data.length);
                    return;
                }

                const imageElement = data.data[index];
                const iD = cWrapper.draw(imageElement.imageData, true);

                const activation = classifier.mobilenet.infer(iD, 'conv_preds');
                // Get the most likely class and confidences from the classifier module.
                const result = await classifier.predictClass(activation);

                let results = [];
                for(let i in result.confidences) {
                    results.push({ i: i, percent: result.confidences[i] });
                }
                results.sort((a, b) => b.percent - a.percent);
                let found = 0;
                let remainingTags = [...imageElement.tagNames];
                for(let i = 0; i < 5; i++) {
                    const tag = data.tagList.find(el => el.id === +results[i].i);
                    remainingTags = remainingTags.filter(t => t !== tag.tag);
                    if(imageElement.tagNames.includes(tag.tag)) {
                        found++;
                    }
                }
                if(found > 2) {
                    correct++;
                } else {
                    console.log(remainingTags);
                }
                // document.querySelector('#text').innerHTML += bestones;
                //document.querySelector('#text').textContent = tag.tag;
                setTimeout(() => testing(index + 1), 1);
            } catch(error) {
                console.error(error);
            }
        })();
    });
}

/**
 * @param {TrainingData} data
 * @param {CanvasWrapper } cWrapper
 */
function generateRAndomData(cWrapper, data, downscaled = true) {

    const canvas = cWrapper.canvas;
    var ctx = canvas.getContext('2d');
    var CSS_COLOR_NAMES = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood',
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
    const number = Math.floor(Math.random() * 10);
    const color = CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];

    const tag = number + '';
    canvas.width = canvas.height = 160;
    cWrapper.randomize();
    ctx.fillStyle = color;
    ctx.font = '64px Tahoma';
    const xT = 10 + (Math.random() * 100);
    const yT = 50 + (Math.random() * 100);
    console.log(xT, yT, color);
    ctx.fillText(number + '', xT, yT);

    let imageData = ctx.getImageData(0, 0, 160, 160);
    let dataArray = [];
    let scaleSize = 2;

    if(downscaled) {
        for(let j = 0; j < imageData.height - scaleSize; j += scaleSize) {
            for(let i = 0; i < imageData.width - scaleSize; i += scaleSize) {
                let sum = 0;
                let amount = 0;
                for(let x = 0; x < scaleSize; x++) {
                    for(let y = 0; y < scaleSize; y++) {
                        let index = ((i + x) * 4) * imageData.width + ((j + y) * 4);
                        let red = imageData.data[index];
                        let green = imageData.data[index + 1];
                        let blue = imageData.data[index + 2];
                        if(blue !== undefined && red !== undefined && green !== undefined) {
                            amount++;
                            sum += (red + green + blue) / 3;

                        }

                    }
                }
                dataArray.push(Math.round(sum / amount) / 255);

            }
        }
    } else {
        dataArray = [...imageData.data];
    }
    const grayScaleData = dataArray;
    const iD = cWrapper.draw(grayScaleData, true);
    return { iD, tag };
}

/**
 * @param {TrainingData} data
 * @param {CanvasWrapper } cWrapper
 */
async function train(classifier, cWrapper, data) {
    return new Promise(async (resolver) => {
        (function training(batchIndex = 0) {

            if(batchIndex % 10 === 0) {
                const percentage = batchIndex * 100 / data.data.length;
                document.querySelector('#text').textContent = percentage + '';
            }
            if(batchIndex >= data.data.length) {
                resolver();
                return;
            }

            const imageElement = data.data[batchIndex];

            const iD = cWrapper.draw(imageElement.imageData, false);

            for(let t of imageElement.tags) {
                if(imageElement.tagNames.includes(t.tag)) {
                    classifier.addExampleClass(t.id, iD);
                }
            }

            setTimeout(() => training(batchIndex + 1), 5);

        })();

    });

}

/**@returns {Promise<Array<tag>>} */
async function getTags() {

    let tags = await (await reqS('http')).http('GET', backendUrl + '/site/kissanime/getTags.php');
    /**@type {Array<tag>} */
    let parsedTags = tags.map(a => ({ tag: a[1], id: a[0] }));
    //parsedTags = parsedTags.filter(t => !isNaN(+t.tag));
    return parsedTags;
}
