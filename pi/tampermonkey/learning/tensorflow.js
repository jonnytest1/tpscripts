/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../customTypes/p5_types.d.ts" />
/// <reference path="../customTypes/tensorflow.d.ts" />
/// <reference path="../DOM/progress-overlay.js" />
/**
 * @type {HTMLOrSVGScriptElement & CustomScript }
 */
const tfScript = document.currentScript;
tfScript.isAsync = true;
let tfs = document.createElement('script');
tfs.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest';
document.head.appendChild(tfs);

/**
 * @typedef {Array<any>|ImageData|TensorObject} TensorAble
 */
class NeuralWrapper {

    /**
     *
     * @typedef NeuralWrapperOption
     * @property {number} [mutation]
     * @property {number} [decrease]
     */

    /**
     * NeuralWrapper
     * @param {string} type
     * @param {NeuralWrapperOption} options
     */
    constructor(type = 'sequential', options = {}) {
        if(type === 'sequential') {
            this.model = tf.sequential();
        }
        this.type = type;
        /** @type {Array<Layer>} */
        this.layers = [];
        this.options = options;
        this.mutation = options.mutation || 0.1;
        this.decrease = options.decrease || 0.95;

    }

    dispose() {
        this.model.dispose();
    }

    /**@param {TensorObject} tensor */
    predict(tensor) {
        const prediction = tf.tidy(() => {
            const reshaped = NeuralWrapper.toTensor(tensor)
                .reshape([1, ...this.layers[0].options.inputShape]);
            return this.model.predict(reshaped)
                .dataSync();
        });
        return prediction;
    }
    /**
     *
     * @param {*} tensor
     * @param {*} array2
     * @param {fitOptions & { progressMonitor?: ProgressOverlayOptions } } options
     * @param {boolean} [dispose]
     */
    async fit(tensor, array2, options = {}, dispose = true) {

        tensor = NeuralWrapper.toTensor(tensor);

        const tensor2 = NeuralWrapper.toTensor(array2);

        let tensor2Reshaped;

        if(this.layers[this.layers.length - 1].options && array2[0].length === undefined) {
            tensor2Reshaped = tensor.reshape([1, this.layers[this.layers.length - 1].options.units]);
            tensor2.dispose();
        } else {
            tensor2Reshaped = tensor2;
        }

        let batchSize;

        if(this.layers[0].options) {
            /** */
            const shape = this.layers[0].options.inputShape;
            const layerShape = shape.reduce((a, b) => a * b, 1);
            const inputShape = tensor.shape.reduce((a, b) => a * b, 1);
            if(layerShape === inputShape) {
                const reshaped = tensor.reshape([1, ...this.layers[0].options.inputShape]);
                tensor.dispose();
                tensor = reshaped;
            }
        }

        if(options.progressMonitor) {
            if(options.epochs) {
                options.progressMonitor.max = options.epochs + 1;
            }

            if(!options.callbacks) {
                options.callbacks = {};
            }
            if(!options.callbacks.onBatchEnd) {
                options.callbacks.onBatchEnd = () => {
                    options.progressMonitor.count++;
                };
            }
        }

        const fitHistory = await this.model.fit(tensor, tensor2Reshaped, options);

        if(options.progressMonitor) {
            const avgAcc = fitHistory.history.acc.reduce((a, b) => a + b, 0) / fitHistory.history.acc.length;
            options.progressMonitor.text = `acc: ${avgAcc.toFixed(2)}`;
            options.progressMonitor.count++;
        }

        if(dispose) {
            tensor2Reshaped.dispose();
            tensor.dispose();
            tensor2.dispose();
        }
        return fitHistory;
    }

    /**
     *
     * @param {'reLU'|'dense'|'conv2d'|'maxPooling2d'|'flatten'} type
     * @param {LayerOptions} [options]
     */
    addLayer(type, options) {
        this.layers.push({ type: type, options: options });
        const layer = tf.layers[type](options);
        this.model.add(layer);
        return layer;
    }

    copy() {
        return this.mutate((x) => x);
    }

    mutate(func = this.mutateWeight) {
        return tf.tidy(() => {
            /**@type {any} */
            const constructor = this.constructor;
            const model = new constructor(this.type, this.options);
            for(let layer of this.layers) {
                model.addLayer(layer.type, layer.options);
            }
            const w = this.model.getWeights();
            const mutatedWeights = [];
            for(let i = 0; i < w.length; i++) {
                let shape = w[i].shape;
                let arr = w[i].dataSync()
                    .slice();
                for(let j = 0; j < arr.length; j++) {
                    arr[j] = func.call(this, arr[j]);
                }
                let newW = tf.tensor(arr, shape);
                mutatedWeights[i] = newW;
            }
            model.mutation = Math.max(0.1, this.decrease * this.mutation);

            model.model.setWeights(mutatedWeights);
            return model;
        });
    }

