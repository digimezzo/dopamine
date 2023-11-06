import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StringUtils } from '../../../../common/utils/string-utils';
import { InputData } from '../../../../services/dialog/input-data';

@Component({
    selector: 'app-input-dialog',
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InputDialogComponent {
    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: InputData,
        private dialogRef: MatDialogRef<InputDialogComponent>,
    ) {
        dialogRef.disableClose = true;
    }

    public get hasInputText(): boolean {
        return !StringUtils.isNullOrWhiteSpace(this.data.inputText);
    }

    public closeDialog(): void {
        if (this.hasInputText) {
            this.dialogRef.close(true); // Force return "true"
        }
    }
}
