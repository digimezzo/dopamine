import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-totals',
    host: { style: 'display: block;' },
    templateUrl: './totals.component.html',
    styleUrls: ['./totals.component.scss'],
})
export class TotalsComponent {
    @Input() public totalFileSizeInBytes: number = 0;
    @Input() public totalDurationInMilliseconds: number = 0;
}
