import { Component, Input } from '@angular/core';
import { PlaylistModel } from '../../../../../../services/playlist/playlist-model';
import { AppearanceServiceBase } from '../../../../../../services/appearance/appearance.service.base';
import { PlaylistSessionService } from '../../../../../../services/playlist-session/playlist-session.service';
import { SettingsBase } from '../../../../../../common/settings/settings.base';

@Component({
    selector: 'app-playlist',
    host: { style: 'display: block' },
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
    standalone: false
})
export class PlaylistComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
        public playlistSessionService: PlaylistSessionService,
    ) {}

    @Input() public playlist: PlaylistModel;
    @Input() public isSelected: boolean = false;
}
