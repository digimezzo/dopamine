import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent {
    @Input()
    public isChecked: boolean = false;

    @Output()
    public isCheckedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public onCheckedChanged(checked: boolean): void {
        this.isChecked = checked;
        this.isCheckedChange.emit(this.isChecked);
    }
}
