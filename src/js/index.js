import dotenv from 'dotenv';
dotenv.config();

let config;

switch (process.env.NODE_ENV) {
    case 'production':
        config = require('./config.prod.json');
        break;
    case 'development':
    default:
        config = require('./config.dev.json');
}