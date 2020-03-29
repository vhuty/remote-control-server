'use strict';

class Config {
    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || 'development';

        this.host = process.env.HOST || 'localhost';
        this.port = process.env.PORT || 4000;
        this.domen = `localhost:${ this.port }`;
        this.serverUri = `http://${ this.domen }`;

        this.session = {
            secret: process.env.SESSION_SECRET || 'lasiy32rhwe0LYGDluyql12312u',
            name: process.env.SESSION_NAME || 'sid',
            resave: typeof process.env.SESSION_RESAVE !== undefined ?
                process.env.SESSION_RESAVE === 'true' : false,
            saveUninitialized: typeof process.env.SESSION_SAVE_UNINIT !== undefined ?
                process.env.SESSION_SAVE_UNINIT === 'true' : false,
            cookie: {
                httpOnly: typeof process.env.HTTP_ONLY !== undefined ?
                    process.env.HTTP_ONLY === 'true' : false,
                maxAge: (process.env.SESSION_LIFETIME_H || 5) * 1000 * 60 * 60, // In miliseconds
                sameSite: 'none'
            },
        }

        this.pg = {
            pwd: process.env.PG_PASSWORD || '123123',
            user: process.env.PG_USER || 'postgres',
            dbName: process.env.PG_DB_NAME || 'my_db',
            dialect: process.env.PG_DIALECT || 'postgres',
            uri: process.env.PG_URI || 'localhost:5432',
            options: {
                sync: {
                    force: typeof process.env.PG_SYNC_FORCE !== undefined ?
                        process.env.PG_SYNC_FORCE === 'true' : false,
                },
                logging: typeof process.env.PG_LOGGING !== undefined ?
                    process.env.PG_LOGGING === 'true' : false,
                alter: typeof process.env.PG_ALTER !== undefined ?
                    process.env.PG_ALTER === 'true' : false,
            }
        }

        this.redis = {
            port: process.env.RDS_PORT || 6379,
            host: process.env.RDS_HOST || 'localhost',
            password: process.env.RDS_PASSWORD || null
        }
    }
}

module.exports = new Config();
