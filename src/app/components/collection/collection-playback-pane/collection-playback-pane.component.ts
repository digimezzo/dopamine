import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';

@Component({
    selector: 'app-collection-playback-pane',
    host: { style: 'display: block' },
    templateUrl: './collection-playback-pane.component.html',
    styleUrls: ['./collection-playback-pane.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionPlaybackPaneComponent implements OnInit {
    constructor(private navigationService: BaseNavigationService) {}

    public ngOnInit(): void {}

    public showNowPlaying(): void {
        this.navigationService.showNowPlaying();
    }
}
