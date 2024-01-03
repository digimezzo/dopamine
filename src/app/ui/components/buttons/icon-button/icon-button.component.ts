import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-button',
    templateUrl: './icon-button.component.html',
    styleUrls: ['./icon-button.component.scss'],
    host: {
        style: 'display: inline-block',
    },
})
export class IconButtonComponent {
    @Input() public icon: string;
}
