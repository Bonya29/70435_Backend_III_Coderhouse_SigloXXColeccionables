import winston from 'winston'

const levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    HTTP: 3
}

const colors = {
    ERROR: "red",
    WARN: "yellow",
    INFO: "blue",
    HTTP: "green"
}

winston.addColors(colors)

export const logger = winston.createLogger({
    levels,
    format: winston.format.colorize(),
    transports: [
        new winston.transports.Console({ level: "HTTP", format: winston.format.simple() }),
        new winston.transports.File({ level: "WARN", format: winston.format.json(), filename: './logs/errors/errors.log' }),
    ]
})