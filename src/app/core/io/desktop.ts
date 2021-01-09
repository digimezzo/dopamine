import { Injectable } from '@angular/core';
import { OpenDialogReturnValue, remote } from 'electron';

@Injectable()
export class Desktop {
    constructor() {}

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
}
