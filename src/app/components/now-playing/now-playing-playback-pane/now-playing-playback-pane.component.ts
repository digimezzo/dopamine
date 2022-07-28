import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';

@Component({
    selector: 'app-now-playing-playback-pane',
    host: { style: 'display: block' },
    templateUrl: './now-playing-playback-pane.component.html',
    styleUrls: ['./now-playing-playback-pane.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingPlaybackPaneComponent implements OnInit {
    constructor(private navigationService: BaseNavigationService) {}

    public ngOnInit(): void {}

    public showPlaybackQueue(): void {
        this.navigationService.showPlaybackQueue();
    }
}
