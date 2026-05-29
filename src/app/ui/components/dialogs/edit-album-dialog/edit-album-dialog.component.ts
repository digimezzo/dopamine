import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlbumModel } from '../../../../services/album/album-model';

@Component({
    selector: 'app-edit-album-dialog',
    templateUrl: './edit-album-dialog.component.html',
    styleUrls: ['./edit-album-dialog.component.scss'],
})
export class EditAlbumDialogComponent {
    public imagePath: string = '';
    public updateFileCovers: boolean = false;

    public constructor(@Inject(MAT_DIALOG_DATA) public data: AlbumModel[]) {}

    public onExport(): void {}

    public onChange(): void {}

    public onDownload(): void {}

    public onRemove(): void {}
}
