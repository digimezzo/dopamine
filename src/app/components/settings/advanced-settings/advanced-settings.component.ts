import { Component, ViewEncapsulation } from '@angular/core';
import { LogViewer } from '../../../common/io/log-viewer';
import { BaseSettings } from '../../../common/settings/base-settings';

@Component({
    selector: 'app-advanced-settings',
    host: { style: 'display: block' },
    templateUrl: './advanced-settings.component.html',
    styleUrls: ['./advanced-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdvancedSettingsComponent {
    public constructor(public settings: BaseSettings, private logViewer: LogViewer) {}

    public viewLog(): void {
        this.logViewer.viewLog();
    }
}
