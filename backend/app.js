const logger = require('./services/logger');
const util = require('./services/util');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const app = express();
const config = JSON.parse(fs.readFileSync('config.json'));

util.clearConsole();
logger.info('App starting...');

const setup = () => {
    return new Promise(async (resolve, reject) => {
        try {
            app.use(rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 100
            }));
            app.use(cors({ origin: '*' }));
            app.use(expressSanitizer());
            app.use(express.json());
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));

            app.use('/', require('./routes'));

            const http = require('http');
            const httpServer = http.createServer(app);
            httpServer.listen(config.httpPort, () => {
                logger.debug('Backend listening on port %i', config.httpPort);
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

setup()
    .then(() => {
        logger.info('App started successfully!');
    })
    .catch((error) => {
        logger.error(error);
    });