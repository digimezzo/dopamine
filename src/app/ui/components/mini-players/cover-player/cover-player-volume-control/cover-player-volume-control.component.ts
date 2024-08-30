import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-cover-player-volume-control',
    host: { style: 'display: block' },
    templateUrl: './cover-player-volume-control.component.html',
    styleUrls: ['./cover-player-volume-control.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CoverPlayerVolumeControlComponent {
    public constructor() {}
}
