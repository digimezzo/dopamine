import { Injectable } from '@angular/core';
import { remote, shell } from 'electron';

@Injectable()
export class Desktop {
    constructor() {
    }

    public async showSelectFolderDialogAsync(dialogTitle: string): Promise<string> {
        const folderPaths: string[] = remote.dialog.showOpenDialog({ title: dialogTitle, properties: ['openDirectory'] });

        if (folderPaths != undefined && folderPaths.length > 0) {
            return folderPaths[0];
        }

        return '';
    }

    public openLink(url: string): void {
        shell.openExternal(url);
    }
}
