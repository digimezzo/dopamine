import { Injectable, OnDestroy } from '@angular/core';
import * as remote from '@electron/remote';
import { ChildProcess, execSync, spawn } from 'child_process';
import { OpenDialogReturnValue } from 'electron';
import { Observable, Subject } from 'rxjs';
import { DesktopBase } from './desktop.base';
import SaveDialogReturnValue = Electron.SaveDialogReturnValue;

@Injectable()
export class Desktop implements DesktopBase, OnDestroy {
    private accentColorChanged: Subject<void> = new Subject();
    private nativeThemeUpdated: Subject<void> = new Subject();
    private linuxAccentMonitor: ChildProcess | undefined;

    public constructor() {
        if (remote.systemPreferences != undefined) {
            remote.systemPreferences.on('accent-color-changed', () => this.accentColorChanged.next());
        }

        if (remote.nativeTheme != undefined) {
            remote.nativeTheme.on('updated', () => this.nativeThemeUpdated.next());
        }

        if (process.platform === 'linux') {
            this.startLinuxAccentColorMonitor();
        }
    }

    public ngOnDestroy(): void {
        this.stopLinuxAccentColorMonitor();
    }

    public accentColorChanged$: Observable<void> = this.accentColorChanged.asObservable();
    public nativeThemeUpdated$: Observable<void> = this.nativeThemeUpdated.asObservable();

    public async showSelectFolderDialogAsync(dialogTitle: string): Promise<string> {
        const openDialogReturnValue: OpenDialogReturnValue = await remote.dialog.showOpenDialog({
            title: dialogTitle,
            properties: ['openDirectory'],
        });

        if (
            openDialogReturnValue != undefined &&
            openDialogReturnValue.filePaths != undefined &&
            openDialogReturnValue.filePaths.length > 0
        ) {
            return openDialogReturnValue.filePaths[0];
        }

        return '';
    }

    public async showSelectFileDialogAsync(dialogTitle: string): Promise<string> {
        const openDialogReturnValue: OpenDialogReturnValue = await remote.dialog.showOpenDialog({
            title: dialogTitle,
            properties: ['openFile'],
        });

        if (
            openDialogReturnValue != undefined &&
            openDialogReturnValue.filePaths != undefined &&
            openDialogReturnValue.filePaths.length > 0
        ) {
            return openDialogReturnValue.filePaths[0];
        }

        return '';
    }

    public async showSaveFileDialogAsync(dialogTitle: string, defaultPath: string): Promise<string> {
        const saveDialogReturnValue: SaveDialogReturnValue = await remote.dialog.showSaveDialog({
            title: dialogTitle,
            defaultPath: defaultPath,
            filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
        });

        return saveDialogReturnValue.filePath ? saveDialogReturnValue.filePath : '';
    }

    public async openLinkAsync(url: string): Promise<void> {
        await remote.shell.openExternal(url);
    }

    public async openPathAsync(path: string): Promise<void> {
        await remote.shell.openPath(path);
    }

    public showFileInDirectory(filePath: string): void {
        remote.shell.showItemInFolder(filePath);
    }

    public shouldUseDarkColors(): boolean {
        return remote.nativeTheme.shouldUseDarkColors;
    }

    public getAccentColor(): string {
        if (process.platform === 'linux') {
            return this.getLinuxAccentColor();
        }

        return remote.systemPreferences.getAccentColor();
    }

    public async moveFileToTrashAsync(filePath: string): Promise<void> {
        await remote.shell.trashItem(filePath);
    }

    public getMusicDirectory(): string {
        return remote.app.getPath('music');
    }

    public getApplicationDataDirectory(): string {
        return remote.app.getPath('userData');
    }

    public setWindowAlwaysOnTop(alwaysOnTop: boolean): void {
        const win = remote.getCurrentWindow();
        win.setAlwaysOnTop(alwaysOnTop);
    }

    /**
     * Gets the accent color on Linux via the Freedesktop Portal D-Bus API.
     * Works on GNOME 42+, KDE Plasma 5.25+, and other compliant desktops.
     * Returns the color as a hex string (e.g. "0078d4ff") matching the Electron format.
     */
    private getLinuxAccentColor(): string {
        try {
            const output = execSync(
                'gdbus call --session --dest org.freedesktop.portal.Desktop ' +
                    '--object-path /org/freedesktop/portal/desktop ' +
                    '--method org.freedesktop.portal.Settings.Read ' +
                    'org.freedesktop.appearance accent-color',
                { timeout: 2000, encoding: 'utf-8' },
            );

            return this.parsePortalAccentColor(output);
        } catch {
            return '';
        }
    }

    /**
     * Parses the D-Bus response format: (<<(double, double, double)>>,)
     * e.g. "(<(0.20784313725490197, 0.5176470588235295, 0.8941176470588236)>,)"
     * Returns hex color string like "3584e4ff" (with alpha appended).
     */
    private parsePortalAccentColor(output: string): string {
        const match = output.match(/([\d.]+),\s*([\d.]+),\s*([\d.]+)/);

        if (match == undefined) {
            return '';
        }

        const r = Math.round(parseFloat(match[1]) * 255);
        const g = Math.round(parseFloat(match[2]) * 255);
        const b = Math.round(parseFloat(match[3]) * 255);

        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return '';
        }

        const toHex = (n: number): string => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');

        return toHex(r) + toHex(g) + toHex(b) + 'ff';
    }

    /**
     * Monitors accent color changes on Linux via the Freedesktop Portal D-Bus signal.
     */
    private startLinuxAccentColorMonitor(): void {
        try {
            this.linuxAccentMonitor = spawn('gdbus', [
                'monitor',
                '--session',
                '--dest',
                'org.freedesktop.portal.Desktop',
                '--object-path',
                '/org/freedesktop/portal/desktop',
            ]);

            this.linuxAccentMonitor.stdout?.on('data', (data: Buffer) => {
                const text = data.toString();

                if (text.includes('accent-color')) {
                    this.accentColorChanged.next();
                }
            });

            this.linuxAccentMonitor.on('error', () => {
                // gdbus not available — ignore silently
            });
        } catch {
            // spawn failed — ignore silently
        }
    }

    private stopLinuxAccentColorMonitor(): void {
        if (this.linuxAccentMonitor != undefined) {
            this.linuxAccentMonitor.kill();
            this.linuxAccentMonitor = undefined;
        }
    }
}
