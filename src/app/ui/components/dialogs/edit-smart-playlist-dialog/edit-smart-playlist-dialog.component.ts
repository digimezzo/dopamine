import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaylistData } from '../../../../services/dialog/playlist-data';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { StringUtils } from '../../../../common/utils/string-utils';

@Component({
    selector: 'app-edit-playlist-dialog',
    templateUrl: './edit-smart-playlist-dialog.component.html',
    styleUrls: ['./edit-smart-playlist-dialog.component.scss'],
})
export class EditSmartPlaylistDialogComponent implements OnInit {
    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: PlaylistData,
        private dialogRef: MatDialogRef<EditSmartPlaylistDialogComponent, boolean>,
        private translatorService: TranslatorServiceBase,
    ) {
        dialogRef.disableClose = true;
    }

    public playlistName: string = '';
    public playlistImagePath: string = '';

    public get dialogTitle(): string {
        if (this.hasPlaylistName) {
            return this.translatorService.get('edit-smart-playlist');
        }

        return this.translatorService.get('create-smart-playlist');
    }

    public get hasPlaylistName(): boolean {
        return !StringUtils.isNullOrWhiteSpace(this.playlistName);
    }

    public ngOnInit(): void {
        this.dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
            if (result != undefined && result) {
                void this.updatePlaylistAsync();
            }
        });

        this.playlistName = this.data.playlist.name;
        this.playlistImagePath = this.data.playlist.imagePath;
    }

    private async updatePlaylistAsync(): Promise<void> {
        try {
            // await this.playlistService.updatePlaylistDetailsAsync(this.data.playlist, this.playlistName, this.playlistImagePath);
        } catch (e: unknown) {
            // TODO
        }
    }
}
