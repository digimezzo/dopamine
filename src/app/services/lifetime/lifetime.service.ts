import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { Injectable } from '@angular/core';
import { PlaybackServiceBase } from '../playback/playback.service.base';

@Injectable({ providedIn: 'root' })
export class LifetimeService {
    public constructor(
        private playbackService: PlaybackServiceBase,
        private ipcProxy: IpcProxyBase,
    ) {}

    public initialize(): void {
        this.ipcProxy.onApplicationClose$.subscribe(async () => {
            await this.performClosingTasksAsync();
        });
    }

    private async performClosingTasksAsync(): Promise<void> {
        await this.playbackService.saveQueueAsync();

        this.ipcProxy.sendToMainProcess('closing-tasks-performed', undefined);
    }
}
