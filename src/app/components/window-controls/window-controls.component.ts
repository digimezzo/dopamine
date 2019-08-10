import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { remote, BrowserWindow } from 'electron';

@Component({
    selector: 'window-controls',
    templateUrl: './window-controls.component.html',
    styleUrls: ['./window-controls.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WindowControlsComponent implements OnInit {
    constructor() {
    }

    public canMaximize: boolean = false;

    public ngOnInit(): void {
        let window: BrowserWindow = remote.getCurrentWindow();
        this.canMaximize = !window.isMaximized();
    }

    public minButtonClick(): void {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.minimize();
    }

    public maxRestoreClick(): void {
        let window: BrowserWindow = remote.getCurrentWindow();

        if (window.isMaximized()) {
            window.unmaximize();
            this.canMaximize = true;
        } else {
            window.maximize();
            this.canMaximize = false;
        }
    }

    public closeButtonClick(): void {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.close();
    }
}