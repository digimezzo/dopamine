import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Strings } from '../../../common/strings';
import { BasePlaylistService } from '../../../services/playlist/base-playlist.service';

@Component({
    selector: 'app-edit-playlist-dialog',
    templateUrl: './edit-playlist-dialog.component.html',
    styleUrls: ['./edit-playlist-dialog.component.scss'],
})
export class EditPlaylistDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<EditPlaylistDialogComponent>,
        private playlistService: BasePlaylistService
    ) {
        dialogRef.disableClose = true;
    }

    public get hasInputText(): boolean {
        return !Strings.isNullOrWhiteSpace(this.data.inputText);
    }

    public ngOnInit(): void {
        this.dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.updatePlaylist();
            }
        });
    }

    public closeDialog(): void {
        if (this.hasInputText) {
            this.dialogRef.close(true); // Force return "true"
        }
    }

    private updatePlaylist(): void {
        this.playlistService.updatePlaylistDetailsAsync(this.data.playlist, this.data.inputText);
    }
}
