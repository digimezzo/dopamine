import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Constants } from '../../../common/application/constants';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { BaseFileAccess } from '../../../common/io/base-file-access';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ErrorDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ErrorDialogComponent>,
        private desktop: BaseDesktop,
        private fileAccess: BaseFileAccess
    ) {
        this.dialogRef.disableClose = true;
    }

    public ngOnInit(): void {}

    public viewLog(): void {
        // See: https://stackoverflow.com/questions/30381450/open-external-file-with-electron
        this.desktop.showFileInDirectory(
            this.fileAccess.combinePath([this.fileAccess.applicationDataDirectory(), 'logs', Constants.logFileName])
        );
    }
}
