import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Strings } from '../../../common/strings';

@Component({
    selector: 'app-input-dialog',
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InputDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<InputDialogComponent>) {
        dialogRef.disableClose = true;
    }

    public get hasInputText(): boolean {
        return !Strings.isNullOrWhiteSpace(this.data.inputText);
    }

    public ngOnInit(): void {}

    public closeDialog(): void {
        if (this.hasInputText) {
            this.dialogRef.close(true); // Force return "true"
        }
    }
}
