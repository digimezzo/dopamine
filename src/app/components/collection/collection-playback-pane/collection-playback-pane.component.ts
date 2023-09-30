import { Component, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';

@Component({
    selector: 'app-collection-playback-pane',
    host: { style: 'display: block' },
    templateUrl: './collection-playback-pane.component.html',
    styleUrls: ['./collection-playback-pane.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionPlaybackPaneComponent {
    public constructor(public appearanceService: BaseAppearanceService, private navigationService: BaseNavigationService) {}

    public showPlaybackQueue(): void {
        this.navigationService.showPlaybackQueue();
    }

    public showNowPlaying(): void {
        this.navigationService.navigateToNowPlayingAsync();
    }
}
