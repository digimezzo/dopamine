import { Injectable } from '@angular/core';
import { ApplicationBase } from '../../common/io/application.base';
import { PlaybackService } from '../playback/playback.service';

@Injectable({ providedIn: 'root' })
export class RemotePlaybackQueueServerService {
    private globalEmitter: any;
    private getQueueListener: any = this.getQueueHandler.bind(this);

    public constructor(
        private playbackService: PlaybackService,
        private application: ApplicationBase,
    ) {
        this.globalEmitter = this.application.getGlobal('globalEmitter');
    }

    public initialize(): void {
        this.globalEmitter.on('get-queue', this.getQueueListener);
    }

    private async getQueueHandler(callback: any): Promise<void> {
        callback(this.playbackService.playbackQueue);
    }
}
