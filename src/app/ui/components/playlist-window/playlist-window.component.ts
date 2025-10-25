import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-playlist-window',
    templateUrl: './playlist-window.component.html',
    styleUrls: ['./playlist-window.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaylistWindowComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}
}
