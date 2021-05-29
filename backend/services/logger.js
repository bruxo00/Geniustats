const winston = require('winston');

module.exports = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD/MM/YYYY HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'geniustats'
    },
    transports: [
        new winston.transports.File({
            name: 'errors-log',
            filename: './logs/errors.log',
            level: 'error'
        }),
        new winston.transports.File({
            name: 'info-log',
            filename: './logs/info.log',
            level: 'info',
        }),
        new winston.transports.File({
            filename: './logs/combined.log',
        }),
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.colorize({ all: false }),
                winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
                winston.format.printf(info => `${info.level}: ${info.message}`)
            ),
        }),
    ]
});
