import { config } from 'dotenv';
import { initialize } from 'express-hibernate-wrapper';
import * as session from 'express-session';
import { updateDatabase } from 'hibernatets';
import passport = require('passport');
import * as auth from './credentials/auth';
const hbs = require('hbs');

config({
    path: __dirname + '/.env'
});

updateDatabase(__dirname + '/resources/mapserver/models')
    .then(() => {
        initialize(__dirname + '/resources', {
            allowCors: true,
            prereesources: app => {
                app.set('view engine', 'html');
                app.engine('html', hbs.__express);
                app.set('views', './views');
                app.use(passport.initialize());
                app.use(passport.session());

                /* app.use(session({
                     secret: 'secret', // You should specify a real secret here
                     resave: true,
                     saveUninitialized: false,
                     proxy: true,
                     cookie: {
                         httpOnly: true
                     }
                 }));*/
            }, postresource: app => {
                app.use('/auth', auth.default);
            },
            public: __dirname + '/public'
        })
            .then(() => {
                console.log('started');

            });
    });
