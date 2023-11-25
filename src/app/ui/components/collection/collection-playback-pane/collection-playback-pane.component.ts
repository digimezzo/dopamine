import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { SpectrumAnalyzer } from '../../../../services/playback/spectrum-analyzer';

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
    ) {}

    public showPlaybackQueue(): void {
        this.navigationService.showPlaybackQueue();
    }

    public async showNowPlayingAsync(): Promise<void> {
        await this.navigationService.navigateToNowPlayingAsync();
    }
}
