import { Component, Input, OnInit } from '@angular/core';
import { AlbumModel } from '../../services/album/album-model';

@Component({
    selector: 'app-album',
    host: { style: 'display: block' },
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
    constructor() {}

    @Input() public album: AlbumModel;

    public ngOnInit(): void {}
}
