import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmationDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
        dialogRef.disableClose = true;
    }

    public ngOnInit(): void {}
}
