import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-text-icon-secondary-button',
    templateUrl: './text-icon-secondary-button.component.html',
    styleUrls: ['./text-icon-secondary-button.component.scss'],
    host: {
        style: 'display: inline-block',
    },
})
export class TextIconSecondaryButtonComponent {
    @Input() public icon: string;
}
