import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorData } from '../../../../services/dialog/error-data';
import { InfoData } from '../../../../services/dialog/info-data';

@Component({
    selector: 'app-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InfoDialogComponent {
    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: InfoData,
        private dialogRef: MatDialogRef<InfoDialogComponent>,
    ) {
        this.dialogRef.disableClose = true;
    }
}
