import { Component, Input, OnInit } from '@angular/core';
import { ISelectable } from '../../../../../common/styling/i-selectable';
import { ListItemStyler } from '../../../../../common/styling/list-item-styler';
import { PlaylistModel } from '../../../../../services/playlist/playlist-model';

@Component({
    selector: 'app-playlist',
    host: { style: 'display: block' },
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit, ISelectable {
    constructor(public listItemStyler: ListItemStyler) {}

    @Input() public playlist: PlaylistModel;
    @Input() public isSelected: boolean = false;

    public ngOnInit(): void {}
}
