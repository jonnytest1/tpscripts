/*import * as classifier from '@tensorflow-models/knn-classifier';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';*/

console.log('loading reqire');
const express = require('express');
const classifier = require('./classifier');
require('dotenv')
    .config();
const dbName = 'knnAnimeTest';

classifier.getClassifier(dbName);

startWebServer();

function startWebServer() {
    const app = express();
    app.listen(8080, 'localhost');
    app.use(express.static('public'));
    app.use(express.json({ limit: '800mb' }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.post('/eval', evaluateImage);
    app.post('/add', addExample);
    app.get('/dbtest', async (req, res) => {
        const response = await classifier.dbtest();
        res.send(response);
    });
}
/**@type {import("express").RequestHandler} */
async function evaluateImage(request, response) {
    const evaluation = await classifier.evaluate(request.body);
    response.send(evaluation);
}
/**@type {import("express").RequestHandler} */
function addExample(request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    classifier.addExample(request.body);
    response.send('done');
}