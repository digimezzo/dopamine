import { Injectable } from '@angular/core';
import * as childProcess from 'child_process';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as fs from 'fs';

@Injectable()
export class ElectronService {
    public ipcRenderer: typeof ipcRenderer;
    public webFrame: typeof webFrame;
    public childProcess: typeof childProcess;
    public fs: typeof fs;

    constructor() {
        // Conditional imports
        if (this.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
        }
    }

    public isElectron = () => {
        return window != undefined && window.process && window.process.type;
    };
}
