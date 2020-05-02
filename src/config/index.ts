import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: resolve(process.cwd(), 'src', 'config', '.env'),
});

const { env } = process;

export default {
  NODE_ENV: env.NODE_ENV,
  host: env.HOST,
  port: env.PORT,
  domain: `localhost:${env.PORT}`,
  serverUri: `http://localhost:${env.PORT}`,
  session: {
    secret: env.SESSION_SECRET,
    name: env.SESSION_NAME,
    resave:
      typeof env.SESSION_RESAVE !== undefined
        ? env.SESSION_RESAVE === 'true'
        : false,
    saveUninitialized:
      typeof env.SESSION_SAVE_UNINIT !== undefined
        ? env.SESSION_SAVE_UNINIT === 'true'
        : false,
    cookie: {
      httpOnly:
        typeof env.HTTP_ONLY !== undefined ? env.HTTP_ONLY === 'true' : false,
      maxAge: +env.SESSION_LIFETIME_H * 1000 * 60 * 60, // In miliseconds
      sameSite: 'none',
    },
  },
  pg: {
    pwd: env.PG_PASSWORD,
    user: env.PG_USER,
    dbName: env.PG_DB_NAME,
    dialect: env.PG_DIALECT,
    uri: env.PG_URI,
    options: {
      sync: {
        force:
          typeof process.env.PG_SYNC_FORCE !== undefined
            ? process.env.PG_SYNC_FORCE === 'true'
            : false,
      },
      logging:
        typeof process.env.PG_LOGGING !== undefined
          ? process.env.PG_LOGGING === 'true'
          : false,
      alter:
        typeof process.env.PG_ALTER !== undefined
          ? process.env.PG_ALTER === 'true'
          : false,
    },
  },
  redis: {
    port: +env.RDS_PORT,
    host: env.RDS_HOST,
  },
};
