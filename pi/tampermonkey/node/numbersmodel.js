const tf = require('@tensorflow/tfjs-node');
class NumbersClassifier {

    constructor(name) {
        this.name = name;

        /**
         * @type {import("@tensorflow/tfjs-node").Sequential }
         */
        this.model = tf.sequential({

        });
        this.model.add(tf.layers.conv2d({
            inputShape: [160, 160, 3],
            filters: 60,
            kernelSize: 5,
            activation: 'relu'
        }));
        this.model.add(tf.layers.maxPool2d({
            poolSize: [2, 2]
        }));
        this.model.add(tf.layers.conv2d({
            filters: 32,
            kernelSize: 3,
            activation: 'relu'
        }));
        this.model.add(tf.layers.maxPool2d({
            poolSize: [2, 2]
        }));
        this.model.add(tf.layers.flatten());
        this.model.add(tf.layers.dense({
            units: 64,
            activation: 'relu'
        }));
        this.model.add(tf.layers.dense({
            units: 10,
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
            while(!layerWeights) {
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
     * greyscale tensor normalized ohne alpha
     * @param {Array<{img:Array<number>}>} data
     * @returns {import("@tensorflow/tfjs-node").Tensor1D}
     */
    prepareImageData(data) {
        return tf.tensor(data.map(sinleData => {
            const w = [];
            for(let i = 0; i < 160; i++) {
                const rowI = w.push([]) - 1;
                for(let j = 0; j < 160; j++) {
                    let index = ((i * 4) * 160) + (j * 4);
                    //skip alpha
                    w[rowI].push([sinleData.img[index] / 255, sinleData.img[index + 1] / 255, sinleData.img[index + 2] / 255]);
                }
            }
            return w;
        }));
    }

    /**
     *
     * @param {Array<{img:Array<number>,tag:string}>} data
     */
    async addExample(data) {
        const tagTensor = tf.tensor(data.map(singleData => {
            let tagArray = [];
            for(let i = 0; i < 10; i++) {
                if((i + '') === singleData.tag) {
                    tagArray.push(1);
                } else {
                    tagArray.push(0);
                }
            }
            return tagArray;
        }));
        await this.model.fit(this.prepareImageData(data), tagTensor, {
            epochs: 3,
        });
        tagTensor.dispose();
    }

    /**
     * @param {Array<number>} imageData
     * @returns {Promise<any>}
     */
    async predict(imageData) {
        const dataTensor = this.prepareImageData([{ img: imageData }]);
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