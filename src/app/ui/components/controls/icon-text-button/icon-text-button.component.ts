import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-text-button',
    templateUrl: './icon-text-button.component.html',
    styleUrls: ['./icon-text-button.component.scss'],
    host: {
        style: 'display: inline-block',
    },
})
export class IconTextButtonComponent {
    @Input() public icon: string;
}
