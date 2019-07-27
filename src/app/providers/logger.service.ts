import { Injectable } from '@angular/core';
import log from 'electron-log';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  public info(className: string, methodName: string, message: string): void {
    log.info(this.formatMessage(className, methodName, message));
  }

  public warn(className: string, methodName: string, message: string): void {
    log.warn(this.formatMessage(className, methodName, message));
  }

  public error(className: string, methodName: string, message: string): void {
    log.error(this.formatMessage(className, methodName, message));
  }

  private formatMessage(className: string, methodName: string, message: string): string {
    return `[${className}] [${methodName}] ${message}`;
  }
}
