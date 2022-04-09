import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { BaseIpcProxy } from './base-ipc-proxy';

@Injectable()
export class IpcProxy implements BaseIpcProxy {
    constructor() {}

    public sendToMainProcess(channel: string, arg: any): void {
        ipcRenderer.send(channel, arg);
    }
}
