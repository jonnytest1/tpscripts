const tf = require('@tensorflow/tfjs-node');
class NumbersClassifier {

    constructor(name) {
        this.name = name;

        /**
         * @type {import("@tensorflow/tfjs-node").Sequential }
         */
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({
            units: 50,
            inputShape: [25600],
            useBias: true,
            activation: 'relu'
        }));
        this.model.add(tf.layers.dense({
            units: 70,
            useBias: true,
            activation: 'relu',
        }));
        this.model.add(tf.layers.dense({
            units: 10,
            useBias: true,
            activation: 'softmax'
        }));
        this.model.compile({
            optimizer: tf.train.adam(),
            metrics: ['accuracy'],
            loss: 'categoricalCrossentropy'
        });
    }

    /**
     * @param {Array<{
     *   modelkey: string;
     *   modelvalue: string;
     *   }>} weights
     */
    setClassifierDataset(weights) {
        let weightArray = [];
        let layerIndex = 0;
        let weightsindex = 0;
        for(let i in weights) {
            const layer = this.model.layers[layerIndex];
            let layerWeights = layer.weights[weightsindex];
            if(!layerWeights) {
                layerIndex++;
                weightsindex = 0;
                layerWeights = this.model.layers[layerIndex].weights[weightsindex];
            }
            const el = weights[i];
            if(!isNaN(+el.modelkey)) {
                weightArray.push(tf.tensor(JSON.parse(el.modelvalue)).reshape(layerWeights.shape));
                weightsindex++;
            }

        }
        this.model.setWeights(weightArray);
    }
    /**
     *
     * @param {Array<number>} data
     * @returns {import("@tensorflow/tfjs-node").Tensor1D}
     */
    prepareImageData(data) {
        const colorPixels = data.filter((e, i) => (i + 1) % 4 !== 0);
        const dataAr = [];
        for(let i = 0; i < colorPixels.length; i += 3) {
            dataAr.push((colorPixels[i] + colorPixels[i + 1] + colorPixels[i + 2]) / (3 * 255));
        }
        return tf.tensor([dataAr]);
    }

    /**
     *
     * @param {string} tag
     * @param {Array<number>} imageData
     */
    async addExample(tag, imageData) {
        let tagArray = [];
        for(let i = 0; i < 10; i++) {
            if((i + '') === tag) {
                tagArray.push(1);
            } else {
                tagArray.push(0);
            }
        }

        const tagTensor = tf.tensor([tagArray]);
        await this.model.fit(this.prepareImageData(imageData), tagTensor, {
            epochs: 30
        });
        tagTensor.dispose();
    }

    /*     /**
     * @param {Array<number>} iamgeData

    function getNumbersTensor(iamgeData) {
        const size = Math.sqrt(iamgeData.length / 4);
        const withoutAlpha = iamgeData
            .filter((d, i) => (i + 1) % 4 !== 0)//remove alpha
            .map(d => d / 255); //normalize
        const greyscale = [];
        for(let i = 0; i < withoutAlpha.length; i += 3) {
            const grey = (withoutAlpha[i] + withoutAlpha[i + 1] + withoutAlpha[i + 2]) / 3;
            greyscale.push(grey);
            greyscale.push(grey);
            greyscale.push(grey); //hardcoded 3 in model
        }

        const canvas = tf.tensor(greyscale, [size, size, 3]);
        return canvas;
    }
    */

    /**
     * @param {Array<number>} imageData
     * @returns {Promise<any>}
     */
    async predict(imageData) {
        const dataTensor = this.prepareImageData(imageData);
        /**
         * @type {import("@tensorflow/tfjs-node").Tensor}
         */
        //@ts-ignore
        const prediction = this.model.predict(dataTensor);
        dataTensor.dispose();
        const data = await prediction.data();
        prediction.dispose();
        const confidences = {};
        let highest = -1;
        let highestVal;
        data.forEach((e, i) => {
            if(e > highest) {
                highest = e;
                highestVal = i;
            }
            return confidences[i] = e;
        });
        return {
            label: highestVal,
            confidences
        };
    }

    /**
     * @returns {Promise<Array<any>>}
     */
    async getClassifierDataset() {
        return Promise.all(this.model.getWeights()
            .map(t => t.data()));
    }
}

module.exports = { NumbersClassifier };