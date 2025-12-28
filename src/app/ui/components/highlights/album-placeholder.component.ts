import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AlbumModel } from '../../../services/album/album-model';

@Component({
    selector: 'app-album-placeholder',
    templateUrl: './album-placeholder.component.html',
    styleUrls: ['./album-placeholder.component.scss'],
    host: { style: 'display: block; width: 100%;height: 100%' },
    encapsulation: ViewEncapsulation.None,
})
export class AlbumPlaceholderComponent {
    @Input() album: AlbumModel | undefined;
    @Input() animationDelay: number = 0;
    @Input() squareClass: string = '';
    @Output() albumClick = new EventEmitter<AlbumModel | undefined>();

    public onAlbumClick(): void {
        this.albumClick.emit(this.album);
    }
}
