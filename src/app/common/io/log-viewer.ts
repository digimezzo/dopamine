import { Injectable } from '@angular/core';
import { Constants } from '../application/constants';
import { DesktopBase } from './desktop.base';
import { FileAccessBase } from './file-access.base';

@Injectable()
export class LogViewer {
    public constructor(
        private desktop: DesktopBase,
        private fileAccess: FileAccessBase,
    ) {}

    public viewLog(): void {
        // See: https://stackoverflow.com/questions/30381450/open-external-file-with-electron
        this.desktop.showFileInDirectory(
            this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'logs', Constants.logFileName]),
        );
    }
}
