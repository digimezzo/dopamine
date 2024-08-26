import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-cover-player',
    host: { style: 'display: block' },
    templateUrl: './cover-player.component.html',
    styleUrls: ['./cover-player.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CoverPlayerComponent {
    public constructor() {}
}
