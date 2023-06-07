import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import * as os from 'os';
import { BaseIpcProxy } from '../../common/io/base-ipc-proxy';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseTrayService } from './base-tray.service';
@Injectable()
export class TrayService implements BaseTrayService {
    private subscription: Subscription = new Subscription();

    constructor(private translatorService: BaseTranslatorService, private settings: BaseSettings, private ipcProxy: BaseIpcProxy) {
        this.subscription.add(
            this.translatorService.languageChanged$.subscribe(() => {
                this.updateTrayContextMenu();
            })
        );

        this.updateTrayContextMenu();
    }

    public get invertNotificationAreaIconColor(): boolean {
        return this.settings.invertNotificationAreaIconColor;
    }

    public set invertNotificationAreaIconColor(v: boolean) {
        this.settings.invertNotificationAreaIconColor = v;
        this.updateTrayIcon();
    }

    public get needInvertNotificationAreaIconColor(): boolean {
        return os.platform() !== 'darwin';
    }

    public updateTrayContextMenu(): void {
        const arg: any = { showDopamineLabel: this.translatorService.get('show-dopamine'), exitLabel: this.translatorService.get('exit') };
        this.ipcProxy.sendToMainProcess('update-tray-context-menu', arg);
    }

    private updateTrayIcon(): void {
        this.ipcProxy.sendToMainProcess('update-tray-icon', undefined);
    }
}
