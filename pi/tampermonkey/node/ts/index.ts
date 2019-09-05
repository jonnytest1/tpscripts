import { Classifier } from './Classifier';

console.log('loading reqire');

const express = require('express');
const dbName = 'knnAnimeTest';

let classifier: Classifier;

Classifier.load(dbName)
  .then(res => {
    classifier = res;
    console.log('loaded classifier');
    startWebServer();
  });

function startWebServer() {
  const app = express();
  app.listen(8080, 'localhost');
  app.use(express.static('public'));
  app.use(express.json({ limit: '800mb' }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  app.post('/eval', evaluateImage);
  app.post('/add', addExample);
  app.get('/dbtest', async (req, res) => {
    const response = await classifier.dbtest();
    res.send(response);
  });
}
async function evaluateImage(request, response): Promise<void> {
  const evaluation = await classifier.evaluate(request.body);
  response.send(evaluation);
}
function addExample(request, response) {
  response.header('Access-Control-Allow-Origin', '*');
  classifier.addExample(request.body);
  response.send('done');
}
