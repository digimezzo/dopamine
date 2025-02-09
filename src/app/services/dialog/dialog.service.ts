import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../ui/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { EditColumnsDialogComponent } from '../../ui/components/dialogs/edit-columns-dialog/edit-columns-dialog.component';
import { EditPlaylistDialogComponent } from '../../ui/components/dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { ErrorDialogComponent } from '../../ui/components/dialogs/error-dialog/error-dialog.component';
import { InputDialogComponent } from '../../ui/components/dialogs/input-dialog/input-dialog.component';
import { LicenseDialogComponent } from '../../ui/components/dialogs/license-dialog/license-dialog.component';
import { PlaylistModel } from '../playlist/playlist-model';
import { PlaylistModelFactory } from '../playlist/playlist-model-factory';
import { ConfirmationData } from './confirmation-data';
import { ErrorData } from './error-data';
import { InputData } from './input-data';
import { PlaylistData } from './playlist-data';
import { DialogServiceBase } from './dialog.service.base';
import { TrackModel } from '../track/track-model';
import { EditTracksDialogComponent } from '../../ui/components/dialogs/edit-tracks-dialog/edit-tracks-dialog.component';
import { InfoDialogComponent } from '../../ui/components/dialogs/info-dialog/info-dialog.component';
import { InfoData } from './info-data';

@Injectable()
export class DialogService implements DialogServiceBase {
    public constructor(
        private dialog: MatDialog,
        private playlistModelFactory: PlaylistModelFactory,
    ) {}

    public async showConfirmationDialogAsync(dialogTitle: string, dialogText: string): Promise<boolean> {
        const dialogRef: MatDialogRef<ConfirmationDialogComponent, boolean> = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px',
            data: new ConfirmationData(dialogTitle, dialogText),
        });

        const result: boolean | undefined = await dialogRef.afterClosed().toPromise();

        return result != undefined && result;
    }

    public async showInputDialogAsync(
        dialogTitle: string,
        placeHolderText: string,
        inputText: string,
        invalidCharacters: string[],
    ): Promise<string> {
        const inputData: InputData = new InputData(dialogTitle, inputText, placeHolderText, invalidCharacters);
        const dialogRef: MatDialogRef<InputDialogComponent> = this.dialog.open(InputDialogComponent, {
            width: '450px',
            data: inputData,
        });

        await dialogRef.afterClosed().toPromise();

        return inputData.inputText;
    }

    public showErrorDialog(errorText: string): void {
        this.dialog.open(ErrorDialogComponent, {
            width: '450px',
            data: new ErrorData(errorText, false),
        });
    }

    public showInfoDialog(infoText: string): void {
        this.dialog.open(InfoDialogComponent, {
            width: '450px',
            data: new InfoData(infoText),
        });
    }

    public showLicenseDialog(): void {
        this.dialog.open(LicenseDialogComponent, {
            width: '450px',
        });
    }

    public async showEditPlaylistDialogAsync(playlist: PlaylistModel): Promise<void> {
        const playlistData = new PlaylistData(playlist);
        const dialogRef: MatDialogRef<EditPlaylistDialogComponent> = this.dialog.open(EditPlaylistDialogComponent, {
            width: '450px',
            data: playlistData,
        });

        await dialogRef.afterClosed().toPromise();
    }

    public async showCreatePlaylistDialogAsync(): Promise<void> {
        const defaultPlaylist: PlaylistModel = this.playlistModelFactory.createDefault();
        const playlistData: PlaylistData = new PlaylistData(defaultPlaylist);
        const dialogRef: MatDialogRef<EditPlaylistDialogComponent> = this.dialog.open(EditPlaylistDialogComponent, {
            width: '450px',
            data: playlistData,
        });

        await dialogRef.afterClosed().toPromise();
    }

    public async showEditColumnsDialogAsync(): Promise<void> {
        const dialogRef: MatDialogRef<EditColumnsDialogComponent> = this.dialog.open(EditColumnsDialogComponent, {
            width: '450px',
        });

        await dialogRef.afterClosed().toPromise();
    }

    public async showEditTracksAsync(tracks: TrackModel[]): Promise<boolean> {
        const dialogRef: MatDialogRef<EditTracksDialogComponent, boolean> = this.dialog.open(EditTracksDialogComponent, {
            data: tracks,
        });

        const result: boolean | undefined = await dialogRef.afterClosed().toPromise();

        return result != undefined && result;
    }
}
