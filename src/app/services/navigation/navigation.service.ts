import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BaseAppearanceService } from '../appearance/base-appearance.service';
import { BaseNavigationService } from './base-navigation.service';

@Injectable()
export class NavigationService implements BaseNavigationService {
    private showPlaybackQueueRequested: Subject<void> = new Subject();

    constructor(private appearanceService: BaseAppearanceService, public router: Router) {}

    public showPlaybackQueueRequested$: Observable<void> = this.showPlaybackQueueRequested.asObservable();

    public navigateToLoading(): void {
        this.router.navigate(['/loading']);
    }

    public navigateToCollection(): void {
        this.router.navigate(['/collection']);
        this.appearanceService.applyMargins(true);
    }

    public navigateToSettings(): void {
        this.router.navigate(['/settings']);
        this.appearanceService.applyMargins(false);
    }

    public navigateToInformation(): void {
        this.router.navigate(['/information']);
        this.appearanceService.applyMargins(false);
    }

    public navigateToWelcome(): void {
        this.router.navigate(['/welcome']);
    }

    public navigateToManageCollection(): void {
        this.router.navigate(['/managecollection']);
    }

    public navigateToNowPlaying(): void {
        this.router.navigate(['/nowplaying']);
    }

    public showPlaybackQueue(): void {
        this.showPlaybackQueueRequested.next();
    }
}
