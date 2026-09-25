import { Injectable, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { DateProxy } from '../../common/io/date-proxy';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { PlaybackService } from '../playback/playback.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { DiscordApiCommandType } from './discord-api-command-type';
import { DiscordApiCommand } from './discord-api-command';
import { PresenceArgs } from './presence-args';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';

@Injectable({ providedIn: 'root' })
export class DiscordService {
    private _subscription: Subscription | undefined;
    private _updatePresenceTimeout: ReturnType<typeof setTimeout>;
    private _updatePresenceTimeoutMillis: number = 1000;
    private readonly _maximumCoverArtCacheEntries: number = 256;
    private _coverArtUrls: Map<string, string | undefined> = new Map();

    public constructor(
        private playbackService: PlaybackService,
        private translatorService: TranslatorServiceBase,
        private dateProxy: DateProxy,
        private ipcProxy: IpcProxyBase,
        private settings: SettingsBase,
        private logger: Logger,
        @Optional() private lastfmApi?: LastfmApi,
    ) {}

    public get enableDiscordRichPresence(): boolean {
        return this.settings.enableDiscordRichPresence;
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.settings.enableDiscordRichPresence = v;
        this.initialize();
    }

    public initialize(): void {
        if (this.settings.enableDiscordRichPresence) {
            this.addSubscriptions();
            this.updatePresence();
        } else {
            this.removeSubscriptions();
            this.clearPresence();
        }
    }

    private addSubscriptions(): void {
        this._subscription = new Subscription();

        this._subscription.add(
            this.playbackService.playbackStarted$.subscribe(() => {
                this.updatePresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                this.updatePresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.updatePresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.clearPresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackSkipped$.subscribe(() => {
                this.updatePresence();
            }),
        );
    }

    private removeSubscriptions(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    private calculateElapsedTimeInMilliseconds(): number {
        return this.playbackService.progress.progressSeconds * 1000;
    }

    private clearPresence(): void {
        this.ipcProxy.sendToMainProcess('discord-api-command', new DiscordApiCommand(DiscordApiCommandType.ClearPresence, undefined));
    }

    private updatePresence(): void {
        if (this._updatePresenceTimeout) {
            clearTimeout(this._updatePresenceTimeout);
        }

        this._updatePresenceTimeout = setTimeout(() => {
            if (this.playbackService.currentTrack == undefined) {
                this.logger.info(`No currentTrack was found. Not setting Discord Rich Presence.`, 'DiscordService', 'updatePresence');
                return;
            }

            let smallImageKey: string = 'pause';
            let smallImageText: string = this.translatorService.get('paused');
            const largeImageKey: string = this.getCachedCoverArtUrl(this.playbackService.currentTrack) ?? 'icon';
            const largeImageText: string = this.translatorService.get('playing-with-dopamine');
            let startTime: number = 0;
            let shouldSendTimestamps: boolean = false;

            if (this.playbackService.canPause) {
                startTime = this.dateProxy.now() - this.calculateElapsedTimeInMilliseconds();
                shouldSendTimestamps = true;
                smallImageKey = 'play';
                smallImageText = this.translatorService.get('playing');
            }

            const args: PresenceArgs = {
                title: this.playbackService.currentTrack.title,
                artists: this.playbackService.currentTrack.artists,
                smallImageKey: smallImageKey,
                smallImageText: smallImageText,
                largeImageKey: largeImageKey,
                largeImageText: largeImageText,
                shouldSendTimestamps: shouldSendTimestamps,
                startTime: startTime,
                type: 2,
            };

            this.ipcProxy.sendToMainProcess('discord-api-command', new DiscordApiCommand(DiscordApiCommandType.SetPresence, args));

            this.loadCoverArtUrlAsync(this.playbackService.currentTrack);
        }, this._updatePresenceTimeoutMillis);
    }

    private getCoverArtCacheKey(track: NonNullable<PlaybackService['currentTrack']>): string {
        return `${track.rawFirstArtist}\u0000${track.rawAlbumTitle || track.title}`;
    }

    private getCachedCoverArtUrl(track: NonNullable<PlaybackService['currentTrack']>): string | undefined {
        return this._coverArtUrls.get(this.getCoverArtCacheKey(track));
    }

    private cacheCoverArtUrl(cacheKey: string, imageUrl: string | undefined): void {
        this._coverArtUrls.delete(cacheKey);
        this._coverArtUrls.set(cacheKey, imageUrl);

        while (this._coverArtUrls.size > this._maximumCoverArtCacheEntries) {
            const oldestCacheKey: string | undefined = this._coverArtUrls.keys().next().value;
            if (oldestCacheKey == undefined) {
                return;
            }

            this._coverArtUrls.delete(oldestCacheKey);
        }
    }

    private loadCoverArtUrlAsync(track: NonNullable<PlaybackService['currentTrack']>): void {
        if (this.lastfmApi == undefined || String(track.rawFirstArtist).trim() === '') {
            return;
        }

        const cacheKey: string = this.getCoverArtCacheKey(track);
        if (this._coverArtUrls.has(cacheKey)) {
            return;
        }

        const albumInfoPromise: Promise<Awaited<ReturnType<LastfmApi['getAlbumInfoAsync']>>> | undefined = this.lastfmApi.getAlbumInfoAsync(
            track.rawFirstArtist,
            track.rawAlbumTitle || track.title,
            false,
            'EN',
        );

        if (albumInfoPromise == undefined) {
            this.cacheCoverArtUrl(cacheKey, undefined);
            return;
        }

        albumInfoPromise
            .then((album) => {
                const imageUrl: string = album?.largestImage() ?? '';
                const discordImageUrl: string = imageUrl.startsWith('https://') ? imageUrl : '';
                this.cacheCoverArtUrl(cacheKey, discordImageUrl || undefined);

                if (this.playbackService.currentTrack?.path === track.path && discordImageUrl !== '') {
                    this.updatePresence();
                }
            })
            .catch((error: unknown) => {
                this.cacheCoverArtUrl(cacheKey, undefined);
                this.logger.error(error, `Could not get Discord cover art for '${track.title}'`, 'DiscordService', 'loadCoverArtUrlAsync');
            });
    }
}
