import { Injectable, Type } from '@angular/core';
import { Subscription } from 'rxjs';
import { BasePlaybackService } from '../playback/base-playback.service';
import { BaseMediaSessionService } from './base-media-session.service';
import { BasePlaybackInformationService } from '../playback-information/base-playback-information.service';
import { PlaybackInformation } from '../playback-information/playback-information';


@Injectable()
export class MediaSessionService implements BaseMediaSessionService {
    private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: BasePlaybackService,
        private playbackInformationService: BasePlaybackInformationService
    ) {}

    public initialize(): void {
        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                this.changeMetadata(playbackInformation);
            })
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                this.changeMetadata(playbackInformation);
            })
        );

        this.initializeMediaKey();
    }

    private initializeMediaKey(): void {
        window.navigator.mediaSession.setActionHandler('play', () => this.playbackService.togglePlayback());
        window.navigator.mediaSession.setActionHandler('pause', () => this.playbackService.togglePlayback());
        window.navigator.mediaSession.setActionHandler('previoustrack', () => this.playbackService.playPrevious());
        window.navigator.mediaSession.setActionHandler('nexttrack', () => this.playbackService.playNext());
    }

    private changeMetadata(playbackInformation: PlaybackInformation): void {
        window.navigator.mediaSession.metadata = new MediaMetadata({
            title: playbackInformation.track.title,
            artist: playbackInformation.track.artists,
            album: playbackInformation.track.albumTitle,
            artwork: [
                {
                    src: playbackInformation.imageUrl
                }
            ]
        });
    }
}