const winston = require('winston')
const config = require('./config')

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
}

// Development Logger
const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ 
            filename: './errors.log', 
            level: 'warning',
            format: winston.format.simple()
        })
    ]
})


// Production Logger
const prodLogger = winston.createLogger({    
    transports: [
        new winston.transports.Console({ 
            level: 'http',
        })
    ]
})

let logger;

const addLogger = (req, res, next) => {
    if (config.ENVIROMENT === "production") {
        logger = prodLogger
        req.logger = logger
        req.logger.warn("Prueba de log level warn! (Modo production)")
        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}. (Modo production)`)        
        // console.log('Logger: ' + config.ENVIROMENT)
    } else {
        logger = devLogger
        req.logger = logger
        req.logger.warning("Prueba de log level warning! (Modo development)")
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}. (Modo development)`)
        // console.log('Logger: ' + config.ENVIROMENT)
    }

    next()
}

module.exports = { addLogger, logger }