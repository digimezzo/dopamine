import { Injectable } from '@angular/core';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { NavigationServiceBase } from '../navigation/navigation.service.base';

@Injectable({ providedIn: 'root' })
export class SwitchPlayerService {
    public constructor(
        private navigationService: NavigationServiceBase,
        private ipcProxy: IpcProxyBase,
        private settings: SettingsBase,
    ) {}

    public async togglePlayerAsync(): Promise<void> {
        if (this.settings.playerType === 'cover') {
            await this.navigationService.navigateToCollectionAsync();
            this.ipcProxy.sendToMainProcess('set-full-player', undefined);
        } else {
            await this.navigationService.navigateToCoverPlayerAsync();
            this.ipcProxy.sendToMainProcess('set-cover-player', undefined);
        }
    }
}
