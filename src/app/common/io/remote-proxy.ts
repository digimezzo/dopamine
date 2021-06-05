import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { BaseRemoteProxy } from './base-remote-proxy';

@Injectable()
export class RemoteProxy implements BaseRemoteProxy {
    constructor() {}

    public getGlobal(name: string): any {
        return remote.getGlobal(name);
    }

    public getCurrentWindow(): Electron.BrowserWindow {
        return remote.getCurrentWindow();
    }
}
