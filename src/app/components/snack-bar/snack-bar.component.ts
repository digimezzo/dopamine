import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BaseDesktop } from '../../common/io/base-desktop';
import { BaseSnackBarService } from '../../services/snack-bar/base-snack-bar.service';

@Component({
    selector: 'app-snack-bar',
    host: { style: 'display: block' },
    templateUrl: './snack-bar.component.html',
    styleUrls: ['./snack-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SnackBarComponent {
    constructor(private snackBarService: BaseSnackBarService, private desktop: BaseDesktop, @Inject(MAT_SNACK_BAR_DATA) public data: any) {}

    public openDataUrl(): void {
        this.desktop.openLink(this.data.url);
    }

    public async dismissAsync(): Promise<void> {
        this.snackBarService.dismissAsync();
    }
}
