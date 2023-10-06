import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { BaseIpcProxy } from './base-ipc-proxy';

@Injectable()
export class IpcProxy implements BaseIpcProxy {
    public sendToMainProcess(channel: string, arg: unknown): void {
        ipcRenderer.send(channel, arg);
    }
}
