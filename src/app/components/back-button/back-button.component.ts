import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';

@Component({
    selector: 'app-back-button',
    host: { style: 'display: block' },
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BackButtonComponent implements OnInit {
    constructor(public navigationService: BaseNavigationService, private indexingService: BaseIndexingService) {}

    public ngOnInit(): void {}

    public goBackToCollection(): void {
        this.navigationService.navigateToCollection();
        this.indexingService.indexCollectionIfFoldersHaveChangedAsync();
    }
}
