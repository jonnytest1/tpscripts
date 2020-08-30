
const NumbersClassifier = require('./numbersmodel').NumbersClassifier;
const classifier = require('@tensorflow-models/knn-classifier/dist/knn-classifier');
const mobilenetModule = require('@tensorflow-models/mobilenet/dist/mobilenet');
const tf = require('@tensorflow/tfjs-node');
const database = require('./database');
var jpeg = require('jpeg-js');
const fs = require('fs');
const c = require('crypto');

/**
 * @typedef {import("@tensorflow-models/knn-classifier").KNNClassifier & {
 *      mobilenet:import("@tensorflow-models/mobilenet").MobileNet,
 *      getClassifierDataset
 *      name:String,
 *      tags:Array<{tag_id:number,tag_name:string}>
 * }} CustomClassifier
 *
 *
 * @typedef {{
            image:number
            tag_id:number
            tag_name:string}} Tag
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
 */

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
 * @param {Array<number>} iamgeData
 */
function getImageTensor(iamgeData) {
    const size = Math.sqrt(iamgeData.length) / 2;

    const withoutAlpha = iamgeData
        .filter((d, i) => (i + 1) % 4 !== 0)//remove alpha
        .map(d => d / 255); //normalize

    const canvas = tf.tensor(withoutAlpha, [size, size, 3]);
    return canvas;
}

class Classifier {

    constructor() {
        this.thisRef = this;

        /**
         * @type {CustomClassifier}
         */
        this.knnClassifier = undefined;
        /**
         * @type {NumbersClassifier}
         */
        this.numbersClassifier = undefined;
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<CustomClassifier>}
     */
    async init(name) {

        console.log('backend: ' + tf.getBackend());
        const tags = await database.getTags();

        this.knnClassifier = this.setClassifier(classifier.create(), await mobilenetModule.load(), name);
        this.numbersClassifier = new NumbersClassifier(name + 'numbers');

        console.log('laoding weights');
        const [dbWeightsTags, dbWEightsNumber] = await Promise.all([database.getWeights(this.knnClassifier), database.getWeights(this.numbersClassifier)]);
        if(dbWeightsTags.length === 0 || dbWEightsNumber.length === 0) {
            console.log('pretraining');
            await this.preTrain();
        } else {
            this.setWeights(dbWeightsTags, this.knnClassifier);
            this.numbersClassifier.setClassifierDataset(dbWEightsNumber);

        }
        this.knnClassifier.tags = tags;
        console.log('loaded classifier');
        return this.knnClassifier;
    }
    /**
     *
     * @param {*} weights
     * @param {CustomClassifier} knnClass
     */
    setWeights(weights, knnClass) {
        /**
        * @type {{[key:string]:import("@tensorflow/tfjs").Tensor2D}}
        */
        let weightsNUmbers = {};
        console.log('setting weights');
        weights.forEach(element => {
            try {
                const tensorArray = JSON.parse(element.modelvalue);
                weightsNUmbers[element.modelkey] = tf.tensor(tensorArray, [tensorArray.length / 1024, 1024]);
            } catch(e) {
                debugger;
            }
        });
        knnClass.setClassifierDataset(weightsNUmbers);
    }

