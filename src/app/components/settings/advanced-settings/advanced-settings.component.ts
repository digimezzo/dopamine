import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';

@Component({
    selector: 'app-advanced-settings',
    host: { style: 'display: block' },
    templateUrl: './advanced-settings.component.html',
    styleUrls: ['./advanced-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdvancedSettingsComponent implements OnInit {
    constructor(public settings: BaseSettings) {}

    public ngOnInit(): void {}
}
