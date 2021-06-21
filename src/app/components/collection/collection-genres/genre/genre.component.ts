import { Component, Input, OnInit } from '@angular/core';
import { GenreModel } from '../../../../services/genre/genre-model';

@Component({
    selector: 'app-genre',
    host: { style: 'display: block' },
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit {
    constructor() {}

    @Input() public genre: GenreModel;

    public ngOnInit(): void {}
}
