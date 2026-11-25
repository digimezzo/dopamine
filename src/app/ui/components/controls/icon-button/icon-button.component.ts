import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-button',
    templateUrl: './icon-button.component.html',
    styleUrls: ['./icon-button.component.scss'],
    standalone: false
})
export class IconButtonComponent {
    @Input() public icon: string;
}
