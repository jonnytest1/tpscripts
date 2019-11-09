
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

    await reqS('learning/tensorflow');
    await reqS('time');
    await reqS('graphics/canvas');
    const knnIO = await reqS('learning/knnIO');

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

    Promise.all([
        getClassifier()
            .then(c => {
                classifier = c;
                classifierReady.textContent = 'clasifier laoded';
            })
            .catch(e => {
                classifierReady.textContent = 'failed loading';
            }),
        new CustomTime().evaluateDuration(getPreviousTrainingData, t => console.log(`fetching data took ${t} ms`))
            .then(d => {
                data = d;
                dataReady.textContent = 'loaded data';
            })
    ])
        .then((promises) => {
            txt.textContent = `got ${data.data.length} datapoints`;
        });

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
        isValid: () => classifier,
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
        isValid: () => classifier,
        mouseOver: () => {
            testNumbers(classifier, cWrapper, data)
                .then((acc) => {
                    querydoc('#text').textContent = 'finished with ' + acc;
                });
        }
    });
    console.log('added menu');
    finished(classifier, true, buildModelScript);
})();

/**
 *
 * @param {*} classifier
 * @param {CanvasWrapper } cWrapper
 * @param {*} data
 */
async function testNumbers(classifier, cWrapper, data) {
    return new Promise(async (resolver) => {
        let correct = 0;
        for(let ind = 0; ind < 50; ind++) {
            document.querySelector('#text').textContent = `${ind}/50`;
            const rData = generateRAndomData(cWrapper, data);
            const activation = classifier.mobilenet.infer(rData.iD, 'conv_preds');
            // Get the most likely class and confidences from the classifier module.
            const result = await classifier.predictClass(activation);

            let results = [];
            for(let i in result.confidences) {
                results.push({ i: i, percent: result.confidences[i] });
            }
            results.sort((a, b) => b.percent - a.percent);
            let bestones = '';
            let found = 0;
            let prev = correct;
            for(let i = 0; i < 5; i++) {
                if(results[i].i === rData.tag.id + '') {
                    correct++;
                }
            }
            if(prev === correct) {
                const context = cWrapper.canvas.getContext('2d');
                context.putImageData(rData.iD, 0, 0);

                //await new Promise((res) => setTimeout(res, 1000));

            }

        }
        document.querySelector('#text').textContent = `percent : ${correct / 50}`;

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
async function trainNumbers(classifier, cWrapper, data) {
    return new Promise((res) => {
        const amount = 600;
        (function trainer(index = 0) {
            if(index > amount) {
                document.querySelector('#text').textContent = 'done';
                res();
                return;
            }
            document.querySelector('#text').textContent = `${index}/${amount}`;
            const rData = generateRAndomData(cWrapper, data);
            classifier.addExampleClass(rData.tag.id, rData.iD);

            setTimeout(trainer, 1, index + 1);
        })();
    });

}
/**
 * @param {TrainingData} data
 * @param {CanvasWrapper } cWrapper
 */
function generateRAndomData(cWrapper, data) {

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

    const tag = data.tagList.find(tg => tg.tag === number + '');
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

/**
 * @returns {Promise<TrainingData>}
 */
async function getPreviousTrainingData() {
    return new Promise((resolver) => {
        if(true) {
            var dbPromise = indexedDB.open('test-db4', 1);
            dbPromise.onsuccess = (e) => {
                try {
                    /**
                             * @type {IDBDatabase}
                             */
                    // @ts-ignore
                    const database = e.target.result;
                    const transaction = database.transaction(['ka'], 'readonly');
                    transaction.onerror = fetchFromDB;
                    const store = transaction.objectStore('ka');
                    const request = store.get('data');
                    request.onsuccess = (ev) => {
                        resolver(JSON.parse(request.result));
                    };
                    request.onerror = fetchFromDB;
                } catch(error) {
                    fetchFromDB();
                }
            };
            dbPromise.onerror = () => {
                fetchFromDB();
            };
        } else {
            fetchFromDB();
        }
        async function fetchFromDB() {
            debugger;
            let tags = await getTags();
            /**@type {Array<ImageElement>} */
            let outputs = [];
            let highest = -1;
            let imgs = [];
            do {
                imgs = await (await reqS('http')).http('GET', `${backendUrl}/site/kissanime/getImages.php?minID=${highest}`);
                for(let image of imgs) {
                    let id = image[0] - 1;
                    if(id > highest) {
                        highest = id;
                    }
                    //--------------unflatten---------------------
                    /**@type {Array<number>} */
                    let imgData = JSON.parse(`[${image[4].replace(/"/g, '')}]`);
                    let imgSize;
                    imgSize = Math.sqrt(imgData.length);
                    /**@type {ImageTensorArray} */
                    let result = [];
                    //size downscaled
                    /*for (let i = 0; i < img_size; i++) {
                        for (let j = 0; j < img_size; j++) {
                            let index = (i) * img_size + (j);
                            if (!result[i]) {
                                result[i] = [];
                            }
                            result[i][j] = img_data[index];
                        }
                    }*/
                    //size mobilenet
                    /*for (let i = 0; i < 224; i++) {
                        for (let j = 0; j < 224; j++) {
                            let index = (j * 4) * img_size + (i * 4);
                            if (!result[i]) {
                                result[i] = [];
                            }
                            result[i][j] = [img_data[index], img_data[index], img_data[index]];
                        }
                    }*/
                    //
                    result = imgData;
                    //--------------add tags---------------------
                    /**@type {Array<Number>} */
                    let yArray = new Array(tags.length).fill(0);
                    let tagNames = [];
                    for(let i = 1; i < 4; i++) {
                        tagNames.push(image[i]);
                        let index = tags.findIndex(el => el.tag === image[i]);
                        if(index !== -1) {
                            yArray[index] = 1;
                        }
                    }
                    outputs.push({ imageData: result, tags: tags, tagNames });
                }
            } while(imgs.length === 21);
            const newLocal = { tagList: tags, data: outputs };
            var saveDB = indexedDB.open('test-db4', 1);
            saveDB.onsuccess = (e) => {
                /**
                         * @type {IDBDatabase}
                         */
                // @ts-ignore
                const database = e.target.result;
                const transaction = database.transaction(['ka'], 'readwrite');
                const store = transaction.objectStore('ka');
                store.put(JSON.stringify(newLocal), 'data');
            };
            saveDB.onupgradeneeded = (e) => {
                /**
                 * @type {IDBDatabase}
                 */
                // @ts-ignore
                const database = e.target.result;
                //  const transaction = database.transaction('ka', 'readwrite');
                const store = database.createObjectStore('ka');
                store.createIndex('key', 'key', { unique: true });
                store.createIndex('value', 'value', { unique: false });
                const insertRequest = store.put(JSON.stringify(newLocal), 'data');
                insertRequest.onsuccess = () => {
                    console.log('added DAta');
                };
            };
            resolver(newLocal);
        }
    });

}
