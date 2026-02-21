import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { Injectable } from '@angular/core';
import { PlaybackService } from '../playback/playback.service';
import { PlaylistServiceBase } from '../playlist/playlist.service.base';
import { PromiseUtils } from '../../common/utils/promise-utils';

@Injectable({ providedIn: 'root' })
export class LifetimeService {
    private _isPerformingClosingTasks: boolean = false;

    public constructor(
        private playbackService: PlaybackService,
        private playlistService: PlaylistServiceBase,
        private ipcProxy: IpcProxyBase,
    ) {}

    public get isPerformingClosingTasks(): boolean {
        return this._isPerformingClosingTasks;
    }

    public initialize(): void {
        this.ipcProxy.onApplicationClose$.subscribe(() => {
            PromiseUtils.noAwait(this.performClosingTasksAsync());
        });
    }

    private async performClosingTasksAsync(): Promise<void> {
        this._isPerformingClosingTasks = true;

        while (this.playlistService.isUpdatingPlaylistFile) {
            // Wait for 100ms before checking again
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        this.playbackService.saveQueue();

        this.ipcProxy.sendToMainProcess('closing-tasks-performed', undefined);
    }
}
