import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Constants } from '../../../common/application/constants';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Strings } from '../../../common/strings';
import { BasePlaylistService } from '../../../services/playlist/base-playlist.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';

@Component({
    selector: 'app-edit-playlist-dialog',
    templateUrl: './edit-playlist-dialog.component.html',
    styleUrls: ['./edit-playlist-dialog.component.scss'],
})
export class EditPlaylistDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<EditPlaylistDialogComponent>,
        private playlistService: BasePlaylistService,
        private translatorService: BaseTranslatorService,
        private desktop: BaseDesktop
    ) {
        dialogRef.disableClose = true;
    }

    public playlistName: string = '';
    public playlistImagePath: string = '';

    public get dialogTitle(): string {
        if (this.hasPlaylistName) {
            return this.translatorService.get('edit-playlist');
        }

        return this.translatorService.get('create-playlist');
    }

    public get hasPlaylistName(): boolean {
        return !Strings.isNullOrWhiteSpace(this.playlistName);
    }

    public get hasPlaylistImagePath(): boolean {
        return this.playlistImagePath !== Constants.emptyImage;
    }

    public ngOnInit(): void {
        this.dialogRef.afterClosed().subscribe(async (result: any) => {
            if (result) {
                await this.updatePlaylistAsync();
            }
        });

        this.playlistName = this.data.playlist.name;
        this.playlistImagePath = this.data.playlist.imagePath;
    }

    public closeDialog(): void {
        if (this.hasPlaylistName) {
            this.dialogRef.close(true); // Force return "true"
        }
    }

    public async changeImageAsync(): Promise<void> {
        const selectedFile: string = await this.desktop.showSelectFileDialogAsync(this.translatorService.get('choose-image'));

        if (!Strings.isNullOrWhiteSpace(selectedFile)) {
            this.playlistImagePath = selectedFile;
        }
    }

    public removeImage(): void {
        this.playlistImagePath = Constants.emptyImage;
    }

    private async updatePlaylistAsync(): Promise<void> {
        try {
            await this.playlistService.updatePlaylistDetailsAsync(this.data.playlist, this.playlistName, this.playlistImagePath);
        } catch (e) {
            // TODO
        }
    }
}
