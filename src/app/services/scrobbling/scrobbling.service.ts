import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { LastfmApi } from '../../common/api/lastfm/lastfm-api';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackProgress } from '../playback/playback-progress';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { BaseScrobblingService } from './base-scrobbling.service';
import { SignInState } from './sign-in-state';

@Injectable()
export class ScrobblingService implements BaseScrobblingService {
    private _signInState: SignInState = SignInState.SignedOut;
    private _sessionKey: string = '';
    private _canScrobble: boolean = false;
    private _signInStateChanged: Subject<SignInState> = new Subject();
    private _subscription: Subscription = new Subscription();
    private _currentTrack: TrackModel;
    private _currentTrackUTCStartTime: Date;

    constructor(
        private playbackService: BasePlaybackService,
        private lastfmApi: LastfmApi,
        private settings: BaseSettings,
        private logger: Logger
    ) {
        this.initializeSessionFromSettings();
        this.initializeSubscriptions();
    }

    public signInStateChanged$: Observable<SignInState> = this._signInStateChanged.asObservable();

    public username: string = '';
    public password: string = '';

    public get signInState(): SignInState {
        return this._signInState;
    }

    public async signInAsync(): Promise<void> {
        try {
            this._sessionKey = await this.lastfmApi.getMobileSessionAsync(this.username, this.password);

            if (!Strings.isNullOrWhiteSpace(this._sessionKey)) {
                this.settings.lastFmUsername = this.username;
                this.settings.lastFmPassword = this.password;
                this.settings.lastFmSessionKey = this._sessionKey;

                this.logger.info(`User '${this.username}' successfully signed in to Last.fm.`, 'ScrobblingService', 'signIn');

                this._signInState = SignInState.SignedIn;
            } else {
                this.logger.error(`User '${this.username}' could not sign in to Last.fm.`, 'ScrobblingService', 'signIn');
                this._signInState = SignInState.Error;
            }
        } catch (e) {
            this.logger.error(`User '${this.username}' could not sign in to last.fm. Error: ${e.message}`, 'ScrobblingService', 'signIn');
            this._signInState = SignInState.Error;
        }

        this._signInStateChanged.next(this.signInState);
    }

    public signOut(): void {
        this._sessionKey = '';
        this.settings.lastFmSessionKey = '';

        this.logger.info(`User '${this.username}' signed out from Last.fm`, 'ScrobblingService', 'signOut');

        this._signInState = SignInState.SignedOut;

        this._signInStateChanged.next(this.signInState);
    }

