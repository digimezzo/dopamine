import { Injectable } from '@angular/core';
import { BrowserWindow } from 'electron';
import { BaseRemoteProxy } from './base-remote-proxy';

@Injectable()
export class RemoteProxyStub implements BaseRemoteProxy {
    public getGlobal(name: string): any {
        return false;
    }

    public getCurrentWindow(): BrowserWindow {
        return undefined;
    }
}
