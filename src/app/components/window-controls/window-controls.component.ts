import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BrowserWindow } from 'electron';
import { BaseApplication } from '../../common/io/base-application';

@Component({
    selector: 'app-window-controls',
    host: { style: 'display: block' },
    templateUrl: './window-controls.component.html',
    styleUrls: ['./window-controls.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WindowControlsComponent implements OnInit {
    constructor(private application: BaseApplication) {}

    public canMaximize: boolean = false;

    public ngOnInit(): void {
        const window: BrowserWindow = this.application.getCurrentWindow();
        this.canMaximize = !window.isMaximized();
    }

    public minButtonClick(): void {
        const window: BrowserWindow = this.application.getCurrentWindow();
        window.minimize();
    }

    public maxRestoreClick(): void {
        const window: BrowserWindow = this.application.getCurrentWindow();

        if (window.isMaximized()) {
            window.unmaximize();
            this.canMaximize = true;
        } else {
            window.maximize();
            this.canMaximize = false;
        }
    }

    public closeButtonClick(): void {
        const window: BrowserWindow = this.application.getCurrentWindow();
        window.close();
    }
}
