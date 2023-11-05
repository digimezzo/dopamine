import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-totals',
    templateUrl: './totals.component.html',
    styleUrls: ['./totals.component.scss'],
})
export class TotalsComponent {
    @Input() public totalFileSizeInBytes: number = 0;
    @Input() public totalDurationInMilliseconds: number = 0;
}
