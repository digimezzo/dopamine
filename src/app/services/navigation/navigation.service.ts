import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BaseNavigationService } from './base-navigation.service';

@Injectable()
export class NavigationService implements BaseNavigationService {
    private showPlaybackQueueRequested: Subject<void> = new Subject();

    constructor(public router: Router) {}

    public showPlaybackQueueRequested$: Observable<void> = this.showPlaybackQueueRequested.asObservable();

    public navigateToLoading(): void {
        this.router.navigate(['/loading']);
    }

    public navigateToCollection(): void {
        this.router.navigate(['/collection']);
    }

    public navigateToWelcome(): void {
        this.router.navigate(['/welcome']);
    }

    public navigateToManageCollection(): void {
        this.router.navigate(['/managecollection']);
    }

    public navigateToSettings(): void {
        this.router.navigate(['/settings']);
    }

    public navigateToInformation(): void {
        this.router.navigate(['/information']);
    }

    public showPlaybackQueue(): void {
        this.showPlaybackQueueRequested.next();
    }
}
