import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-transparent-button',
    templateUrl: './transparent-button.component.html',
    styleUrls: ['./transparent-button.component.scss'],
    host: {
        style: 'display: inline-block',
    },
})
export class TransparentButtonComponent {
    @Input()
    public fill: boolean = false;
}
