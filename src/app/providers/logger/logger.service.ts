import { Injectable } from '@angular/core';
import log from 'electron-log';
import { Logger } from './logger';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements Logger {
  constructor() { }

  info(message: string): void {
    log.info(message);
  }

  warn(message: string): void {
    log.warn(message);
  }

  error(message: string): void {
    log.error(message);
  }
}
