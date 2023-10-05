import { Injectable } from '@angular/core';
import * as remote from '@electron/remote';
import { ipcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';
import { BaseApplication } from './base-application';
import { WindowSize } from './window-size';

@Injectable()
export class Application implements BaseApplication {
    private argumentsReceived: Subject<string[]> = new Subject();

    public constructor() {
        ipcRenderer.on('arguments-received', (event, argv: string[] | undefined) => {
            this.argumentsReceived.next(argv);
        });
    }

    public argumentsReceived$: Observable<string[]> = this.argumentsReceived.asObservable();

    public getGlobal(name: string): unknown {
        return remote.getGlobal(name);
    }

    public getCurrentWindow(): Electron.BrowserWindow {
        return remote.getCurrentWindow();
    }

    public getWindowSize(): WindowSize {
        return new WindowSize(window.innerWidth, window.innerHeight);
    }

    public getParameters(): string[] {
        if (remote?.process?.argv != undefined) {
            return remote.process.argv;
        }

        return [];
    }
}
