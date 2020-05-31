import HTTP from 'http';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import connectRedis from 'connect-redis';
import redis from 'redis';
import morgan from 'morgan';

import ws from './ws';
import config from './config';
import router from './routes';
import sql from './database/sql';
import { sequelize } from './models';

const RedisStore = connectRedis(session);

const app = express();

/* HTTP requests logging */
app.use(morgan('tiny'));

/* CORS mode */
app.use(
  cors({
    origin: function (_, callback) {
      /* For all origins */
      return callback(null, true);
    },
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  })
);

/* Body parsing */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Session initialization */
const client = redis.createClient(config.redis);
const store = new RedisStore({ client });

//@ts-ignore
const sessionParser = session({
  store,
  ...config.session,
});

/* Request session mixin */
app.use(sessionParser);

/* Routes entry point */
app.use(router);

/* Server transports initialization */
const http = HTTP.createServer(app);
ws.attach(http, sessionParser);

/* Checking ORM availability */
(async () => {
  const {
    pg: {
      options: { sync, alter },
    },
    port,
  } = config;

  await sequelize.authenticate();
  await sequelize.sync({ ...sync, alter });
  await sql.init(sequelize);

  http.listen(port, () => {
    console.log(`Express server's been started on port: ${port}`);
    console.log(`WebSocket server's been started on port: ${port}`);
  });
})().catch(console.error);