    async trainExamples() {
        running = true;

        while(examples.length > 0) {
            const example = examples.shift();
            await database.addExample(example, this.knnClassifier);

            this.addExampleToClassifier(example.tags, example.image);
            console.log('added examples ' + JSON.stringify(example.tags));
        }

        await Promise.all([database.save(this.knnClassifier), database.save(this.numbersClassifier)]);
        running = false;
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
                console.error('commented');
                //await this.numbersClassifier.addExample(obj.tag, obj.image);
            }
            console.log('finished numbers traingin numbers');
            //await database.save(numbers);
            res();
        });
    }

    async preTrain() {

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

                    // Pass the intermediate activation to the classifier.

                    await this.addExampleToClassifier(imageElement.tags.map(t => t.tag_name)
                        .filter(t => isNaN(+t)), imageDataArray);
                    //console.log('added example ' + JSON.stringify(imageElement.tag_name));

                    const frameData = new Buffer(160 * 160 * 4);
                    for(let i = 0; i < imageDataArray.length; i++) {
                        frameData[i] = imageDataArray[i];
                    }
                    const rawImageData = {
                        data: frameData,
                        width: 160,
                        height: 160,
                    };
                    const jpegImageData = jpeg.encode(rawImageData, 80);
                    const currentTag = imageElement.tags.map(t => t.tag_name).find(t => !isNaN(+t));
                    if(!currentTag) {
                        continue;
                    }
                    const hash = c.createHmac('sha512', 'whatever');
                    hash.update(JSON.stringify(rawImageData));
                    const filenmae = hash.digest('hex');

                    await new Promise((res) => {
                        fs.exists(`D:/vm/dockervm/storage/py/tensorflow/${currentTag}`, (e) => {
                            if(!e) {
                                fs.mkdir(`D:/vm/dockervm/storage/py/tensorflow/${currentTag}`, () => {
                                    fs.writeFileSync(`D:/vm/dockervm/storage/py/tensorflow/${currentTag}/${filenmae}.jpg`, jpegImageData.data);
                                    res();
                                });
                            } else {
                                fs.writeFileSync(`D:/vm/dockervm/storage/py/tensorflow/${currentTag}/${filenmae}.jpg`, jpegImageData.data);
                                res();
                            }
                        });
                    });

                }
                await this.numbersClassifier.addExample(data
                    .filter(d => d.tags.some(t => !isNaN(+t.tag_name)))
                    .map(d => {

                        return ({ img: JSON.parse(d.imagedata), tag: d.tags.find(tag => !isNaN(+tag.tag_name)).tag_name });
                    }
                    ));
                console.log(`finsihed adding ${count} / ${tagCount} items`);
            }
        } catch(e) {
            if(e !== 'no more') {
                throw e;
            } else {
                console.log('no more data to add');
            }
        }
        await Promise.all([database.save(this.numbersClassifier), database.save(this.knnClassifier)]);

    }
    /**
     * @param {Array<string>} tags
     * @param {Array<number> } imageDataArray
     */
    async addExampleToClassifier(tags, imageDataArray) {
        for(let tag of tags) {
            if(isNaN(+tag)) {
                const imageTensor = getImageTensor(imageDataArray);
                this.addExampleClass(tag, imageTensor, this.knnClassifier);
                imageTensor.dispose();
            } else {
                this.numbersClassifier.addExample([{ img: imageDataArray, tag: tag }]);
            }
        }
    }

    /**
     *
     * @param {string} classId
     * @param {*} img
     * @param {CustomClassifier} knnC
     */
    addExampleClass(classId, img, knnC) {
        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        // @ts-ignore
        const activation = knnC.mobilenet.infer(img, 'conv_preds');

        // Pass the intermediate activation to the classifier.
        knnC.addExample(activation, classId);
        activation.dispose();
    }

    /**
  *
  * @param {import("@tensorflow-models/mobilenet").MobileNet} net
  * @param {string} name
  */
    setClassifier(knnC, net, name) {
        knnC.mobilenet = net;
        knnC.name = name;
        return knnC;
    }

    /**
     * @param {Array<number>} imageData length 102399
     * @returns {Promise<evalResponse>}
     */
    async evaluate(imageData) {
        const canvas = getImageTensor(imageData);
        /**
         * @type {any}
         */
        const inertype = 'conv_preds';
        const activation = this.knnClassifier.mobilenet.infer(canvas, inertype);
        canvas.dispose();
        const result = await this.knnClassifier.predictClass(activation, 10);
        const resultNumbers = await this.numbersClassifier.predict(imageData);
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
        best5.push({ tag: resultNumbers.label, prob: resultNumbers.confidences[resultNumbers.label] });
        return best5.filter(el => el.prob > 0);
    }

    /**
    * @param {Array<{
    *   tags:Array<string>,
    *   chosen:boolean,
    *   image:Array<number>
    * }>} exampleArray
    */
    async addExample(exampleArray) {
        exampleArray.forEach(example => {
            examples.push(example);
        });

        if(!running) {
            this.trainExamples();
        }
    }
    async dbtest() {
        return database.test();
    }

}

module.exports = new Classifier();