import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-playback-indicator',
    host: { style: 'display: block' },
    templateUrl: './playback-indicator.component.html',
    styleUrls: ['./playback-indicator.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackIndicatorComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    @Input()
    public isSelected: boolean;
}
