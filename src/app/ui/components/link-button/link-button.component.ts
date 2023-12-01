import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-link-button',
    host: { style: 'display: block' },
    templateUrl: './link-button.component.html',
    styleUrls: ['./link-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LinkButtonComponent {
    @Input() public icon: string;
    @Input() public text: string;
}
