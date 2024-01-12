const log = require('electron-log');

class Logger {
    static info(message, callerClass, callerMethod) {
        log.info(this.#formattedMessage(message, callerClass, callerMethod));
    }

    static warn(message, callerClass, callerMethod) {
        log.warn(this.#formattedMessage(message, callerClass, callerMethod));
    }

    static error(error, message, callerClass, callerMethod) {
        log.error(this.#formattedMessageWithError(error, message, callerClass, callerMethod));
    }

    static #formattedMessage(message, callerClass, callerMethod) {
        return `[${callerClass}] [${callerMethod}] ${message}`;
    }

    static #formattedMessageWithError(error, message, callerClass, callerMethod) {
        return `[${callerClass}] [${callerMethod}]  ${message.endsWith('.') ? message : message + '.'}${
            error instanceof Error ? ' Error: ' + error.message : ''
        }`;
    }
}

exports.Logger = Logger;
