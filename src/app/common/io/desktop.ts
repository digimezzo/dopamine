import { Injectable } from '@angular/core';
import * as remote from '@electron/remote';
import { OpenDialogReturnValue } from 'electron';
import { Observable, Subject } from 'rxjs';
import { BaseDesktop } from './base-desktop';

@Injectable()
export class Desktop implements BaseDesktop {
    private accentColorChanged: Subject<void> = new Subject();
    private nativeThemeUpdated: Subject<void> = new Subject();

    constructor() {
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

    public openLink(url: string): void {
        remote.shell.openExternal(url);
    }

    public openPath(path: string): void {
        remote.shell.openPath(path);
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
