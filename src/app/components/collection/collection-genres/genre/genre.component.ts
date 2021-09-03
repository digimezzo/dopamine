import { Component, Input, OnInit } from '@angular/core';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { GenreModel } from '../../../../services/genre/genre-model';

@Component({
    selector: 'app-genre',
    host: { style: 'display: block' },
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService) {}

    @Input() public genre: GenreModel;

    public ngOnInit(): void {}
}
