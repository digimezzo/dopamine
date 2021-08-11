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

    public getParameters(): string[] {
        if (remote.app.isPackaged) {
            // Workaround for missing executable argument
            process.argv.unshift(undefined);
        }

        // Parameters is now an array containing any files/folders that the OS will pass to the application
        const parameters = remote.process.argv.slice(2);

        if (parameters != undefined && parameters.length > 0) {
            return parameters;
        }

        return [];
    }
}
