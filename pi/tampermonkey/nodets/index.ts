import * as express from 'express';
console.log('index.ts');

const app = express();

app.listen(8080, '0.0.0.0');
app.use(express.static('public'));
app.use(express.json({ limit: '800mb' }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/dbtest', async (req, res) => {
    res.send('helloo worl.d');
});
