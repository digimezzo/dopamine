import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BaseAppearanceService } from '../appearance/base-appearance.service';
import { BaseNavigationService } from './base-navigation.service';

@Injectable()
export class NavigationService implements BaseNavigationService {
    private showPlaybackQueueRequested: Subject<void> = new Subject();

    public constructor(private appearanceService: BaseAppearanceService, public router: Router) {}

    public showPlaybackQueueRequested$: Observable<void> = this.showPlaybackQueueRequested.asObservable();

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

    public showPlaybackQueue(): void {
        this.showPlaybackQueueRequested.next();
    }
}
