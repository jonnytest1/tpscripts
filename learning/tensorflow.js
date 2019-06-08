/// <reference path="../BASE.js" />
/**
 * @type {HTMLOrSVGScriptElement & CustomScript } 
 */
const tfScript = document.currentScript;
tfScript.isAsync = true;
let tfs = document.createElement("script");
tfs.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest";
document.head.appendChild(tfs);

class NeuralWrapper {

    /** 
     * @typedef GeneticImplementation
     * @property {()=>TensorObject} getTensor 
     * @property {(prediction:Array<number>)=>number} getReward 
     * 
     * 
     * /
     
    
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
    constructor(type = "sequential", options = {}) {
        if (type == "sequential") {
            this.model = tf.sequential();
        }
        this.layers = [];
        this.options = options;
        this.mutation = options.mutation || 0.1
        this.decrease = options.decrease || 0.95;

    }

    dispose() {
        this.model.dispose();
    }

    /**@param {TensorObject} tensor */
    predict(tensor) {
        const prediction = tf.tidy(() => {
            const reshaped = tensor.reshape([1, ...this.layers[0].options.inputShape])
            return this.model.predict(reshaped);
        });
        return prediction.dataSync();
    }

    addLayer(type, options) {
        this.layers.push({ type: type, options: options });
        this.model.add(tf.layers[type](options));
    }

    copy() {
        return this.mutate((x) => x);
    }
    mutate(func = this.mutateWeight) {
        return tf.tidy(() => {
            const model = new NeuralWrapper(undefined, this.options);
            for (let layer of this.layers) {
                model.addLayer(layer.type, layer.options);
            }
            const w = this.model.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < w.length; i++) {
                let shape = w[i].shape;
                let arr = w[i].dataSync().slice();
                for (let j = 0; j < arr.length; j++) {
                    arr[j] = func.call(this, arr[j]);
                }
                let newW = tf.tensor(arr, shape);
                mutatedWeights[i] = newW;
            }
            model.mutation = Math.max(0.1, this.decrease * this.mutation);
            // console.log("mutation rate: " + this.mutation);
            model.model.setWeights(mutatedWeights);
            return model;
        });
    }

    mutateWeight(x) {
        if (random(1) < this.mutation) {
            let offset = randomGaussian();
            return x + offset;
        } else {
            return x;
        }
    }

    static denseFromExample(example, hidden = 10, outputs = 2) {
        if (example instanceof Array) {
            example = tf.tensor(example);
        }
        const nn = new NeuralWrapper();
        nn.addLayer("dense", {
            units: hidden,
            inputShape: example.shape,
            activation: 'sigmoid'
        });
        nn.addLayer("dense", {
            units: outputs,
            activation: 'sigmoid'
        });
        return nn;
    }
}

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
    predict(object) {
        const prediction = super.predict(tensor);
        this.score = object.getReward(prediction.test());
        return result;
    }

    static denseFromExample(example, hidden = 10, outputs = 2) {
        if (example instanceof Array) {
            example = tf.tensor(example);
        }
        const nn = new GeneticNeuralWrapper();
        nn.addLayer("dense", {
            units: hidden,
            inputShape: example.shape,
            activation: 'sigmoid'
        });
        nn.addLayer("dense", {
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
        this.amount = amount
        /**
         * @type {Array<GeneticNeuralWrapper>}
         */
        this.models = [];


        /**
         * 
         * @type {Array<T>}
         */
        this.objects = []
        for (let i = 0; i < this.amount; i++) {
            const object = objectContructor(i);
            this.objects.push(object);
            this.models.push(GeneticNeuralWrapper.denseFromExample(this.objects[i].getTensor(), hiddenLayers, 2))
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
            let afterEach = options.afterEach || (() => { });
            for (let i = 0; i < this.amount; i++) {
                let object = this.objects[i];
                let model = this.models[i];

                if (shouldPredict(object, i)) {
                    model.predict(object);
                }
                afterEach(object, model, i);
            }

            if (options.forBest) {
                /**
                 * @type {T} object
                 */
                let obj;
                let model;
                let index = -1;
                for (let i = 0; i < this.amount; i++) {
                    const mdl = this.models[i];
                    let object = this.objects[i];
                    if (mdl.score > model.score) {
                        model = mdl;
                        obj = object;
                        index = i;
                    }
                }
                options.forBest(obj, model, index);
            }


        })
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
        let forBest = options.forBest || (() => { });
        let reset = options.reset || (() => { });

        function addFitness() {
            let fitnessSum = 0;

            /**
             * @type {Array<GenerationNeuralWrapper>}
             */
            const models = this.models;
            for (let model of models) {
                model.fitness = fitnessFucntion(model.score);
                fitnessSum += model.fitness;
            }
            for (let model of models) {
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
             * @type GeneticImplementation
             */
            let bestObject
            /**
             * @type {Array<GenerationNeuralWrapper>}
             */
            const models = this.models;
            for (let i = 0; i < models.length; i++) {
                let model = models[i];
                if (!bestModel || model.fitness > bestModel.fitness) {
                    bestModel = model;
                    bestObject = this.objects[i];

                }
                reset(this.objects[i], i);
            }
            forBest(bestObject, bestModel);
            for (let model of this.models) {
                let r = random(1);
                let index = 0;
                while (r > 0) {
                    r -= models[index].fitness;
                    // And move on to the next
                    index++;
                }
                index--;
                newArray.push(models[index].mutate());
                // newArray.push(bestModel.mutate());
            }

            for (let model of this.models) {
                model.dispose();
            }
            return newArray
        }

        tf.tidy(() => {
            addFitness.call(this);
            console.log(this.models[0].mutation)
            this.models = pick.call(this);
        });
    }
}
window.NeuralWrapper = NeuralWrapper;

tfs.onload = (e) => {
    if (e.isAsync) {
        return;
    }
    finished(undefined, true, tfScript);
}