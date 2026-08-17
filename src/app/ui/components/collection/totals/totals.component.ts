import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-totals',
    host: { style: 'display: block;' },
    templateUrl: './totals.component.html',
    styleUrls: ['./totals.component.scss'],
})
export class TotalsComponent {
    public constructor(public settings: SettingsBase) {}

    @Input() public totalFileSizeInBytes: number = 0;
    @Input() public totalDurationInMilliseconds: number = 0;
}
