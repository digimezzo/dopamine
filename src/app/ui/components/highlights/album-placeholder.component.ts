import { Component } from '@angular/core';

@Component({
    selector: 'app-album-placeholder',
    templateUrl: './album-placeholder.component.html',
    styleUrls: ['./album-placeholder.component.scss'],
    host: { style: 'display: block; width: 100%;height: 100%' },
})
export class AlbumPlaceholderComponent {}
