import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Component({
    selector: 'app-now-playing',
    host: { style: 'display: block' },
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService) {}

    public ngOnInit(): void {}
}
