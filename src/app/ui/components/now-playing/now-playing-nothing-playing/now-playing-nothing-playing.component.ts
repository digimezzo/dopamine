import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-now-playing-nothing-playing',
    host: { style: 'display: block' },
    templateUrl: './now-playing-nothing-playing.component.html',
    styleUrls: ['./now-playing-nothing-playing.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingNothingPlayingComponent {
    public constructor() {}
}
