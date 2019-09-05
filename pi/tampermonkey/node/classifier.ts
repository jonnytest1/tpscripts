
const knnClassifier = require('@tensorflow-models/knn-classifier');
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import { ArrayMap } from '@tensorflow/tfjs-core/dist/types';

import { DataBase } from './database';

const { createCanvas } = require('canvas');

const tf = require('@tensorflow/tfjs-node');

const database = new DataBase();

export interface EvalResponse extends Array<{ tag: string, prob: number }> {

}

export interface Example {
    tags: Array<string>;
    chosen: boolean;
    image: Array<number>;

}

export class Classifier {

    public knnClassifier: any;

    private mobilenet;

    public tags;
    public name;

    public addExampleClass(classId: string, img) {

        const activation = this.mobilenet.infer(img);//'conv_preds'
        this.knnClassifier.addExample(activation, classId);
        activation.dispose();
    }

    async addExample(example: Example): Promise<void> {
        await database.addExample(example, this);

        const canvas = this.getCanvas(example.image);

        for (let tag of example.tags) {
            const tagId = this.getTagId(tag);
            this.addExampleClass(tagId, canvas);
        }
        console.log('added examples ' + JSON.stringify(example.tags));
        database.save(this);
    }

    private getCanvas(iamgeData: Array<number>) {
        const size = Math.sqrt(iamgeData.length) / 2;
        // const iD = tf.tensor(example.image, [size, size, 4]);
        const canvas = createCanvas(size, size);
        const context = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;
        let iD = context.createImageData(size, size);
        for (let i = 0; i < iamgeData.length; i++) {
            iD.data[i] = iamgeData[i];
        }
        context.putImageData(iD, 0, 0);

        return canvas;
    }

    async  evaluate(imageData: Array<number>): Promise<EvalResponse> {
        const canvas = this.getCanvas(imageData);

        // @ts-ignore
        const activation = knnClassifier.mobilenet.infer(canvas, 'conv_preds');
        const result = await this.knnClassifier.predictClass(activation);
        activation.dispose();
        /**
         * @type {Array<{percent:number,i:string}>}
         */
        let results = [];
        for (let i in result.confidences) {
            results.push({ i: i, percent: result.confidences[i] });
        }
        results.sort((a, b) => b.percent - a.percent);

        const best5 = [];
        for (let i = 0; i < 3; i++) {
            best5.push({ tag: this.getTagName(results[i].i), prob: results[i].percent });
        }

        return best5;
    }

    private getTagName(tagId) {
        for (let tag of this.tags) {
            if (tag.tag_id + '' === tagId + '') {
                return tag.tag_name;
            }
        }
    }

    private getTagId(tagName) {
        for (let tag of this.tags) {
            if (tag.tag_name === tagName) {
                return tag.tag_id;
            }
        }
    }

    public async dbtest() {
        return database.test();
    }

    static async load(name: string): Promise<Classifier> {
        const classifier = new Classifier();

        const tags = await database.getTags();
        classifier.knnClassifier = knnClassifier.create();
        // Load mobilenet.
        classifier.mobilenet = await mobilenetModule.load();
        let weights = {};

        const dbWeights = await database.getWeights('knnAnime');
        if (dbWeights.length === 0) {
            const dataSet = await database.getExamples();

        }
        dbWeights.forEach(element => {
            try {
                const tensorArray = JSON.parse(element.modelvalue);
                weights[element.modelkey] = tf.tensor(tensorArray, [tensorArray.length / 1024, 1024]);
            } catch (e) {
                debugger;
            }
        });

        classifier.knnClassifier.setClassifierDataset(weights);
        //  knnClassifier = this.addClassifier(knn, mobilenet);
        classifier.name = name;
        classifier.tags = tags;
        console.log('loaded classifier');
        return classifier;

    }

}
