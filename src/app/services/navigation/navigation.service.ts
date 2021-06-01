import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseNavigationService } from './base-navigation.service';

@Injectable()
export class NavigationService implements BaseNavigationService {
    constructor(public router: Router) {}
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
}