    /**
     *
     * @param {tfCompileOptions} options
     */
    compile(options) {
        this.model.compile(options);
    }
    mutateWeight(x) {
        if(random(1) < this.mutation) {
            let offset = randomGaussian();
            return x + offset;
        } else {
            return x;
        }
    }

    static toTensor(element) {
        if(element instanceof Array) {
            return tf.tensor(element);
        } else if(element instanceof ImageData) {
            return tf.tensor([...element.data]);
        }
        throw 'cant parse to tensor';

    }

    static denseFromExample(example, hidden = 10, outputs = 2) {
        const nn = new NeuralWrapper();
        nn.addLayer('dense', {
            units: hidden,
            inputShape: NeuralWrapper.toTensor(example).shape,
            activation: 'sigmoid'
        });
        nn.addLayer('dense', {
            units: outputs,
            activation: 'sigmoid'
        });
        return nn;
    }

    static convFromExample(example, hidden = 10, outputs = 2, convolutions = 2) {
        const nn = new NeuralWrapper();
        nn.addLayer('conv2d', {
            units: hidden,
            inputShape: this.toTensor(example).shape,
            kernelSize: 5,
            filters: 10,
            strides: 4,
            activation: 'relu',
            kernelInitializer: 'VarianceScaling'
        });
        nn.addLayer('maxPooling2d', {
            poolSize: [2, 2],
            strides: [2, 2]
        });
        for(let i = 0; i < convolutions - 1; i++) {
            nn.addLayer('conv2d', {
                kernelSize: 5,
                filters: 10,
                strides: 4,
                activation: 'relu',
                kernelInitializer: 'VarianceScaling'
            });
            nn.addLayer('maxPooling2d', {
                poolSize: [2, 2],
                strides: [2, 2]
            });
        }
        nn.addLayer('flatten');
        nn.addLayer('dense', {
            units: hidden,
            kernelInitializer: 'VarianceScaling',
            activation: 'sigmoid'
        });
        nn.addLayer('dense', {
            units: outputs,
            kernelInitializer: 'VarianceScaling',
            activation: 'sigmoid'
        });
        return nn;
    }
    /**
     *
     * @param {TensorAble} example
     * @param {number} [hidden]
     * @param {number} [outputs]
     * @param {number} [convolutions]
     * @returns {NeuralWrapper}
     */
    static convImageFromExample(example, hidden = 10, outputs = 2, convolutions = 2) {
        const nn = new NeuralWrapper();
        nn.addLayer('conv2d', {
            units: hidden,
            inputShape: this.toTensor(example).shape,
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'VarianceScaling'
        });
        for(let i = 0; i < convolutions - 1; i++) {
            nn.addLayer('reLU', {
                poolSize: [2, 2],
                strides: [2, 2]
            });
            nn.addLayer('conv2d', {
                kernelSize: 5,
                units: hidden,
                filters: 20,
                strides: 1,
                activation: 'relu',
                kernelInitializer: 'VarianceScaling'
            });
            nn.addLayer('reLU', {
                poolSize: [2, 2],
                strides: [2, 2]
            });
            nn.addLayer('maxPooling2d', {
                poolSize: [2, 2],
                strides: [2, 2]
            });

        }
        nn.addLayer('flatten');
        nn.addLayer('dense', {
            units: outputs,
            kernelInitializer: 'VarianceScaling',
            activation: 'sigmoid'
        });
        nn.compile({
            optimizer: tf.train.adam(),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });
        return nn;
    }

    /**
     *
     * @param {TensorAble} example
     * @param {number} [hidden]
     * @param {number} [outputs]
     * @returns {NeuralWrapper}
     */
    static shapeDetector2D(example, hidden = 10, outputs = 2) {
        const nn = new NeuralWrapper();
        const inputshapeTEnsor = this.toTensor(example);
        /*   nn.addLayer('conv2d', {
              units: hidden,
              kernelSize: 20,
              filters: 60,
              inputShape: this.toTensor(example).shape,
              activation: 'relu',
              kernelInitializer: 'VarianceScaling'
          }); */
        //  nn.addLayer('flatten');
        //
        nn.addLayer('dense', {
            inputShape: inputshapeTEnsor.shape,
            units: hidden,
            useBias: true,
            activation: 'relu',
        });
        inputshapeTEnsor.dispose();
        nn.addLayer('dense', {
            units: hidden,
            useBias: true,
            activation: 'relu',
        });
        nn.addLayer('dense', {
            units: outputs,
        });
        nn.compile({
            optimizer: tf.train.adam(),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });
        return nn;
    }
}

/**
   * @typedef GeneticImplementation
   * @property {()=>TensorObject} getTensor
   * @property {(prediction:Array<number>)=>number} getReward
   *
   *
   */
class GeneticNeuralWrapper extends NeuralWrapper {

    constructor() {
        super();
        this.score = 0;
    }

    reward(amount) {
        this.score += amount;
    }

