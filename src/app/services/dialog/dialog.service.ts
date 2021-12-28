import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { EditPlaylistDialogComponent } from '../../components/dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { ErrorDialogComponent } from '../../components/dialogs/error-dialog/error-dialog.component';
import { InputDialogComponent } from '../../components/dialogs/input-dialog/input-dialog.component';
import { LicenseDialogComponent } from '../../components/dialogs/license-dialog/license-dialog.component';
import { PlaylistModel } from '../playlist/playlist-model';
import { BaseDialogService } from './base-dialog.service';

@Injectable()
export class DialogService implements BaseDialogService {
    constructor(private dialog: MatDialog) {}

    public isInputDialogOpened: boolean = false;

    public async showConfirmationDialogAsync(dialogTitle: string, dialogText: string): Promise<boolean> {
        const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px',
            data: { dialogTitle: dialogTitle, dialogText: dialogText },
        });

        const result: any = await dialogRef.afterClosed().toPromise();

        if (result) {
            return true;
        }

        return false;
    }

    public async showInputDialogAsync(dialogTitle: string, placeHolderText: string, inputText: string): Promise<string> {
        this.isInputDialogOpened = true;

        const data: any = { dialogTitle: dialogTitle, inputText: inputText, placeHolderText: placeHolderText };
        const dialogRef: MatDialogRef<InputDialogComponent> = this.dialog.open(InputDialogComponent, {
            width: '450px',
            data: data,
        });

        await dialogRef.afterClosed().toPromise();

        this.isInputDialogOpened = false;

        return data.inputText;
    }

    public showErrorDialog(errorText: string): void {
        this.dialog.open(ErrorDialogComponent, {
            width: '450px',
            data: { errorText: errorText },
        });
    }

    public showLicenseDialog(): void {
        this.dialog.open(LicenseDialogComponent, {
            width: '450px',
        });
    }

    public showEditPlaylistDialog(playlist: PlaylistModel): void {
        this.dialog.open(EditPlaylistDialogComponent, {
            width: '450px',
        });
    }
}
