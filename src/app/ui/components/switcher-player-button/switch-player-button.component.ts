import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { IndexingServiceBase } from '../../../services/indexing/indexing.service.base';
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

    public async switchPlayerButtonClickAsync(): Promise<void> {
        await this.switchPlayerService.togglePlayerAsync();
    }
}
