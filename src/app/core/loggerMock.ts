import { Injectable } from '@angular/core';
import { LoggerInterface } from './loggerInterface';

@Injectable({
    providedIn: 'root'
})
export class LoggerMock implements LoggerInterface {
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
