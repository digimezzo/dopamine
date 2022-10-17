import { Component, Input, OnInit } from '@angular/core';
import { ListItemStyler } from '../../../../common/styling/list-item-styler';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';

@Component({
    selector: 'app-artist',
    host: { style: 'display: block' },
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
    constructor(public listItemStyler: ListItemStyler, public semanticZoomService: BaseSemanticZoomService) {}

    @Input() public artist: ArtistModel;

    public ngOnInit(): void {}

    public requestZoomOut(): void {
        this.semanticZoomService.requestZoomOut();
    }
}
