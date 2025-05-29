import { Injectable } from '@angular/core';
import * as remote from '@electron/remote';
import { OpenDialogReturnValue } from 'electron';
import { Observable, Subject } from 'rxjs';
import { DesktopBase } from './desktop.base';
import SaveDialogReturnValue = Electron.SaveDialogReturnValue;

@Injectable()
export class Desktop implements DesktopBase {
    private accentColorChanged: Subject<void> = new Subject();
    private nativeThemeUpdated: Subject<void> = new Subject();

    public constructor() {
        if (remote.systemPreferences != undefined) {
            remote.systemPreferences.on('accent-color-changed', () => this.accentColorChanged.next());
        }

        if (remote.nativeTheme != undefined) {
            remote.nativeTheme.on('updated', () => this.nativeThemeUpdated.next());
        }
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
}