    /**
     * @param {GeneticImplementation} object
     */
    predictObject(object) {
        const prediction = super.predict(object.getTensor());
        this.score = object.getReward(prediction);
        return prediction;
    }

    static denseFromExample(example, hidden = 10, outputs = 2) {
        const nn = new GeneticNeuralWrapper();
        nn.addLayer('dense', {
            units: hidden,
            inputShape: NeuralWrapper.toTensor(example).shape,
            activation: 'sigmoid'
        });
        nn.addLayer('dense', {
            units: outputs,
            activation: 'sigmoid'
        });
        return nn;
    }

}
/**
 *
 * @template {GeneticImplementation} T
 *
 */
class NeuralGeneration {
    /**
     * @param {number} amount population size
     * @param {(index:number) => T } objectContructor
     * @param {number} hiddenLayers
     */
    constructor(amount, objectContructor, hiddenLayers) {
        this.amount = amount;
        /**
         * @type {Array<GeneticNeuralWrapper>}
         */
        this.models = [];

        /**
         *
         * @type {Array<T>}
         */
        this.objects = [];
        for(let i = 0; i < this.amount; i++) {
            const object = objectContructor(i);
            this.objects.push(object);
            this.models.push(GeneticNeuralWrapper.denseFromExample(this.objects[i].getTensor(), hiddenLayers, 2));
        }
    }
    /**
     *
     * @param {{
     *  shouldPredict?:(object?:T,index?:number)=>boolean
     *  afterEach?:(object?:T,model?:GeneticNeuralWrapper,index?:number)=>void
     *  forBest?:(object?:T,model?:GeneticNeuralWrapper,index?:number)=>void
     * }} [options]
     */
    frame(options = {}) {

        tf.tidy(() => {
            let shouldPredict = options.shouldPredict || (() => true);
            let afterEach = options.afterEach;
            for(let i = 0; i < this.amount; i++) {
                let object = this.objects[i];
                let model = this.models[i];

                if(shouldPredict(object, i)) {
                    model.predictObject(object);
                }
                if(afterEach) {
                    afterEach(object, model, i);
                }
            }

            if(options.forBest) {
                /**
                 * @type {T} object
                 */
                let obj;
                let model;
                let index = -1;
                for(let i = 0; i < this.amount; i++) {
                    const mdl = this.models[i];
                    let object = this.objects[i];
                    if(mdl.score > model.score) {
                        model = mdl;
                        obj = object;
                        index = i;
                    }
                }
                options.forBest(obj, model, index);
            }

        });
    }

    /**
     * @typedef {GeneticNeuralWrapper &{
     *  fitness?:number
     * }} GenerationNeuralWrapper
     *
     *
     * @typedef nextOptions
     * @property {(score:number)=>number} [fitnessFucntion] last value of getReward
     * @property {(bestObject:T,bestModel:GenerationNeuralWrapper)=>void} [forBest]
     * @property {(obj:T,index:number)=>void} [reset]
     *
     *
     * @param {nextOptions} [options]
     */
    nextGeneration(options = {}) {
        let fitnessFucntion = options.fitnessFucntion || (m => Math.pow(m, 2));
        let forBest = options.forBest;
        let reset = options.reset;

        function addFitness() {
            let fitnessSum = 0;

            /**
             * @type {Array<GenerationNeuralWrapper>}
             */
            const models = this.models;
            for(let model of models) {
                model.fitness = fitnessFucntion(model.score);
                fitnessSum += model.fitness;
            }
            for(let model of models) {
                model.fitness /= fitnessSum;
            }
        }

        //not picking the best but picking one of the better ones
        /**
         * @this NeuralGeneration
         */
        function pick() {
            let newArray = [];
            //no need to reference model

            /**
             * @type GenerationNeuralWrapper
             */
            let bestModel;

            /**
             * @type T
             */
            let bestObject;
            /**
             * @type {Array<GenerationNeuralWrapper>}
             */
            const models = this.models;
            for(let i = 0; i < models.length; i++) {
                let model = models[i];
                if(!bestModel || model.fitness > bestModel.fitness) {
                    bestModel = model;
                    bestObject = this.objects[i];

                }
                if(reset) {
                    reset(this.objects[i], i);
                }
            }
            if(forBest) {
                forBest(bestObject, bestModel);
            }
            for(let model of this.models) {
                let r = random(1);
                let index = 0;
                while(r > 0) {
                    r -= models[index].fitness;
                    // And move on to the next
                    index++;
                }
                index--;
                newArray.push(models[index].mutate());
                // newArray.push(bestModel.mutate());
            }

            for(let model of this.models) {
                model.dispose();
            }
            return newArray;
        }

        tf.tidy(() => {
            addFitness.call(this);
            console.log(this.models[0].mutation);
            this.models = pick.call(this);
        });
    }
}
window.NeuralWrapper = NeuralWrapper;

tfs.onload = (e) => {
    if(e.isAsync) {
        return;
    }
    finished(undefined, true, tfScript);
};