import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LogViewer } from '../../../common/io/log-viewer';
import { ErrorData } from '../../../services/dialog/error-data';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ErrorDialogComponent {
    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: ErrorData,
        private dialogRef: MatDialogRef<ErrorDialogComponent>,
        private logViewer: LogViewer
    ) {
        this.dialogRef.disableClose = true;
    }

    public viewLog(): void {
        this.logViewer.viewLog();
    }
}
