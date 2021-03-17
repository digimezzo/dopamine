import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';

@Component({
    selector: 'app-collection-artists',
    templateUrl: './collection-artists.component.html',
    styleUrls: ['./collection-artists.component.scss'],
})
export class CollectionArtistsComponent implements OnInit, OnDestroy {
    constructor(public playbackService: BasePlaybackService, private settings: BaseSettings) {}

    private subscription: Subscription = new Subscription();

    public leftPaneSize: number = this.settings.artistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.artistsLeftPaneWidthPercent - this.settings.artistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.artistsRightPaneWidthPercent;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {}

    public splitDragEnd(event: any): void {
        this.settings.artistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.artistsRightPaneWidthPercent = event.sizes[2];
    }
}
