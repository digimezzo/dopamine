import { Injectable } from '@angular/core';
import { PlaybackInformation } from '../playback-information/playback-information';
import { MediaSessionProxy } from '../../common/io/media-session-proxy';
import { SettingsBase } from '../../common/settings/settings.base';
import { TrackModel } from '../track/track-model';
import { MetadataServiceBase } from '../metadata/metadata.service.base';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaSessionService {
    private playEvent = new Subject<void>();
    private pauseEvent = new Subject<void>();
    private previousTrackEvent = new Subject<void>();
    private nextTrackEvent = new Subject<void>();

    public constructor(
        private metadataService: MetadataServiceBase,
        private mediaSessionProxy: MediaSessionProxy,
    ) {}

    public playEvent$: Observable<void> = this.playEvent.asObservable();
    public pauseEvent$: Observable<void> = this.pauseEvent.asObservable();
    public previousTrackEvent$: Observable<void> = this.previousTrackEvent.asObservable();
    public nextTrackEvent$: Observable<void> = this.nextTrackEvent.asObservable();

    public initialize(): void {
        this.enableOrDisableMediaKeys();
    }

    private enableOrDisableMediaKeys(): void {
        this.mediaSessionProxy.setActionHandler('play', () => this.playEvent.next());
        this.mediaSessionProxy.setActionHandler('pause', () => this.pauseEvent.next());
        this.mediaSessionProxy.setActionHandler('previoustrack', () => this.previousTrackEvent.next());
        this.mediaSessionProxy.setActionHandler('nexttrack', () => this.nextTrackEvent.next());
    }

    public async setMetadataAsync(track: TrackModel): Promise<void> {
        const playbackInformation: PlaybackInformation = await this.createPlaybackInformationAsync(track);

        this.mediaSessionProxy.setMetadata(
            playbackInformation.track?.title ?? '',
            playbackInformation.track?.artists ?? '',
            playbackInformation.track?.albumTitle ?? '',
            playbackInformation.imageUrl,
        );
    }

    private async createPlaybackInformationAsync(track: TrackModel | undefined): Promise<PlaybackInformation> {
        if (track != undefined) {
            const newImage: string = await this.metadataService.createImageUrlAsync(track, 0);

            return new PlaybackInformation(track, newImage);
        }

        return new PlaybackInformation(undefined, '');
    }
}
