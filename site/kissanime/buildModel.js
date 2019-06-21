
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
 * @typedef {Array<any>} ImageTensorArray
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
    await reqS('learning/tensorflow');
    await reqS('time');
    await reqS('graphics/canvas');
    const knnIO = await reqS('learning/knnIO');

    async function getClassifier() {
        return new Promise(res => {
            knnIO('knnAnime')
                .load()
                .then(res)
                .catch(() => {
                    console.log('new');
                    knnIO('knnAnime')
                        .new()
                        .then(res);
                });
        });
    }

    const classifier = await getClassifier();

    /**
     * @typedef TagConfirmation
     * @property {boolean} chosen
     * @property {Array<number>} img
     * @property { Array<String>} tags
     */

    const data = await new CustomTime().evaluateDuration(getPreviousTrainingData, t => console.log(`fetching data took ${t} ms`));
    const example = data.data[0];
    const eTensor = tf.tensor(example.imageData);
    console.log(`got ${data.data.length} datapoints`);

    const txt = document.createElement('div');
    txt.id = 'text';
    txt.textContent = 'test';
    document.body.appendChild(txt);

    const canvas = document.createElement('canvas');
    canvas.style.backgroundColor = '#439ae65e';
    document.body.appendChild(canvas);
    const cWrapper = new CanvasWrapper(canvas);

    sc.menu.addToMenu({
        name: 'train',
        mouseOver: () => {
            console.log('training start');
            setTimeout(() => train(classifier, cWrapper, data), 50);
        }
    });
    sc.menu.addToMenu({
        name: 'save',
        mouseOver: () => {
            knnIO('knnAnime')
                .save(classifier);
        }
    });
    sc.menu.addToMenu({
        name: 'test',
        mouseOver: () => {
            test(classifier, cWrapper, data)
                .then(() => {
                    document.querySelector('#text').textContent = 'finished';
                });
        }
    });
    console.log('added menu');
    finished(classifier, true, buildModelScript);
})();
/**
 *
 * @param {*} classifier
 * @param {*} cWrapper
 * @param {TrainingData} data
 */
async function test(classifier, cWrapper, data) {
    return new Promise(async (resolver) => {
        (async function testing(index = 0) {
            if (index >= data.data.length) {
                resolver();
                return;
            }

            const imageElement = data.data[index];
            const iD = cWrapper.draw(imageElement.imageData);

            const activation = classifier.mobilenet.infer(iD, 'conv_preds');
            // Get the most likely class and confidences from the classifier module.
            const result = await classifier.predictClass(activation);
            console.log(result.confidences);
            const tag = data.tagList.find(t => t.id + '' === result.label);

            document.querySelector('#text').textContent = tag.tag;
            setTimeout(() => testing(index + 1), 500);
        })();
    });
}

/**
 * @param {TrainingData} data
 * @param {number} [index]
 * @param {CanvasWrapper } cWrapper
 */
async function train(classifier, cWrapper, data, index = 0) {
    return new Promise(async (resolver) => {
        (function training(batchIndex = 0) {

            if (batchIndex % 10 === 0) {
                const percentage = batchIndex * 100 / data.data.length;
                console.log(percentage);
            }
            if (batchIndex >= data.data.length) {
                resolver();
                return;
            }

            const imageElement = data.data[batchIndex];

            const iD = cWrapper.draw(imageElement.imageData, batchIndex % 20 === 0);

            for (let t of imageElement.tags) {
                classifier.addExampleClass(t.id, iD);
            }

            setTimeout(() => training(batchIndex + 1), 5);

        })();

        /*
                const batchSize = 50;
                const percentage = index * 100 / data.data.length;

                const batch = data.data.slice(index, index + batchSize);

                if (batch.length == 0) {
                    resolver();
                    return;
                }
                const imageDataPoints = tf.tensor(batch.map(b => b.imageData));
                const tagDataPoints = tf.tensor(batch.map(b => b.tags));
                const history = await model.fit(imageDataPoints, tagDataPoints, {
                    epochs: 20
                });
                imageDataPoints.dispose()
                tagDataPoints.dispose();
                let accuracy = 0;
                for (let acc of history.history.acc) {
                    accuracy += acc;
                }
                let meanAccuraccy = accuracy / history.history.acc.length
                let loss = 0;
                for (let acc of history.history.loss) {
                    loss += acc;
                }
                let meanLoss = loss / history.history.loss.length
                console.log(Math.floor(percentage) + " % done with accuracy " + meanAccuraccy);

                setTimeout(() => train(model, data, index + batchSize), 50);*/

    });

}

/**@returns {Promise<Array<tag>>} */
async function getTags() {

    let tags = await http('GET', backendUrl + '/site/kissanime/getTags.php');
    /**@type {Array<tag>} */
    let parsedTags = tags.map(a => ({ tag: a[1], id: a[0] }));
    parsedTags = parsedTags.filter(t => !isNaN(+t.tag));
    return parsedTags;
}

/**
 * @returns {Promise<TrainingData>}
 */
async function getPreviousTrainingData() {

    let tags = await getTags();

    /**@type {Array<ImageElement>} */
    let outputs = [];
    let highest = -1;
    let imgs = [];
    do {
        imgs = await http('GET', `${backendUrl}/site/kissanime/getImages.php?minID=${highest}`);
        for (let image of imgs) {
            let id = image[0] - 1;
            if (id > highest) {
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
            for (let i = 1; i < 4; i++) {
                tagNames.push(image[i]);
                let index = tags.findIndex(el => el.tag === image[i]);
                if (index !== -1) {
                    yArray[index] = 1;
                }
            }
            outputs.push({ imageData: result, tags: tags, tagNames });
        }
    } while (imgs.length === 21);

    return { tagList: tags, data: outputs };

}
