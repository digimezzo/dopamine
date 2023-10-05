import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationData } from '../../../services/dialog/confirmation-data';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmationDialogComponent {
    public constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationData, dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
        dialogRef.disableClose = true;
    }
}
