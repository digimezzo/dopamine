import { Injectable } from '@angular/core';
import { PlaybackInformation } from '../playback-information/playback-information';
import { MediaSessionProxy } from '../../common/io/media-session-proxy';
import { TrackModel } from '../track/track-model';
import { Observable, Subject } from 'rxjs';
import * as remote from '@electron/remote';
import { PlaybackInformationFactory } from '../playback-information/playback-information.factory';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { Menu } from 'electron';

@Injectable({ providedIn: 'root' })
export class MediaSessionService {
    private playEvent = new Subject<void>();
    private pauseEvent = new Subject<void>();
    private previousTrackEvent = new Subject<void>();
    private nextTrackEvent = new Subject<void>();

    public constructor(
        private playbackInformationFactory: PlaybackInformationFactory,
        private mediaSessionProxy: MediaSessionProxy,
        private translatorService: TranslatorServiceBase,
    ) {}

    public playEvent$: Observable<void> = this.playEvent.asObservable();
    public pauseEvent$: Observable<void> = this.pauseEvent.asObservable();
    public previousTrackEvent$: Observable<void> = this.previousTrackEvent.asObservable();
    public nextTrackEvent$: Observable<void> = this.nextTrackEvent.asObservable();

    public initialize(): void {
        this.mediaSessionProxy.setActionHandler('play', () => this.playEvent.next());
        this.mediaSessionProxy.setActionHandler('pause', () => this.pauseEvent.next());
        this.mediaSessionProxy.setActionHandler('previoustrack', () => this.previousTrackEvent.next());
        this.mediaSessionProxy.setActionHandler('nexttrack', () => this.nextTrackEvent.next());
    }

    public async setMetadataAsync(track: TrackModel): Promise<void> {
        const playbackInformation: PlaybackInformation = await this.playbackInformationFactory.createAsync(track);

        this.mediaSessionProxy.setMetadata(
            playbackInformation.track?.title ?? '',
            playbackInformation.track?.artists ?? '',
            playbackInformation.track?.albumTitle ?? '',
            playbackInformation.imageUrl,
        );
    }

    public getDockMenu(): Menu {
        const menu = new remote.Menu();
        menu.append(new remote.MenuItem({ label: this.translatorService.get('play'), click: () => this.playEvent.next() }));
        menu.append(new remote.MenuItem({ label: this.translatorService.get('pause'), click: () => this.pauseEvent.next() }));
        menu.append(new remote.MenuItem({ label: this.translatorService.get('previous'), click: () => this.previousTrackEvent.next() }));
        menu.append(new remote.MenuItem({ label: this.translatorService.get('next'), click: () => this.nextTrackEvent.next() }));
        return menu;
    }

}
