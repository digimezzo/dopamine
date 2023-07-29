import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseMediaSessionProxy } from '../../common/io/base-media-session-proxy';
import { BaseSettings } from '../../common/settings/base-settings';
import { BasePlaybackInformationService } from '../playback-information/base-playback-information.service';
import { PlaybackInformation } from '../playback-information/playback-information';
import { BasePlaybackService } from '../playback/base-playback.service';
import { BaseMediaSessionService } from './base-media-session.service';

@Injectable()
export class MediaSessionService implements BaseMediaSessionService {
    private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: BasePlaybackService,
        private playbackInformationService: BasePlaybackInformationService,
        private mediaSessionProxy: BaseMediaSessionProxy,
        private settings: BaseSettings
    ) {}

    public get enableMultimediaKeys(): boolean {
        return this.settings.enableMultimediaKeys;
    }
    public set enableMultimediaKeys(v: boolean) {
        this.settings.enableMultimediaKeys = v;
        this.enableOrDisableMetadataSubscriptions();
        this.enableOrDisableMediaKeys();
    }

    public initialize(): void {
        this.enableOrDisableMetadataSubscriptions();
        this.enableOrDisableMediaKeys();
    }

    private enableOrDisableMediaKeys(): void {
        if (this.settings.enableMultimediaKeys) {
            this.mediaSessionProxy.setActionHandler('play', () => this.playbackService.togglePlayback());
            this.mediaSessionProxy.setActionHandler('pause', () => this.playbackService.togglePlayback());
            this.mediaSessionProxy.setActionHandler('previoustrack', () => this.playbackService.playPrevious());
            this.mediaSessionProxy.setActionHandler('nexttrack', () => this.playbackService.playNext());
        } else {
            this.mediaSessionProxy.clearActionHandler('play');
            this.mediaSessionProxy.clearActionHandler('pause');
            this.mediaSessionProxy.clearActionHandler('previoustrack');
            this.mediaSessionProxy.clearActionHandler('nexttrack');
        }
    }

    private enableOrDisableMetadataSubscriptions(): void {
        if (this.settings.enableMultimediaKeys) {
            this.subscription.add(
                this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    this.setMetadata(playbackInformation);
                })
            );

            this.subscription.add(
                this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    this.setMetadata(playbackInformation);
                })
            );
        } else {
            this.subscription.unsubscribe();
            this.mediaSessionProxy.clearMetadata();
        }
    }

    private setMetadata(playbackInformation: PlaybackInformation): void {
        this.mediaSessionProxy.setMetadata(
            playbackInformation.track.title,
            playbackInformation.track.artists,
            playbackInformation.track.albumTitle,
            playbackInformation.imageUrl
        );
    }
}
