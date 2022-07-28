import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Component({
    selector: 'app-playback-indicator',
    host: { style: 'display: block' },
    templateUrl: './playback-indicator.component.html',
    styleUrls: ['./playback-indicator.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackIndicatorComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService) {}

    @Input()
    public isSelected: boolean;

    public ngOnInit(): void {}
}
