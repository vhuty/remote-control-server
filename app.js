'use strict';

const http = require('http')
    , express = require('express')
    , cors = require('cors')
    , session = require('express-session')
    , RedisStore = require('connect-redis')(session)
    , redis = require('redis')
    , morganBody = require('morgan-body');

const config = require('./config')
    , router = require('./routes')
    , { sequelize } = require('./models')
    , scripts = require('./database/sql')
    , ws = require('./helpers/ws');

const app = express();

//HTTP requests logging
morganBody(app);

//CORS mode
app.use(cors({
    origin: function (_, callback) {
        //For all origins
        return callback(null, true);
    },
    credentials: true,
    exposedHeaders: [ 'Set-Cookie' ]
}));

//Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Session initialization
const client = redis.createClient(config.redis);
const store = new RedisStore({ client });

const sessionParser = session({
    store,
    ... config.session
});

app.use(sessionParser);

app.get('/qwe123/', (req, res, next) => {
    next();
});

app.get('/desk/', (req, res, next) => {
    req.session.cookie.path = '/qwe456/';

    req.session.a = 12;

    next();
});

app.get('/desk2/', (req, res, next) => {
    req.session.cookie.path = '/qwe123/';

    req.session.token = {
        sourceId: '459f523c-60e4-4ad5-b578-4835f4a6175a'
    };

    res.end();
});

// app.get('/dev/', (req, res, next) => {
//     req.session.token = { sourceId: 'adsasdasdasdasd' };
//     res.end();
// });

// app.get('/ctrl/', (req, res, next) => {
//     req.session.token = { sourceId: '12j1h3jkg12kjh1', targetId: 'adsasdasdasdasd' };
//     res.end();
// });

//Routes entry point
app.use(router);

const server = http.createServer(app);
ws.attach(server, sessionParser);

//Checking ORM availability
(async _ => {
    await sequelize.authenticate();
    await sequelize.sync(config.pg.options);
    await scripts.init(sequelize);

    server.listen(config.port, _ => {
        console.log(`Express server's been started on port: ${ config.port }`);
    });
})().catch(console.error);
