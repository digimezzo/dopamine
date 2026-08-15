import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';

@Component({
    selector: 'app-collection-playback-pane',
    host: { style: 'display: block' },
    templateUrl: './collection-playback-pane.component.html',
    styleUrls: ['./collection-playback-pane.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionPlaybackPaneComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
        private navigationService: NavigationServiceBase,
        private dialogService: DialogServiceBase,
    ) {}

    public showPlaybackQueue(): void {
        this.navigationService.showPlaybackQueue();
    }

    public async showNowPlayingAsync(): Promise<void> {
        await this.navigationService.navigateToNowPlayingAsync();
    }

    public async showHighlightsAsync(): Promise<void> {
        await this.navigationService.navigateToHighlightsAsync();
    }

    public async showEqualizerAsync(): Promise<void> {
        await this.dialogService.showEqualizerDialogAsync();
    }
}
