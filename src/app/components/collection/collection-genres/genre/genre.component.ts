import { Component, Input, OnInit } from '@angular/core';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { GenreModel } from '../../../../services/genre/genre-model';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';

@Component({
    selector: 'app-genre',
    host: { style: 'display: block' },
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService, public semanticZoomService: BaseSemanticZoomService) {}

    @Input() public genre: GenreModel;

    public ngOnInit(): void {}

    public requestZoomOut(): void {
        this.semanticZoomService.requestZoomOut();
    }
}
