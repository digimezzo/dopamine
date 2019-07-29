import { Injectable } from '@angular/core';
import { Logger } from './logger';

@Injectable({
    providedIn: 'root'
})
export class LoggerMock implements Logger {
    constructor() { }

    info(message: string): void {
        // Do nothing
    }

    warn(message: string): void {
        // Do nothing
    }

    error(message: string): void {
        // Do nothing
    }
}
