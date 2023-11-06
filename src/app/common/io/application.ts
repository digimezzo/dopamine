import { Injectable } from '@angular/core';
import * as remote from '@electron/remote';
import { WindowSize } from './window-size';
import { ApplicationBase } from './application.base';

@Injectable()
export class Application implements ApplicationBase {
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
