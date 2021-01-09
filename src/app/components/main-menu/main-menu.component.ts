import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';

@Component({
    selector: 'app-main-menu',
    host: { style: 'display: block' },
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MainMenuComponent implements OnInit {
    constructor(private navigationService: BaseNavigationService) {}

    public ngOnInit(): void {}

    public goToManageCollection(): void {
        this.navigationService.navigateToManageCollection();
    }

    public goToSettings(): void {
        this.navigationService.navigateToSettings();
    }

    public goToInformation(): void {
        this.navigationService.navigateToInformation();
    }
}
