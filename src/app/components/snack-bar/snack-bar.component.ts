import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BaseSnackBarService } from '../../services/snack-bar/base-snack-bar.service';
import { SnackBarData } from '../../services/snack-bar/snack-bar-data';

@Component({
    selector: 'app-snack-bar',
    host: { style: 'display: block' },
    templateUrl: './snack-bar.component.html',
    styleUrls: ['./snack-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SnackBarComponent {
    public constructor(private snackBarService: BaseSnackBarService, @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {}

    public dismiss(): void {
        this.snackBarService.dismiss();
    }
}
