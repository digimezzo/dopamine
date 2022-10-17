import { Component, Input, OnInit } from '@angular/core';
import { ISelectable } from '../../../../common/styling/i-selectable';
import { ListItemStyler } from '../../../../common/styling/list-item-styler';
import { AlbumModel } from '../../../../services/album/album-model';

@Component({
    selector: 'app-album',
    host: { style: 'display: block' },
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit, ISelectable {
    constructor(public listItemStyler: ListItemStyler) {}

    @Input() public album: AlbumModel;
    @Input() public isSelected: boolean = false;

    public ngOnInit(): void {}
}
