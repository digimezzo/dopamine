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

    private sessionKey: string = '';
    private canScrobble: boolean = false;
    private signInStateChanged: Subject<SignInState> = new Subject();
    private subscription: Subscription = new Subscription();
    private currentTrack: TrackModel;
    private currentTrackUTCStartTime: Date;

    constructor(
        private playbackService: BasePlaybackService,
        private lastfmApi: LastfmApi,
        private dateTime: DateTime,
        private settings: BaseSettings,
        private logger: Logger
    ) {
        this.initializeSessionFromSettings();
        this.initializeSubscriptions();
    }

    public signInStateChanged$: Observable<SignInState> = this.signInStateChanged.asObservable();

    public username: string = '';
    public password: string = '';

    public get signInState(): SignInState {
        return this._signInState;
    }

    public async signInAsync(): Promise<void> {
        try {
            this.sessionKey = await this.lastfmApi.getMobileSessionAsync(this.username, this.password);

            if (!Strings.isNullOrWhiteSpace(this.sessionKey)) {
                this.settings.lastFmUsername = this.username;
                this.settings.lastFmPassword = this.password;
                this.settings.lastFmSessionKey = this.sessionKey;

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
        if (Strings.isNullOrWhiteSpace(track.rawTitle)) {
            return;
        }

        for (const artist of track.rawArtists) {
            if (love) {
                try {
                    await this.lastfmApi.loveTrackAsync(this.sessionKey, artist, track.rawTitle);
                } catch (e) {
                    this.logger.error(
                        `Could not send track.love to Last.fm. Error: ${e.message}`,
                        'ScrobblingService',
                        'sendTrackLoveAsync'
                    );
                }
            } else {
                try {
                    await this.lastfmApi.unloveTrackAsync(this.sessionKey, artist, track.rawTitle);
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
        this.sessionKey = this.settings.lastFmSessionKey;

        if (
            !Strings.isNullOrWhiteSpace(this.username) &&
            !Strings.isNullOrWhiteSpace(this.password) &&
            !Strings.isNullOrWhiteSpace(this.sessionKey)
        ) {
            this._signInState = SignInState.SignedIn;
        } else {
            this._signInState = SignInState.SignedOut;
        }
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(
                async (playbackStarted: PlaybackStarted) => await this.handlePlaybackStartedAsync(playbackStarted)
            )
        );

        this.subscription.add(
            this.playbackService.progressChanged$.subscribe(
                async (playbackProgress: PlaybackProgress) => await this.handlePlaybackProgressChangedAsync(playbackProgress)
            )
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

        if (Strings.isNullOrWhiteSpace(artist) || Strings.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        try {
            const isSuccess: boolean = await this.lastfmApi.updateTrackNowPlayingAsync(this.sessionKey, artist, trackTitle, albumTitle);

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

        if (!this.canScrobble) {
            return;
        }

        if (this.currentTrack == undefined) {
            return;
        }

        const artist: string = this.currentTrack.rawFirstArtist;
        const trackTitle: string = this.currentTrack.rawTitle;
        const albumTitle: string = this.currentTrack.rawAlbumTitle;

        if (Strings.isNullOrWhiteSpace(artist) || Strings.isNullOrWhiteSpace(trackTitle)) {
            return;
        }

        // When is a scrobble a scrobble?
        // - The track must be longer than 30 seconds
        // - And the track has been played for at least half its duration, or for 4 minutes (whichever occurs earlier).
        if (playbackProgress.totalSeconds > 30) {
            if (playbackProgress.progressSeconds >= playbackProgress.totalSeconds / 2 || playbackProgress.totalSeconds > 4 * 60) {
                this.canScrobble = false;

                try {
                    const isSuccess: boolean = await this.lastfmApi.scrobbleTrackAsync(
                        this.sessionKey,
                        artist,
                        trackTitle,
                        albumTitle,
                        this.currentTrackUTCStartTime
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
        this.canScrobble = false;
    }
}
