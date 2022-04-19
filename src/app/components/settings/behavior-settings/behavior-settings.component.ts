import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';

@Component({
    selector: 'app-behavior-settings',
    host: { style: 'display: block' },
    templateUrl: './behavior-settings.component.html',
    styleUrls: ['./behavior-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BehaviorSettingsComponent implements OnInit {
    constructor(public settings: BaseSettings) {}

    public ngOnInit(): void {}
}
