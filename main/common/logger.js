const log = require('electron-log');

class Logger {
    info(message, callerClass, callerMethod) {
        log.info(this.#formattedMessage(message, callerClass, callerMethod));
    }

    warn(message, callerClass, callerMethod) {
        log.warn(this.#formattedMessage(message, callerClass, callerMethod));
    }

    error(error, message, callerClass, callerMethod) {
        log.error(this.#formattedMessageWithError(error, message, callerClass, callerMethod));
    }

    #formattedMessage(message, callerClass, callerMethod) {
        return `[${callerClass}] [${callerMethod}] ${message}`;
    }

    #formattedMessageWithError(error, message, callerClass, callerMethod) {
        return `[${callerClass}] [${callerMethod}]  ${message.endsWith('.') ? message : message + '.'}${
            error instanceof Error ? ' Error: ' + error.message : ''
        }`;
    }
}

exports.Logger = Logger;
