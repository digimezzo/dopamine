import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseIpcProxy } from '../../common/io/base-ipc-proxy';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseTrayService } from './base-tray.service';
@Injectable()
export class TrayService implements BaseTrayService {
    private subscription: Subscription = new Subscription();

    constructor(private translatorService: BaseTranslatorService, private ipcProxy: BaseIpcProxy) {
        this.subscription.add(
            this.translatorService.languageChanged$.subscribe(() => {
                this.updateTrayContextMenu();
            })
        );

        this.updateTrayContextMenu();
    }

    public updateTrayContextMenu(): void {
        const arg: any = { showDopamineLabel: this.translatorService.get('show-dopamine'), exitLabel: this.translatorService.get('exit') };
        this.ipcProxy.sendToMainProcess('update-tray-context-menu', arg);
    }
}
