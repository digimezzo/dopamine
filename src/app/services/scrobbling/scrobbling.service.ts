import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
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

@Injectable({ providedIn: 'root' })
export class ScrobblingService {
    private _signInState: SignInState = SignInState.SignedOut;

    private sessionKey: string = '';
    private canScrobble: boolean = false;
    private signInStateChanged: Subject<SignInState> = new Subject();
    private subscription: Subscription = new Subscription();
    private currentTrack: TrackModel;
    private currentTrackUTCStartTime: Date;

    public constructor(
        private playbackService: PlaybackService,
        private lastfmApi: LastfmApi,
        private dateTime: DateTime,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public signInStateChanged$: Observable<SignInState> = this.signInStateChanged.asObservable();

    public username: string = '';
    public password: string = '';

    public get signInState(): SignInState {
        return this._signInState;
    }

    public initialize(): void {
        this.initializeSessionFromSettings();
        this.initializeSubscriptions();
    }

    public async signInAsync(): Promise<void> {
        try {
            this.sessionKey = await this.lastfmApi.getMobileSessionAsync(this.username, this.password);

            if (!StringUtils.isNullOrWhiteSpace(this.sessionKey)) {
                this.settings.lastFmUsername = this.username;
                this.settings.lastFmPassword = this.password;
                this.settings.lastFmSessionKey = this.sessionKey;

                this.logger.info(`User '${this.username}' successfully signed in to Last.fm.`, 'ScrobblingService', 'signIn');

                this._signInState = SignInState.SignedIn;
            } else {
                this.logger.warn(`User '${this.username}' could not sign in to Last.fm.`, 'ScrobblingService', 'signIn');
                this._signInState = SignInState.Error;
            }
        } catch (e: unknown) {
            this.logger.error(e, `User '${this.username}' could not sign in to last.fm`, 'ScrobblingService', 'signIn');

            this._signInState = SignInState.Error;
        }

        this.signInStateChanged.next(this.signInState);
    }

    public signOut(): void {
        this.sessionKey = '';
        this.settings.lastFmSessionKey = '';

        this.logger.info(`User '${this.username}' signed out from Last.fm`, 'ScrobblingService', 'signOut');

        this._signInState = SignInState.SignedOut;

        this.signInStateChanged.next(this.signInState);
    }

    public async sendTrackLoveAsync(track: TrackModel, love: boolean): Promise<void> {
        if (this.signInState !== SignInState.SignedIn) {
            return;
        }

        // We can't send track love for an unknown track title
        if (StringUtils.isNullOrWhiteSpace(track.rawTitle)) {
            return;
        }

        for (const artist of track.rawArtists) {
            if (love) {
                try {
                    await this.lastfmApi.loveTrackAsync(this.sessionKey, artist, track.rawTitle);
                } catch (e: unknown) {
                    this.logger.error(e, 'Could not send track.love to Last.fm', 'ScrobblingService', 'sendTrackLoveAsync');
                }
            } else {
                try {
                    await this.lastfmApi.unloveTrackAsync(this.sessionKey, artist, track.rawTitle);
                } catch (e: unknown) {
                    this.logger.error(e, 'Could not send track.unlove to Last.fm', 'ScrobblingService', 'sendTrackLoveAsync');
                }
            }
        }
    }

    private initializeSessionFromSettings(): void {
        if (!this.settings.enableLastFmScrobbling) {
            return;
        }

        this.username = this.settings.lastFmUsername;
        this.password = this.settings.lastFmPassword;
        this.sessionKey = this.settings.lastFmSessionKey;

        if (
            !StringUtils.isNullOrWhiteSpace(this.username) &&
            !StringUtils.isNullOrWhiteSpace(this.password) &&
            !StringUtils.isNullOrWhiteSpace(this.sessionKey)
        ) {
            this._signInState = SignInState.SignedIn;
        } else {
            this._signInState = SignInState.SignedOut;
        }
    }

    private initializeSubscriptions(): void {
        if (!this.settings.enableLastFmScrobbling) {
            this.subscription.unsubscribe();

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

    private async handlePlaybackStartedAsync(playbackStarted: PlaybackStarted): Promise<void> {
        if (this.signInState !== SignInState.SignedIn) {
            return;
        }

        // As soon as a track starts playing, send a Now Playing request.
        this.canScrobble = true;
        this.currentTrack = playbackStarted.currentTrack;
        this.currentTrackUTCStartTime = this.dateTime.getUTCDate(new Date());

        const artist: string = this.currentTrack.rawFirstArtist;
        const trackTitle: string = this.currentTrack.rawTitle;
        const albumTitle: string = this.currentTrack.rawAlbumTitle;

        if (StringUtils.isNullOrWhiteSpace(artist) || StringUtils.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        try {
            const isSuccess: boolean = await this.lastfmApi.updateTrackNowPlayingAsync(this.sessionKey, artist, trackTitle, albumTitle);

            if (isSuccess) {
                this.logger.info(
                    `Successfully updated Now Playing for track '${artist} - ${trackTitle}'`,
                    'ScrobblingService',
                    'handlePlaybackStartedAsync',
                );
            } else {
                this.logger.warn(
                    `Could not update Now Playing for track '${artist} - ${trackTitle}'`,
                    'ScrobblingService',
                    'handlePlaybackStartedAsync',
                );
            }
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Could not update Now Playing for track '${artist} - ${trackTitle}'`,
                'ScrobblingService',
                'handlePlaybackStartedAsync',
            );
        }
    }

    private async handlePlaybackProgressChangedAsync(playbackProgress: PlaybackProgress): Promise<void> {
        if (this.signInState !== SignInState.SignedIn) {
            return;
        }

        if (!this.canScrobble) {
            return;
        }

        if (this.currentTrack == undefined) {
            return;
        }

        const artist: string = this.currentTrack.rawFirstArtist;
        const trackTitle: string = this.currentTrack.rawTitle;
        const albumTitle: string = this.currentTrack.rawAlbumTitle;

        if (StringUtils.isNullOrWhiteSpace(artist) || StringUtils.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        // When is a scrobble a scrobble?
        // - The track must be longer than 30 seconds
        // - And the track has been played for at least half its duration, or for 4 minutes (whichever occurs earlier).
        if (playbackProgress.totalSeconds > 30) {
            if (playbackProgress.progressSeconds >= playbackProgress.totalSeconds / 2 || playbackProgress.progressSeconds > 4 * 60) {
                this.canScrobble = false;

                try {
                    const isSuccess: boolean = await this.lastfmApi.scrobbleTrackAsync(
                        this.sessionKey,
                        artist,
                        trackTitle,
                        albumTitle,
                        this.currentTrackUTCStartTime,
                    );

                    if (isSuccess) {
                        this.logger.info(
                            `Successfully Scrobbled track '${artist} - ${trackTitle}'`,
                            'ScrobblingService',
                            'handlePlaybackProgressChangedAsync',
                        );
                    } else {
                        this.logger.warn(
                            `Could not Scrobble track '${artist} - ${trackTitle}'`,
                            'ScrobblingService',
                            'handlePlaybackProgressChangedAsync',
                        );
                    }
                } catch (e: unknown) {
                    this.logger.error(
                        e,
                        `Could not Scrobble track '${artist} - ${trackTitle}'`,
                        'ScrobblingService',
                        'handlePlaybackProgressChangedAsync',
                    );
                }
            }
        }
    }

    private handlePlaybackSkipped(): void {
        // When the user skips, we don't allow scrobbling.
        this.canScrobble = false;
    }
}