    public async sendTrackLoveAsync(track: TrackModel, love: boolean): Promise<void> {
        if (this.signInState !== SignInState.SignedIn) {
            return;
        }

        // We can't send track love for an unknown track
        if (Strings.isNullOrWhiteSpace(track.rawTitle)) {
            return;
        }

        for (const artist of track.rawArtists) {
            if (love) {
                try {
                    await this.lastfmApi.loveTrackAsync(this._sessionKey, artist, track.rawTitle);
                } catch (e) {
                    this.logger.error(
                        `Could not send track.love to Last.fm. Error: ${e.message}`,
                        'ScrobblingService',
                        'sendTrackLoveAsync'
                    );
                }
            } else {
                try {
                    await this.lastfmApi.unloveTrackAsync(this._sessionKey, artist, track.rawTitle);
                } catch (e) {
                    this.logger.error(
                        'Could not send track.unlove to Last.fm. Error: ${e.message}',
                        'ScrobblingService',
                        'sendTrackLoveAsync'
                    );
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
        this._sessionKey = this.settings.lastFmSessionKey;

        if (
            !Strings.isNullOrWhiteSpace(this.username) &&
            !Strings.isNullOrWhiteSpace(this.password) &&
            !Strings.isNullOrWhiteSpace(this._sessionKey)
        ) {
            this._signInState = SignInState.SignedIn;
        } else {
            this._signInState = SignInState.SignedOut;
        }
    }

    private initializeSubscriptions(): void {
        this._subscription.add(
            this.playbackService.playbackStarted$.subscribe(
                async (playbackStarted: PlaybackStarted) => await this.handlePlaybackStartedAsync(playbackStarted)
            )
        );

        this._subscription.add(
            this.playbackService.progressChanged$.subscribe(
                async (playbackProgress: PlaybackProgress) => await this.handlePlaybackProgressChangedAsync(playbackProgress)
            )
        );

        this._subscription.add(this.playbackService.playbackSkipped$.subscribe(() => this.handlePlaybackSkipped()));
    }

    private async handlePlaybackStartedAsync(playbackStarted: PlaybackStarted): Promise<void> {
        if (this.signInState !== SignInState.SignedIn) {
            return;
        }

        // As soon as a track starts playing, send a Now Playing request.
        this._canScrobble = true;
        this._currentTrack = playbackStarted.currentTrack;
        this._currentTrackUTCStartTime = DateTime.getUTCDate(new Date());

        const artist: string = this._currentTrack.rawFirstArtist;
        const trackTitle: string = this._currentTrack.rawTitle;
        const albumTitle: string = this._currentTrack.rawAlbumTitle;

        if (Strings.isNullOrWhiteSpace(artist) || Strings.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        try {
            const isSuccess: boolean = await this.lastfmApi.updateTrackNowPlayingAsync(this._sessionKey, artist, trackTitle, albumTitle);

            if (isSuccess) {
                this.logger.info(
                    `Successfully updated Now Playing for track '${artist} - ${trackTitle}'`,
                    'ScrobblingService',
                    'handlePlaybackStartedAsync'
                );
            } else {
                this.logger.error(
                    `Could not update Now Playing for track '${artist} - ${trackTitle}'`,
                    'ScrobblingService',
                    'handlePlaybackStartedAsync'
                );
            }
        } catch (e) {
            this.logger.error(
                `Could not update Now Playing for track '${artist} - ${trackTitle}'. Exception: ${e.message}`,
                'ScrobblingService',
                'handlePlaybackStartedAsync'
            );
        }
    }

    private async handlePlaybackProgressChangedAsync(playbackProgress: PlaybackProgress): Promise<void> {
        if (this.signInState !== SignInState.SignedIn) {
            return;
        }

        if (!this._canScrobble) {
            return;
        }

        if (this._currentTrack == undefined) {
            return;
        }

        const artist: string = this._currentTrack.rawFirstArtist;
        const trackTitle: string = this._currentTrack.rawTitle;
        const albumTitle: string = this._currentTrack.rawAlbumTitle;

        if (Strings.isNullOrWhiteSpace(artist) || Strings.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        // When is a scrobble a scrobble?
        // - The track must be longer than 30 seconds
        // - And the track has been played for at least half its duration, or for 4 minutes (whichever occurs earlier).
        if (playbackProgress.totalSeconds > 30) {
            if (playbackProgress.progressSeconds >= playbackProgress.totalSeconds / 2 || playbackProgress.totalSeconds > 4 * 60) {
                this._canScrobble = false;

                try {
                    const isSuccess: boolean = await this.lastfmApi.scrobbleTrackAsync(
                        this._sessionKey,
                        artist,
                        trackTitle,
                        albumTitle,
                        this._currentTrackUTCStartTime
                    );

                    if (isSuccess) {
                        this.logger.info(
                            `Successfully Scrobbled track '${artist} - ${trackTitle}'`,
                            'ScrobblingService',
                            'handlePlaybackProgressChangedAsync'
                        );
                    } else {
                        this.logger.error(
                            `Could not Scrobble track '${artist} - ${trackTitle}'`,
                            'ScrobblingService',
                            'handlePlaybackProgressChangedAsync'
                        );
                    }
                } catch (e) {
                    this.logger.error(
                        `Could not Scrobble track '${artist} - ${trackTitle}'. Exception: ${e.message}`,
                        'ScrobblingService',
                        'handlePlaybackProgressChangedAsync'
                    );
                }
            }
        }
    }

    private handlePlaybackSkipped(): void {
        // When the user skips, we don't allow scrobbling.
        this._canScrobble = false;
    }
}
