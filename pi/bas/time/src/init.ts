import { config } from 'dotenv';
import * as express from 'express';
import { LDAP } from './helper/ldap';

config({ path: __dirname + '/.env' });

console.log('index.ts');

const app = express();

app.listen(8080, '0.0.0.0', () => {

    console.log('server started');
});

app.use(express.json({ limit: '800mb' }));
app.use(express.urlencoded());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if ((req.path !== '/login' && req.path !== '/login/') && !new LDAP().isAuthenticated(req.headers)) {
        res.status(307);
        res.header('Location', '/login');
    }
    next();
});
//app.use(express.text());
app.use(express.static(__dirname + '/public'));
app.post('/login', async (req, res) => {

    const cookie = await new LDAP().login(req.body)
        .catch(err => {
            res.redirect('/login?error');
        });
    if (cookie) {
        res.cookie('Authorization', cookie);
        res.redirect('/');

    }

});
