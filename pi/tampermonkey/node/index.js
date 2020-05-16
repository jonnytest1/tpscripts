/*import * as classifier from '@tensorflow-models/knn-classifier';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';*/

require('dotenv')
    .config({ path: __dirname + '/.env' });
console.log('loading reqire');
const express = require('express');
const classifier = require('./classifier');
const database = require('./database');

const dbName = 'knnAnimeTest';

classifier.init(dbName)
    .then(startWebServer);

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
    app.get('/dbtest', databaseTest);
    app.post('/trainrandomnumbers', async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        classifier.randomNumbers(req.body);
        res.send('done');
    });

    app.post('/eval', evaluateImage);
    app.post('/add', addExample);

    app.get('/examples', async (req, res) => {
        try {

            const data = await database.getExamples(+req.query.min);
            res.send(data);
        } catch(e) {
            res.send({ data: [] });
        }
    });
    console.log('registered server');
}

/**@type {import("express").RequestHandler} */
async function databaseTest(req, res) {
    const response = await classifier.dbtest();
    res.send(response);
}

/**@type {import("express").RequestHandler} */
async function evaluateImage(request, response) {
    const evaluation = await classifier.evaluate(request.body);
    console.log('image evauluated to ' + JSON.stringify(evaluation));
    response.send(evaluation);
}

/**@type {import("express").RequestHandler} */
async function addExample(request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    classifier.addExample(request.body);
    response.send('done');
}