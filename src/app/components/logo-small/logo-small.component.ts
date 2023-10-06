import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-logo-small',
    host: { style: 'display: block' },
    templateUrl: './logo-small.component.html',
    styleUrls: ['./logo-small.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LogoSmallComponent {}
