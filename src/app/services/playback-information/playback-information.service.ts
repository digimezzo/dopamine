import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { PromiseUtils } from '../../common/utils/promise-utils';

import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';

import { PlaybackInformation } from './playback-information';
import { PlaybackInformationServiceBase } from './playback-information.service.base';
import { PlaybackServiceBase } from '../playback/playback.service.base';
import { MetadataServiceBase } from '../metadata/metadata.service.base';
import { Constants } from '../../common/application/constants';

@Injectable()
export class PlaybackInformationService implements PlaybackInformationServiceBase {
    private subscription: Subscription = new Subscription();
    private playingNextTrack: Subject<PlaybackInformation> = new Subject();
    private playingPreviousTrack: Subject<PlaybackInformation> = new Subject();
    private playingNoTrack: Subject<PlaybackInformation> = new Subject();

    private cachedPlaybackinformation: PlaybackInformation | undefined;

    public constructor(
        private playbackService: PlaybackServiceBase,
        private metadataService: MetadataServiceBase,
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
        if (
            this.cachedPlaybackinformation?.track != undefined &&
            this.playbackService.currentTrack != undefined &&
            this.cachedPlaybackinformation.track.path === this.playbackService.currentTrack.path
        ) {
            return this.cachedPlaybackinformation;
        }

        this.cachedPlaybackinformation = await this.createPlaybackInformationAsync(this.playbackService.currentTrack);

        return this.cachedPlaybackinformation;
    }

    private async handlePlaybackStartedAsync(playbackStarted: PlaybackStarted): Promise<void> {
        const playbackInformation: PlaybackInformation = await this.createPlaybackInformationAsync(playbackStarted.currentTrack);

        if (playbackStarted.isPlayingPreviousTrack) {
            this.playingPreviousTrack.next(playbackInformation);
        } else {
            this.playingNextTrack.next(playbackInformation);
        }
    }

    private async handlePlaybackStoppedAsync(): Promise<void> {
        const playbackInformation: PlaybackInformation = await this.createPlaybackInformationAsync(undefined);
        this.playingNoTrack.next(playbackInformation);
    }

    private async createPlaybackInformationAsync(track: TrackModel | undefined): Promise<PlaybackInformation> {
        if (track != undefined) {
            const newImage: string = await this.metadataService.createImageUrlAsync(track, Constants.maximumNowPlayingArtSizePixels);

            return new PlaybackInformation(track, newImage);
        }

        return new PlaybackInformation(undefined, '');
    }
}
