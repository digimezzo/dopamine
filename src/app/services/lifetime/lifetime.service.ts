import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LifetimeService {
    public constructor(private ipcProxy: IpcProxyBase) {}

    public initialize(): void {
        this.ipcProxy.onApplicationClose$.subscribe(async () => {
            await this.performClosingTasksAsync();
        });
    }

    private async performClosingTasksAsync(): Promise<void> {
        // Perform closing tasks here

        this.ipcProxy.sendToMainProcess('closing-tasks-performed', undefined);
    }
}
