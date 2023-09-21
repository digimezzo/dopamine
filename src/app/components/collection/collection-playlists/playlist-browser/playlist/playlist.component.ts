import { Component, Input } from '@angular/core';
import { BaseAppearanceService } from '../../../../../services/appearance/base-appearance.service';
import { PlaylistModel } from '../../../../../services/playlist/playlist-model';

@Component({
    selector: 'app-playlist',
    host: { style: 'display: block' },
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent {
    public constructor(public appearanceService: BaseAppearanceService) {}

    @Input() public playlist: PlaylistModel;
    @Input() public isSelected: boolean = false;
}
