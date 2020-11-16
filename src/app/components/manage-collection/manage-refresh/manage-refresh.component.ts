import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../core/settings/base-settings';

@Component({
    selector: 'app-manage-refresh',
    templateUrl: './manage-refresh.component.html',
    styleUrls: ['./manage-refresh.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ManageRefreshComponent implements OnInit {
    constructor(public settings: BaseSettings) {
    }

    public ngOnInit(): void {
    }
}
