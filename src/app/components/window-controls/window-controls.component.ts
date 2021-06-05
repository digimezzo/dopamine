import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BrowserWindow } from 'electron';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';

@Component({
    selector: 'app-window-controls',
    host: { style: 'display: block' },
    templateUrl: './window-controls.component.html',
    styleUrls: ['./window-controls.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WindowControlsComponent implements OnInit {
    constructor(private remoteProxy: BaseRemoteProxy) {}

    public canMaximize: boolean = false;

    public ngOnInit(): void {
        const window: BrowserWindow = this.remoteProxy.getCurrentWindow();
        this.canMaximize = !window.isMaximized();
    }

    public minButtonClick(): void {
        const window: BrowserWindow = this.remoteProxy.getCurrentWindow();
        window.minimize();
    }

    public maxRestoreClick(): void {
        const window: BrowserWindow = this.remoteProxy.getCurrentWindow();

        if (window.isMaximized()) {
            window.unmaximize();
            this.canMaximize = true;
        } else {
            window.maximize();
            this.canMaximize = false;
        }
    }

    public closeButtonClick(): void {
        const window: BrowserWindow = this.remoteProxy.getCurrentWindow();
        window.close();
    }
}
