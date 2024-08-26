import { Injectable } from '@angular/core';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import {SettingsBase} from "../../common/settings/settings.base";

@Injectable({ providedIn: 'root' })
export class PlayerSwitcherService {
    public constructor(private ipcProxy: IpcProxyBase, private settings: SettingsBase) {}

    public togglePlayer(): void {
        if (this.settings.playerType === 'cover') {
            this.settings.playerType = 'full';
            this.ipcProxy.sendToMainProcess('set-full-player', undefined);
        } else {
            this.settings.playerType = 'cover';
            this.ipcProxy.sendToMainProcess('set-cover-player', undefined);
        }
    }
}
