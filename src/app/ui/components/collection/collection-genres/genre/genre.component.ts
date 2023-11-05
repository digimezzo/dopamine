import { Component, Input } from '@angular/core';
import { GenreModel } from '../../../../../services/genre/genre-model';
import { AppearanceServiceBase } from '../../../../../services/appearance/appearance.service.base';
import { SemanticZoomServiceBase } from '../../../../../services/semantic-zoom/semantic-zoom.service.base';

@Component({
    selector: 'app-genre',
    host: { style: 'display: block' },
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.scss'],
})
export class GenreComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public semanticZoomService: SemanticZoomServiceBase,
    ) {}

    @Input() public genre: GenreModel;

    public requestZoomOut(): void {
        this.semanticZoomService.requestZoomOut();
    }
}
