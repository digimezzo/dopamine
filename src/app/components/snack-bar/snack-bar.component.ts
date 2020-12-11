import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Desktop } from '../../core/io/desktop';
import { BaseSnackBarService } from '../../services/snack-bar/base-snack-bar.service';

@Component({
    selector: 'app-snack-bar',
    host: { 'style': 'display: block' },
    templateUrl: './snack-bar.component.html',
    styleUrls: ['./snack-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SnackBarComponent implements OnInit {

    constructor(
        public snackBarService: BaseSnackBarService,
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private desktop: Desktop) {
        this.showCloseButton = data.showCloseButton;
    }

    public showCloseButton: boolean;

    public ngOnInit(): void {
    }

    public openDataUrl() {
        this.desktop.openLink(this.data.url);
    }
}
