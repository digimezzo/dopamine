import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlbumModel } from '../../../../services/album/album-model';

@Component({
    selector: 'app-album',
    host: { style: 'display: block' },
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
    constructor(public sanitizer: DomSanitizer) {}

    @Input() public album: AlbumModel;
    @Input() public isSelected: boolean = false;

    public ngOnInit(): void {}
}
