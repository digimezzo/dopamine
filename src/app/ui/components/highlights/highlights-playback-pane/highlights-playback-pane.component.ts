import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';

@Component({
    selector: 'app-highlights-playback-pane',
    host: { style: 'display: block' },
    templateUrl: './highlights-playback-pane.component.html',
    styleUrls: ['./highlights-playback-pane.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class HighlightsPlaybackPaneComponent {
    public constructor(private navigationService: NavigationServiceBase) {}

    public showPlaybackQueue(): void {
        this.navigationService.showPlaybackQueue();
    }
}
