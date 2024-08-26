import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-mini-player',
    host: { style: 'display: block' },
    templateUrl: './mini-player.component.html',
    styleUrls: ['./mini-player.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MiniPlayerComponent {
    public constructor() {}
}
