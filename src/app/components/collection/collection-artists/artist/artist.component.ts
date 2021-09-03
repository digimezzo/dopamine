import { Component, Input, OnInit } from '@angular/core';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { ArtistModel } from '../../../../services/artist/artist-model';

@Component({
    selector: 'app-artist',
    host: { style: 'display: block' },
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService) {}

    @Input() public artist: ArtistModel;

    public ngOnInit(): void {}
}
