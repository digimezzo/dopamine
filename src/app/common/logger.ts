import { Injectable } from '@angular/core';
import log from 'electron-log';

@Injectable()
export class Logger {
    constructor() {}

    public info(message: string, callerClass: string, callerMethod: string): void {
        log.info(this.formattedMessage(message, callerClass, callerMethod));
    }

    public warn(message: string, callerClass: string, callerMethod: string): void {
        log.warn(this.formattedMessage(message, callerClass, callerMethod));
    }

    public error(message: string, callerClass: string, callerMethod: string): void {
        log.error(this.formattedMessage(message, callerClass, callerMethod));
    }

    private formattedMessage(message: string, callerClass: string, callerMethod: string): string {
        return `[${callerClass}] [${callerMethod}] ${message}`;
    }
}
