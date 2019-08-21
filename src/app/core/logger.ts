import { Injectable } from '@angular/core';
import log from 'electron-log';
import { LoggerInterface } from './loggerInterface';

@Injectable({
    providedIn: 'root'
})
export class Logger implements LoggerInterface {
    constructor() { }

    public info(message: string, callerClass: string, callerMethod: string): void {
        log.info(this.formattedMessage(message, callerClass, callerMethod));
    }

    public warn(message: string, callerClass: string, callerMethod: string): void {
        log.warn(this.formattedMessage(message, callerClass, callerMethod));
    }

    public error(message: string, callerClass: string, callerMethod: string): void {
        log.error(this.formattedMessage(message, callerClass, callerMethod));
    }

    private formattedMessage(message: string, callerClass: string, callerMethod: string) {
        return `[${callerClass}] [${callerMethod}] ${message}`;
    }
}
