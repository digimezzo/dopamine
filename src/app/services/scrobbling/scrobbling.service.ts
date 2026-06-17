import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { StringUtils } from '../../common/utils/string-utils';
import { PromiseUtils } from '../../common/utils/promise-utils';

import { PlaybackProgress } from '../playback/playback-progress';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';

import { SignInState } from './sign-in-state';
import { PlaybackService } from '../playback/playback.service';
import { SettingsBase } from '../../common/settings/settings.base';
import { LastfmProvider } from './lastfm.provider';

export interface ScrobbleProvider {
    // Unique id of the scrobble provider (e.g. 'lastfm', 'listenbrainz')
    readonly id: string;
    
    readonly signInStateChanged$: Observable<SignInState>;
    readonly signInState: SignInState;

    isProviderEnabled: boolean;

    initialize(): void;
    signInAsync(): Promise<void>;
    signOut(): void;

    updateNowPlayingAsync(track: TrackModel): Promise<boolean>;
    scrobbleAsync(track: TrackModel, startTime: Date): Promise<boolean>;

    sendTrackLoveAsync(track: TrackModel, love: boolean): Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class ScrobblingService {
    private canScrobble: boolean = false;
    private subscription: Subscription = new Subscription();
    private providers: ScrobbleProvider[] = [];
    private currentTrack: TrackModel;
    private currentTrackUTCStartTime: Date;

    public constructor(
        private playbackService: PlaybackService,
        private dateTime: DateTime,
        private settings: SettingsBase,
        private logger: Logger,
        private lastfmProvider: LastfmProvider,
    ) {
        this.providers = [lastfmProvider];
    }

    public initialize(): void {
        for (const provider of this.providers) {
            provider.initialize();
        }
        this.initializeSubscriptions();
    }

    private initializeSubscriptions(): void {
        if (!this.providers.some((provider) => provider.isProviderEnabled)) {
            return;
        }

        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) =>
                PromiseUtils.noAwait(this.handlePlaybackStartedAsync(playbackStarted)),
            ),
        );

        this.subscription.add(
            this.playbackService.progressChanged$.subscribe((playbackProgress: PlaybackProgress) =>
                PromiseUtils.noAwait(this.handlePlaybackProgressChangedAsync(playbackProgress)),
            ),
        );

        this.subscription.add(this.playbackService.playbackSkipped$.subscribe(() => this.handlePlaybackSkipped()));
    }

    public async sendTrackLoveAsync(track: TrackModel, love: boolean) {
        // We can't send track love for an unknown track title
        if (StringUtils.isNullOrWhiteSpace(track.rawTitle)) {
            return;
        }

        const activeProviders = this.providers.filter( p => p.signInState === SignInState.SignedIn );
        
        await Promise.all(activeProviders.map(async (provider) => {
            try {
                await provider.sendTrackLoveAsync(track, love);
            } catch (e: unknown) {
                this.logger.error(e, `Could not send '${love ? 'love' : 'unlove'}' to '${provider.id}'`, 'ScrobblingService', 'sendTrackLoveAsync');
            }
        }));

    }

    private async handlePlaybackStartedAsync(playbackStarted: PlaybackStarted): Promise<void> {
        // As soon as a track starts playing, send a Now Playing request.
        this.canScrobble = true;
        this.currentTrack = playbackStarted.currentTrack;
        this.currentTrackUTCStartTime = this.dateTime.getUTCDate(new Date());

        const artist: string = this.currentTrack.rawFirstArtist;
        const trackTitle: string = this.currentTrack.rawTitle;

        if (StringUtils.isNullOrWhiteSpace(artist) || StringUtils.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        const activeProviders = this.providers.filter(p => p.signInState === SignInState.SignedIn);

        await Promise.all(activeProviders.map(async (provider) => {
            try {
                await provider.updateNowPlayingAsync(this.currentTrack);
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    `Could not update Now Playing for track '${artist} - ${trackTitle}' to '${provider.id}'`,
                    'ScrobblingService',
                    'handlePlaybackStartedAsync',
                );
            }
        }));
    }

    private async handlePlaybackProgressChangedAsync(playbackProgress: PlaybackProgress): Promise<void> {
        if (!this.canScrobble) {
            return;
        }

        if (this.currentTrack == undefined) {
            return;
        }

        const artist: string = this.currentTrack.rawFirstArtist;
        const trackTitle: string = this.currentTrack.rawTitle;

        if (StringUtils.isNullOrWhiteSpace(artist) || StringUtils.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        // When is a scrobble a scrobble?
        // - The track must be longer than 30 seconds
        // - And the track has been played for at least half its duration, or for 4 minutes (whichever occurs earlier).
        if (playbackProgress.totalSeconds > 30) {
            if (playbackProgress.progressSeconds >= playbackProgress.totalSeconds / 2 || playbackProgress.progressSeconds > 4 * 60) {
                this.canScrobble = false;

                const activeProviders = this.providers.filter(p => p.signInState === SignInState.SignedIn);

                await Promise.all(activeProviders.map(async (provider) => {
                    try {
                        await provider.scrobbleAsync(this.currentTrack, this.currentTrackUTCStartTime);
                    } catch (e: unknown) {
                        this.logger.error(
                            e,
                            `Could not Scrobble for track '${artist} - ${trackTitle}' to '${provider.id}'`,
                            'ScrobblingService',
                            'handlePlaybackProgressChangedAsync',
                        );
                    }
                }));
            }
        }
    }

    private handlePlaybackSkipped(): void {
        // When the user skips, we don't allow scrobbling.
        this.canScrobble = false;
    }
}
