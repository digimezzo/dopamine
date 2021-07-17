import { Injectable } from '@angular/core';
import { OpenDialogReturnValue, remote } from 'electron';
import { Observable, Subject } from 'rxjs';
import { WindowSize } from './window-size';

@Injectable()
export class Desktop {
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

    public openLink(url: string): void {
        remote.shell.openExternal(url);
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

    public getApplicationWindowSize(): WindowSize {
        return new WindowSize(window.innerWidth, window.innerHeight);
    }
}
