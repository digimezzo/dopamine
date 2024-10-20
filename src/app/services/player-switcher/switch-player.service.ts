import { Injectable } from '@angular/core';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { NavigationServiceBase } from '../navigation/navigation.service.base';
import { Logger } from '../../common/logger';

@Injectable({ providedIn: 'root' })
export class SwitchPlayerService {
    public constructor(
        private navigationService: NavigationServiceBase,
        private ipcProxy: IpcProxyBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public async togglePlayerAsync(): Promise<void> {
        this.logger.info('Switching player', 'SwitchPlayerService', 'togglePlayerAsync');
        if (this.settings.playerType === 'cover') {
            this.logger.info('Detected playerType cover.', 'SwitchPlayerService', 'togglePlayerAsync');
            this.settings.playerType = 'full';
            await this.navigationService.navigateToCollectionAsync();
            this.logger.info('Requesting to set full player.', 'SwitchPlayerService', 'togglePlayerAsync');
            this.ipcProxy.sendToMainProcess('set-full-player', undefined);
        } else {
            this.logger.info('Detected playerType full.', 'SwitchPlayerService', 'togglePlayerAsync');
            this.settings.playerType = 'cover';
            await this.navigationService.navigateToCoverPlayerAsync();
            this.logger.info('Requesting to set cover player.', 'SwitchPlayerService', 'togglePlayerAsync');
            this.ipcProxy.sendToMainProcess('set-cover-player', undefined);
        }
    }
}
