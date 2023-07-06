import * as winston from "winston";
import { CONFIG } from "./Configuration";
import * as path from "path";
import * as fs from "fs";
import { format, Format } from "logform";
import * as Transport from 'winston-transport';

export class LoggerFactory {

    static getLogger(prefix: string): winston.Logger {
        return this.createLogger(prefix);
    }

    static getDedicatedFileLogger(prefix: string, filename: string): winston.Logger {
        return this.createLogger(prefix, filename);
    }

    private static createLogger(prefix: string, fileName?: string): winston.Logger {

        const name = prefix + (fileName || '');

        let loggerOptions: winston.LoggerOptions = {
            level: CONFIG.logging.level,
            format: this.createFormatter(CONFIG.logging.prefix, prefix),
            transports: [new winston.transports.Console()]
        };

        if (CONFIG.logging.useFileAppender) {

            let directory = path.resolve(CONFIG.logging.logsFolder);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }

            let logFile = path.resolve(directory, fileName || CONFIG.logging.fileName);

            let fileTransportOptions: winston.transports.FileTransportOptions = {
                filename: logFile,
                maxsize: CONFIG.logging.maxSize,
                maxFiles: CONFIG.logging.maxFiles
            };

            (<Transport[]>(loggerOptions.transports)).push(new winston.transports.File(fileTransportOptions))
        }

        return winston.loggers.get(name, loggerOptions);
    }

    private static createFormatter(appPrefix: string, prefix: string): Format {
        return format.combine(
            format.colorize(),
            format.timestamp(),
            format.align(),
            format.printf(info => `[${info.timestamp}][${appPrefix}][${prefix}] - ${info.level}: ${info.message}`)
        );
    }
}