import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';

@Component({
    selector: 'app-collection-playlists',
    templateUrl: './collection-playlists.component.html',
    styleUrls: ['./collection-playlists.component.scss'],
})
export class CollectionPlaylistsComponent implements OnInit, OnDestroy {
    constructor(public playbackService: BasePlaybackService, private settings: BaseSettings) {}

    private subscription: Subscription = new Subscription();

    public leftPaneSize: number = this.settings.playlistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.playlistsLeftPaneWidthPercent - this.settings.playlistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.playlistsRightPaneWidthPercent;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {}

    public splitDragEnd(event: any): void {
        this.settings.playlistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.playlistsRightPaneWidthPercent = event.sizes[2];
    }
}
