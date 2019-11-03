import { LoggerInterface } from './loggerInterface';

export class LoggerStub implements LoggerInterface {
    constructor() { }

    public info(message: string, callerClass: string, callerMethod: string): void {
        // Do nothing
    }

    public warn(message: string, callerClass: string, callerMethod: string): void {
        // Do nothing
    }

    public error(message: string, callerClass: string, callerMethod: string): void {
        // Do nothing
    }
}
