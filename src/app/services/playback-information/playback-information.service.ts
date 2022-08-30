import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { BaseMetadataService } from '../metadata/base-metadata.service';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { BasePlaybackInformationService } from './base-playback-information.service';
import { PlaybackInformation } from './playback-information';

@Injectable()
export class PlaybackInformationService implements BasePlaybackInformationService {
    private subscription: Subscription = new Subscription();
    private playingNextTrack: Subject<PlaybackInformation> = new Subject();
    private playingPreviousTrack: Subject<PlaybackInformation> = new Subject();
    private playingNoTrack: Subject<PlaybackInformation> = new Subject();

    constructor(private playbackService: BasePlaybackService, private metadataService: BaseMetadataService) {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                const playbackInformation: PlaybackInformation = await this.createPlaybackInformationAsync(playbackStarted.currentTrack);

                if (playbackStarted.isPlayingPreviousTrack) {
                    this.playingPreviousTrack.next(playbackInformation);
                } else {
                    this.playingNextTrack.next(playbackInformation);
                }
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(async () => {
                const playbackInformation: PlaybackInformation = await this.createPlaybackInformationAsync(undefined);
                this.playingNoTrack.next(playbackInformation);
            })
        );
    }

    public playingNextTrack$: Observable<PlaybackInformation> = this.playingNextTrack.asObservable();
    public playingPreviousTrack$: Observable<PlaybackInformation> = this.playingPreviousTrack.asObservable();
    public playingNoTrack$: Observable<PlaybackInformation> = this.playingNoTrack.asObservable();

    public async getCurrentPlaybackInformationAsync(): Promise<PlaybackInformation> {
        return await this.createPlaybackInformationAsync(this.playbackService.currentTrack);
    }

    private async createPlaybackInformationAsync(track: TrackModel): Promise<PlaybackInformation> {
        if (track != undefined) {
            const newImage: string = await this.metadataService.createImageUrlAsync(track);

            return new PlaybackInformation(track, newImage);
        }

        return new PlaybackInformation(undefined, '');
    }
}
