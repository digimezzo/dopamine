import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { PlaybackStarted } from '../playback/playback-started';
import { PlaybackInformation } from './playback-information';
import { PlaybackService } from '../playback/playback.service';
import { PlaybackInformationFactory } from './playback-information.factory';

@Injectable({ providedIn: 'root' })
export class PlaybackInformationService {
    private subscription: Subscription = new Subscription();
    private playingNextTrack: Subject<PlaybackInformation> = new Subject();
    private playingPreviousTrack: Subject<PlaybackInformation> = new Subject();
    private playingNoTrack: Subject<PlaybackInformation> = new Subject();

    public constructor(
        private playbackService: PlaybackService,
        private playbackInformationFactory: PlaybackInformationFactory,
    ) {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                PromiseUtils.noAwait(this.handlePlaybackStartedAsync(playbackStarted));
            }),
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                PromiseUtils.noAwait(this.handlePlaybackStoppedAsync());
            }),
        );
    }

    public playingNextTrack$: Observable<PlaybackInformation> = this.playingNextTrack.asObservable();
    public playingPreviousTrack$: Observable<PlaybackInformation> = this.playingPreviousTrack.asObservable();
    public playingNoTrack$: Observable<PlaybackInformation> = this.playingNoTrack.asObservable();

    public async getCurrentPlaybackInformationAsync(): Promise<PlaybackInformation> {
        return await this.playbackInformationFactory.createAsync(this.playbackService.currentTrack);
    }

    private async handlePlaybackStartedAsync(playbackStarted: PlaybackStarted): Promise<void> {
        const playbackInformation: PlaybackInformation = await this.playbackInformationFactory.createAsync(playbackStarted.currentTrack);

        if (playbackStarted.isPlayingPreviousTrack) {
            this.playingPreviousTrack.next(playbackInformation);
        } else {
            this.playingNextTrack.next(playbackInformation);
        }
    }

    private async handlePlaybackStoppedAsync(): Promise<void> {
        const playbackInformation: PlaybackInformation = await this.playbackInformationFactory.createAsync(undefined);
        this.playingNoTrack.next(playbackInformation);
    }
}
