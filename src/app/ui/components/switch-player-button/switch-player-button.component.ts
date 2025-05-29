import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SwitchPlayerService } from '../../../services/player-switcher/switch-player.service';

@Component({
    selector: 'app-switch-player-button',
    host: { style: 'display: block' },
    templateUrl: './switch-player-button.component.html',
    styleUrls: ['./switch-player-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SwitchPlayerButtonComponent {
    public constructor(public switchPlayerService: SwitchPlayerService) {}

    @Input()
    public highContrast: boolean = false;

    public async switchPlayerButtonClickAsync(): Promise<void> {
        await this.switchPlayerService.togglePlayerAsync();
    }
}
