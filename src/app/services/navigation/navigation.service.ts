import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NavigationServiceBase } from './navigation.service.base';
import { AppearanceServiceBase } from '../appearance/appearance.service.base';

@Injectable()
export class NavigationService implements NavigationServiceBase {
    private showPlaybackQueueRequested: Subject<void> = new Subject();
    private refreshPlaybackQueueListRequested: Subject<void> = new Subject();

    public constructor(
        private appearanceService: AppearanceServiceBase,
        public router: Router,
    ) {}

    public showPlaybackQueueRequested$: Observable<void> = this.showPlaybackQueueRequested.asObservable();
    public refreshPlaybackQueueListRequested$: Observable<void> = this.refreshPlaybackQueueListRequested.asObservable();

    public async navigateToLoadingAsync(): Promise<void> {
        await this.router.navigate(['/loading']);
    }

    public async navigateToCollectionAsync(): Promise<void> {
        await this.router.navigate(['/collection']);
        this.appearanceService.applyMargins(true);
    }

    public async navigateToSettingsAsync(): Promise<void> {
        await this.router.navigate(['/settings']);
        this.appearanceService.applyMargins(false);
    }

    public async navigateToInformationAsync(): Promise<void> {
        await this.router.navigate(['/information']);
        this.appearanceService.applyMargins(false);
    }

    public async navigateToWelcomeAsync(): Promise<void> {
        await this.router.navigate(['/welcome']);
    }

    public async navigateToManageCollectionAsync(): Promise<void> {
        await this.router.navigate(['/managecollection']);
    }

    public async navigateToNowPlayingAsync(): Promise<void> {
        await this.router.navigate(['/nowplaying']);
    }

    public async navigateToHighlightsAsync(): Promise<void> {
        await this.router.navigate(['/highlights']);
    }

    public async navigateToCoverPlayerAsync(): Promise<void> {
        await this.router.navigate(['/coverplayer']);
    }

    public showPlaybackQueue(): void {
        this.showPlaybackQueueRequested.next();
        this.refreshPlaybackQueueListRequested.next();
    }

    public refreshPlaybackQueueList(): void {
        this.refreshPlaybackQueueListRequested.next();
    }
}
