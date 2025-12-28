import { Component, Input, Output, EventEmitter } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AlbumModel } from '../../../services/album/album-model';

@Component({
    selector: 'app-album-placeholder',
    templateUrl: './album-placeholder.component.html',
    styleUrls: ['./album-placeholder.component.scss'],
    host: { style: 'display: block; width: 100%;height: 100%' },
    animations: [
        trigger('albumFadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.8)' }),
                animate('0.6s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
        ]),
    ],
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
