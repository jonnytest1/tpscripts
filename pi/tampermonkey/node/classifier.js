const classifier = require('@tensorflow-models/knn-classifier/dist/knn-classifier');
const mobilenetModule = require('@tensorflow-models/mobilenet/dist/mobilenet');
const tf = require('@tensorflow/tfjs-node');
const database = require('./database');
const { createCanvas } = require('canvas');
/**
 * @typedef {classifier.KNNClassifier & {
*      mobilenet:import("@tensorflow-models/mobilenet").MobileNet,
*      addExampleClass:(tag:string,img:any)=>void,
*      name:String,
*      tags:Array<{tag_id:number,tag_name:string}>
* }} CustomClassifier
*/
/**
 * @type {import('./classifier').CustomClassifier}
 */
let knnClassifier;
/**
 * @param {string} name
 * @returns {Promise<CustomClassifier>}
 */
async function getClassifier(name) {

    function setClassifier(knnC, net) {
        const addExampleClass = (classId, img) => {
            // Get the intermediate activation of MobileNet 'conv_preds' and pass that
            // to the KNN classifier.

            const activation = knnC.mobilenet.infer(img, 'conv_preds');

            // Pass the intermediate activation to the classifier.
            knnC.addExample(activation, classId);
            activation.dispose();
        };
        knnC.mobilenet = net;
        knnC.addExampleClass = addExampleClass;

        return knnC;
    }
    const tags = await database.getTags();
    const knn = classifier.create();
    // Load mobilenet.
    const mobilenet = await mobilenetModule.load();
    let weights = {};

    const dbWeights = await database.getWeights('knnAnime');
    if(dbWeights.length === 0) {
        knnClassifier = setClassifier(knn, mobilenet);
        console.log('loading previous data');
        const data = await database.getExamples();

        for(let i = 0; i < data.length; i++) {
            const imageElement = data[i];
            /**
             * @type { Array<number>}
             */
            const imageDataArray = JSON.parse(imageElement.imagedata);
            const canvas = getCanvas(imageDataArray);
            // Pass the intermediate activation to the classifier.
            knnClassifier.addExampleClass(imageElement.tag_name, canvas);

            //console.log('added example ' + JSON.stringify(imageElement.tag_name));
            if(i % 100 === 0) {
                console.log(`${i * 100 / data.length} % done`);
            }

        }
        console.log(`finsihed adding ${data.length} items`);
        await database.save(knnClassifier);
    } else {
        dbWeights.forEach(element => {
            try {
                const tensorArray = JSON.parse(element.modelvalue);
                weights[element.modelkey] = tf.tensor(tensorArray, [tensorArray.length / 1024, 1024]);
            } catch(e) {
                debugger;
            }
        });

        knn.setClassifierDataset(weights);
        knnClassifier = setClassifier(knn, mobilenet);
    }

    knnClassifier.name = name;
    knnClassifier.tags = tags;
    console.log('loaded classifier');
    return knnClassifier;
}

/**
 *
 * @param {{
*   tags:Array<string>,
*   chosen:boolean,
*   image:Array<number>
* }} example
*/
async function addExample(example) {
    await database.addExample(example, knnClassifier);

    const canvas = getCanvas(example.image);

    for(let tag of example.tags) {
        // const tagId = getTagId(tag);
        knnClassifier.addExampleClass(tag, canvas);
    }
    console.log('added examples ' + JSON.stringify(example.tags));
    database.save(knnClassifier);
}

/**
 *
 * @typedef {Array<{tag:string,prob:number}>} evalResponse
 *
 *
 * @param {Array<number>} imageData
 * @returns {Promise<evalResponse>}
 */
async function evaluate(imageData) {
    const canvas = getCanvas(imageData);

    // @ts-ignore
    const activation = knnClassifier.mobilenet.infer(canvas, 'conv_preds');
    const result = await knnClassifier.predictClass(activation);
    activation.dispose();
    /**
     * @type {Array<{percent:number,i:string}>}
     */
    let results = [];
    for(let i in result.confidences) {
        results.push({ i: i, percent: result.confidences[i] });
    }
    results.sort((a, b) => b.percent - a.percent);

    const best5 = [];
    for(let i = 0; i < 5; i++) {
        best5.push({ tag: results[i].i, prob: results[i].percent });
    }

    return best5.filter(el => el.prob > 0);
}

function getTagName(tagId) {
    for(let tag of knnClassifier.tags) {
        if(tag.tag_id + '' === tagId + '') {
            return tag.tag_name;
        }
    }
}

function getTagId(tagName) {
    for(let tag of knnClassifier.tags) {
        if(tag.tag_name === tagName) {
            return tag.tag_id;
        }
    }
}
/**
 * @param {Array<number>} iamgeData
 */
function getCanvas(iamgeData) {
    const size = Math.sqrt(iamgeData.length) / 2;
    // const iD = tf.tensor(example.image, [size, size, 4]);
    const canvas = createCanvas(size, size);
    const context = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    let iD = context.createImageData(size, size);
    for(let i = 0; i < iamgeData.length; i++) {
        iD.data[i] = iamgeData[i];
    }
    context.putImageData(iD, 0, 0);

    return canvas;
}

module.exports = {
    getClassifier, addExample, evaluate, dbtest: () => database.test()
};