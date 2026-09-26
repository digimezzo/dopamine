import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent {
    public constructor(public settings: SettingsBase) {}

    @Input()
    public isChecked: boolean = false;

    @Input()
    public isDisabled: boolean = false;

    @Output()
    public isCheckedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public onCheckedChanged(checked: boolean): void {
        if (this.isDisabled) {
            return;
        }

        this.isChecked = checked;
        this.isCheckedChange.emit(this.isChecked);
    }
}
