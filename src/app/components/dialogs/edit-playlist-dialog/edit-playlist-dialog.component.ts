import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Constants } from '../../../common/application/constants';
import { Desktop } from '../../../common/io/desktop';
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
        private desktop: Desktop
    ) {
        dialogRef.disableClose = true;
    }

    public get hasPlaylistName(): boolean {
        return !Strings.isNullOrWhiteSpace(this.data.playlistName);
    }

    public get hasPlaylistImagePath(): boolean {
        return this.data.playlistImagePath !== Constants.emptyImage;
    }

    public ngOnInit(): void {
        this.dialogRef.afterClosed().subscribe(async (result: any) => {
            if (result) {
                await this.updatePlaylistAsync();
            }
        });
    }

    public closeDialog(): void {
        if (this.hasPlaylistName) {
            this.dialogRef.close(true); // Force return "true"
        }
    }

    public async changeImageAsync(): Promise<void> {
        const selectedFile: string = await this.desktop.showSelectFileDialogAsync(this.translatorService.get('choose-image'));

        if (!Strings.isNullOrWhiteSpace(selectedFile)) {
            this.data.playlistImagePath = selectedFile;
        }
    }

    public removeImage(): void {
        this.data.playlistImagePath = Constants.emptyImage;
    }

    private async updatePlaylistAsync(): Promise<void> {
        const couldUpdatePlaylistDetails: boolean = await this.playlistService.tryUpdatePlaylistDetailsAsync(
            this.data.playlist,
            this.data.playlistName,
            this.data.playlistImagePath
        );

        if (!couldUpdatePlaylistDetails) {
            // TODO
        }
    }
}
