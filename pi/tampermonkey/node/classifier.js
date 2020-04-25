
const classifier = require('@tensorflow-models/knn-classifier/dist/knn-classifier');
const mobilenetModule = require('@tensorflow-models/mobilenet/dist/mobilenet');
const tf = require('@tensorflow/tfjs-node');
const database = require('./database');

/**
 * @typedef {import("@tensorflow-models/knn-classifier").KNNClassifier & {
 *      mobilenet:import("@tensorflow-models/mobilenet").MobileNet,
 *      addExampleClass:(tag:string,img:any)=>void,
 *      getClassifierDataset
 *      name:String,
 *      tags:Array<{tag_id:number,tag_name:string}>
 * }} CustomClassifier
 *
 *
 * @typedef TagEvaluation
 * @property {string} tag
 * @property {number} prob
 *
 *
 * @typedef {Array<TagEvaluation>} evalResponse
 *
 *
 *
 * @type {CustomClassifier}
 */
let knnClassifier;

/**
* @type {Array<{
*   tags:Array<string>,
*   chosen:boolean,
*   image:Array<number>
* }>}
*/
let examples = [];

let running = false;

/**
 * @param {*} setClassifier
 * @param {import("@tensorflow-models/knn-classifier").KNNClassifier} knn
 * @param {import("@tensorflow-models/mobilenet").MobileNet} mobilenet
 */
async function preTrain(setClassifier, knn, mobilenet) {
    knnClassifier = setClassifier(knn, mobilenet);
    console.log('loading previous data');

    let max = -1;
    let count = 0;

    const tagCount = await database.getTagCount();

    try {
        while(true) {

            const result = await database.getExamples(max);
            const data = result.data;
            max = result.maxId;
            count += data.length;

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
            }
            console.log(`finsihed adding ${count} / ${tagCount} items`);

        }
    } catch(e) {
        if(e !== 'no more') {
            throw e;
        } else {
            console.log('no more data to add');
        }
    }

    await database.save(knnClassifier);

}

async function trainExamples() {
    running = true;

    while(examples.length > 0) {
        const example = examples.shift();
        await database.addExample(example, knnClassifier);
        const canvas = getCanvas(example.image);
        for(let tag of example.tags) {
            knnClassifier.addExampleClass(tag, canvas);
        }
        console.log('added examples ' + JSON.stringify(example.tags));
    }

    await database.save(knnClassifier);
    running = false;
}

/**
 * @param {Array<number>} iamgeData
 */
function getCanvas(iamgeData) {
    const size = Math.sqrt(iamgeData.length) / 2;

    const withoutAlpha = iamgeData.filter((d, i) => (i + 1) % 4 !== 0);

    const canvas = tf.tensor(withoutAlpha, [size, size, 3]);
    return canvas;
}

class Classifier {

    constructor() {
        this.thisRef = this;
    }
    /**
    * @param {Array<{
    *   tag:string,
    *   image:Array<number>
    * }>} exampleArray
    */
    async randomNumbers(exampleArray) {
        console.log('training numbers');
        return new Promise(async (res) => {
            for(let obj of exampleArray) {
                const rData = getCanvas(obj.image);
                knnClassifier.addExampleClass(obj.tag, rData);
                rData.dispose();
            }
            console.log('finished numbers traingin numbers');
            //await database.save(knnClassifier);
            res();
        });
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<CustomClassifier>}
     */
    async init(name) {
        /**
     *
     * @param {import("@tensorflow-models/mobilenet").MobileNet} net
     */
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
        console.log('backend: ' + tf.getBackend());
        const tags = await database.getTags();
        /**
         * @type {any}
         */
        const knn = classifier.create();
        // Load mobilenet.
        const mobilenet = await mobilenetModule.load();
        /**
         * @type {{[key:string]:import("@tensorflow/tfjs").Tensor2D}}
         */
        let weights = {};

        const dbWeights = await database.getWeights('knnAnime');
        if(dbWeights.length === 0) {
            console.log('pretraining');
            await preTrain(setClassifier, knn, mobilenet);
        } else {
            console.log('setting weights');
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
     * @param {Array<number>} imageData length 102399
     * @returns {Promise<evalResponse>}
     */
    async evaluate(imageData) {
        const canvas = getCanvas(imageData);

        // @ts-ignore
        const activation = knnClassifier.mobilenet.infer(canvas, 'conv_preds');
        canvas.dispose();
        const result = await knnClassifier.predictClass(activation, 15);
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
        for(let i = 0; i < 10; i++) {
            if(!results[i].i) {
                debugger;
            }
            best5.push({ tag: results[i].i, prob: results[i].percent });
        }

        return best5.filter(el => el.prob > 0);
    }

    /**
    * @param {Array<{
    *   tags:Array<string>,
    *   chosen:boolean,
    *   image:Array<number>
    * }>} exampleArray
    */
    async  addExample(exampleArray) {
        exampleArray.forEach(example => {
            examples.push(example);
        });

        if(!running) {
            trainExamples();
        }
    }
    async dbtest() {
        return database.test();
    }

}

module.exports = new Classifier();