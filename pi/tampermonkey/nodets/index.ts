import { config } from 'dotenv';
import { updateDatabase } from 'hibernatets';
import { initialize } from './express-wrapper';
//import * as express from 'express';

console.log('server.ts iniz');

const env = config({
    path: __dirname + '/.env'
});
if (env.error) {
    throw env.error;
}
console.log(env.parsed);

updateDatabase(__dirname + '/models')
    .then(() => {
        initialize(__dirname + '/resources', {
            prereesources: app => {
                app.use((req, res, next) => {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                    next();
                });
            },
            allowCors: true,
            public: __dirname + '/public'
        });
    });

/*

app.get('/dbtest', async (req, res) => {
    res.send('helloo worl.d');
});
*/
process.on('SIGHUP', () => {
    console.log('sighup');
});
