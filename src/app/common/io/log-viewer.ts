import { Injectable } from '@angular/core';
import { Constants } from '../application/constants';
import { BaseDesktop } from './base-desktop';
import { BaseFileAccess } from './base-file-access';

@Injectable()
export class LogViewer {
    constructor(private desktop: BaseDesktop, private fileAccess: BaseFileAccess) {}

    public viewLog(): void {
        // See: https://stackoverflow.com/questions/30381450/open-external-file-with-electron
        this.desktop.showFileInDirectory(
            this.fileAccess.combinePath([this.fileAccess.applicationDataDirectory(), 'logs', Constants.logFileName])
        );
    }
}
