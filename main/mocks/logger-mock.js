class LoggerMock {
    info(message, callerClass, callerMethod) {}

    warn(message, callerClass, callerMethod) {}

    error(error, message, callerClass, callerMethod) {}
}

exports.LoggerMock = LoggerMock;
