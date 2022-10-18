import { Component, Input, OnInit } from '@angular/core';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';

@Component({
    selector: 'app-artist',
    host: { style: 'display: block' },
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService, public semanticZoomService: BaseSemanticZoomService) {}

    @Input() public artist: ArtistModel;

    public ngOnInit(): void {}

    public requestZoomOut(): void {
        this.semanticZoomService.requestZoomOut();
    }
}
