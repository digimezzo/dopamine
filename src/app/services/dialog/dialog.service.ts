import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../components/dialogs/error-dialog/error-dialog.component';
import { LicenseDialogComponent } from '../../components/dialogs/license-dialog/license-dialog.component';
import { ManageCollectionDialogComponent } from '../../components/dialogs/manage-collection-dialog/manage-collection-dialog.component';
import { BaseDialogService } from './base-dialog.service';

@Injectable({
    providedIn: 'root'
})
export class DialogService implements BaseDialogService {
    constructor(private dialog: MatDialog) {
    }

    public async showConfirmationDialogAsync(dialogTitle: string, dialogText: string): Promise<boolean> {
        const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px', data: { dialogTitle: dialogTitle, dialogText: dialogText }
        });

        const result: any = await dialogRef.afterClosed().toPromise();

        if (result) {
            return true;
        }

        return false;
    }

    public showErrorDialog(errorText: string): void {
        this.dialog.open(ErrorDialogComponent, {
            width: '450px', data: { errorText: errorText }
        });
    }

    public showLicenseDialog(): void {
        this.dialog.open(LicenseDialogComponent, {
            width: '450px'
        });
    }

    public showManageCollectionDialog(): void {
        this.dialog.open(ManageCollectionDialogComponent, {
            width: '450px'
        });
    }
}
