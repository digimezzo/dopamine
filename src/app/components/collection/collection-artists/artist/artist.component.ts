import { Component, Input, OnInit } from '@angular/core';
import { ArtistModel } from '../../../../services/artist/artist-model';

@Component({
    selector: 'app-artist',
    host: { style: 'display: block' },
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
    constructor() {}

    @Input() public artist: ArtistModel;

    public ngOnInit(): void {}
}
