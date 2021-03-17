import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';

@Component({
    selector: 'app-collection-genres',
    templateUrl: './collection-genres.component.html',
    styleUrls: ['./collection-genres.component.scss'],
})
export class CollectionGenresComponent implements OnInit, OnDestroy {
    constructor(public playbackService: BasePlaybackService, private settings: BaseSettings) {}

    private subscription: Subscription = new Subscription();

    public leftPaneSize: number = this.settings.genresLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.genresLeftPaneWidthPercent - this.settings.genresRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.genresRightPaneWidthPercent;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {}

    public splitDragEnd(event: any): void {
        this.settings.genresLeftPaneWidthPercent = event.sizes[0];
        this.settings.genresRightPaneWidthPercent = event.sizes[2];
    }
}
