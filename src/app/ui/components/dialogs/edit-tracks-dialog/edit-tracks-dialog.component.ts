import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LogViewer } from '../../../../common/io/log-viewer';
import { ErrorData } from '../../../../services/dialog/error-data';

@Component({
    selector: 'app-edit-tracks-dialog',
    templateUrl: './edit-tracks-dialog.component.html',
    styleUrls: ['./edit-tracks-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditTracksDialogComponent {
    public constructor() {}
}
