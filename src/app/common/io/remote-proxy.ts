import { Injectable } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { Observable, Subject } from 'rxjs';
import { BaseRemoteProxy } from './base-remote-proxy';

@Injectable()
export class RemoteProxy implements BaseRemoteProxy {
    private argumentsReceived: Subject<string[]> = new Subject();

    constructor() {
        ipcRenderer.on('arguments-received', (event, argv) => {
            this.argumentsReceived.next(argv);
        });
    }

    public argumentsReceived$: Observable<string[]> = this.argumentsReceived.asObservable();

    public getGlobal(name: string): any {
        return remote.getGlobal(name);
    }

    public getCurrentWindow(): Electron.BrowserWindow {
        return remote.getCurrentWindow();
    }

    public getParameters(): string[] {
        return remote.process.argv;
    }
}
