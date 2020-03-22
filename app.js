'use strict';

const http = require('http')
    , express = require('express')
    , cors = require('cors')
    , session = require('express-session')
    , RedisStore = require('connect-redis')(session)
    , redis = require('redis')
    , morgan = require('morgan');

const config = require('./config')
    , router = require('./routes')
    , { sequelize } = require('./models')
    , sqlScripts = require('./database/sql')
    , ws = require('./helpers/ws');

const app = express();

//HTTP requests logging
app.use(morgan('tiny'));

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

//Routes entry point
app.use(router);

const server = http.createServer(app);
ws.attach(server, sessionParser);

//Checking ORM availability
(async _ => {
    const { pg, port } = config;

    await sequelize.authenticate();
    await sequelize.sync(pg.options);
    await sqlScripts.init(sequelize);

    server.listen(port, _ => {
        console.log(`Express server's been started on port: ${ port }`);
    });
})().catch(console.error);
