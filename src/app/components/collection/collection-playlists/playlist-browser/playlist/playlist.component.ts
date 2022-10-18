import { Component, Input, OnInit } from '@angular/core';
import { BaseAppearanceService } from '../../../../../services/appearance/base-appearance.service';
import { PlaylistModel } from '../../../../../services/playlist/playlist-model';

@Component({
    selector: 'app-playlist',
    host: { style: 'display: block' },
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService) {}

    @Input() public playlist: PlaylistModel;
    @Input() public isSelected: boolean = false;

    public ngOnInit(): void {}
}
