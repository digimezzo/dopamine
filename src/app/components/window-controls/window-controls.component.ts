import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BrowserWindow, remote } from 'electron';

@Component({
    selector: 'app-window-controls',
    host: { 'style': 'display: block' },
    templateUrl: './window-controls.component.html',
    styleUrls: ['./window-controls.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WindowControlsComponent implements OnInit {
    constructor() {
    }

    public canMaximize: boolean = false;

    public ngOnInit(): void {
        if (remote !== null && remote !== undefined) {
            const window: BrowserWindow = remote.getCurrentWindow();
            this.canMaximize = !window.isMaximized();
        }
    }

    public minButtonClick(): void {
        if (remote !== null && remote !== undefined) {
            const window: BrowserWindow = remote.getCurrentWindow();
            window.minimize();
        }
    }

    public maxRestoreClick(): void {
        if (remote !== null && remote !== undefined) {
            const window: BrowserWindow = remote.getCurrentWindow();

            if (window.isMaximized()) {
                window.unmaximize();
                this.canMaximize = true;
            } else {
                window.maximize();
                this.canMaximize = false;
            }
        }
    }

    public closeButtonClick(): void {
        if (remote !== null && remote !== undefined) {
            const window: BrowserWindow = remote.getCurrentWindow();
            window.close();
        }
    }
}
