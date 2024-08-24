import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TrayServiceBase } from '../../../../services/tray/tray.service.base';
import { MediaSessionServiceBase } from '../../../../services/media-session/media-session.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { CollectionUtils } from '../../../../common/utils/collections-utils';

@Component({
    selector: 'app-behavior-settings',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './behavior-settings.component.html',
    styleUrls: ['./behavior-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BehaviorSettingsComponent implements OnInit {
    public constructor(
        public trayService: TrayServiceBase,
        public mediaSessionService: MediaSessionServiceBase,
        public settings: SettingsBase,
    ) {}

    public ngOnInit(): void {
        this.artistSplitSeparators = CollectionUtils.fromString(this.settings.artistSplitSeparators);
        this.artistSplitExceptions = CollectionUtils.fromString(this.settings.artistSplitExceptions);
    }

    public artistSplitSeparators: string[] = [];
    public artistSplitExceptions: string[] = [];

    public addSplitSeparator(): void {}

    public addSplitException(): void {}
}
