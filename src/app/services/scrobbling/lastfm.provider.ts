import { Injectable } from '@angular/core';
import { ScrobbleProvider } from './scrobbling.service';
import { Observable, Subject } from 'rxjs';
import { SignInState } from './sign-in-state';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { SettingsBase } from '../../common/settings/settings.base';
import { Logger } from '../../common/logger';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackModel } from '../track/track-model';

@Injectable({providedIn: 'root'})
export class LastfmProvider implements ScrobbleProvider {
    public readonly id: string = 'lastfm';
    
    private signInStateChanged: Subject<SignInState> = new Subject();
    private _signInState: SignInState = SignInState.SignedOut;
    public signInStateChanged$: Observable<SignInState> = this.signInStateChanged.asObservable();

    private sessionKey: string = '';
    
    public constructor(
        private lastfmApi: LastfmApi,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public username: string = '';
    public password: string = '';

    public get signInState(): SignInState {
        return this._signInState;
    }

    public get isProviderEnabled(): boolean {
        return this.settings.enableLastFmScrobbling;
    }

    public initialize(): void {
        this.initializeSessionFromSettings();
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

    public async signInAsync(): Promise<void> {
        try {
            this.sessionKey = await this.lastfmApi.getMobileSessionAsync(this.username, this.password);

            if (!StringUtils.isNullOrWhiteSpace(this.sessionKey)) {
                this.settings.lastFmUsername = this.username;
                this.settings.lastFmPassword = this.password;
                this.settings.lastFmSessionKey = this.sessionKey;

                this.logger.info(`User '${this.username}' successfully signed in to Last.fm.`, 'LastfmProvider', 'signIn');

                this._signInState = SignInState.SignedIn;
            } else {
                this.logger.warn(`User '${this.username}' could not sign in to Last.fm.`, 'LastfmProvider', 'signIn');
                this._signInState = SignInState.Error;
            }
        } catch (e: unknown) {
            this.logger.error(e, `User '${this.username}' could not sign in to last.fm`, 'LastfmProvider', 'signIn');

            this._signInState = SignInState.Error;
        }

        this.signInStateChanged.next(this.signInState);
    }

    public signOut(): void {
        this.sessionKey = '';
        this.settings.lastFmSessionKey = '';
        
        this.logger.info(`User '${this.username}' signed out from Last.fm`, 'LastfmProvider', 'signOut');

        this._signInState = SignInState.SignedOut;

        this.signInStateChanged.next(this.signInState);
    }

    public async sendTrackLoveAsync(track: TrackModel, love: boolean): Promise<void> {
        if (this.signInState !== SignInState.SignedIn) {
            return;
        }

        for (const artist of track.rawArtists) {
            if (love) {
                try {
                    await this.lastfmApi.loveTrackAsync(this.sessionKey, artist, track.rawTitle);
                } catch (e: unknown) {
                    this.logger.error(e, 'Could not send track.love to Last.fm', 'LastfmProvider', 'sendTrackLoveAsync');
                }
            } else {
                try {
                    await this.lastfmApi.unloveTrackAsync(this.sessionKey, artist, track.rawTitle);
                } catch (e: unknown) {
                    this.logger.error(e, 'Could not send track.unlove to Last.fm', 'LastfmProvider', 'sendTrackLoveAsync');
                }
            }
        }
    }

    public async updateNowPlayingAsync(track: TrackModel): Promise<boolean> {
        if (this.signInState !== SignInState.SignedIn) {
            return Promise.resolve(false);
        }
        const artist: string = track.rawFirstArtist;
        const trackTitle: string = track.rawTitle;
        const albumTitle: string = track.rawAlbumTitle;

        try {
            const isSuccess: boolean = await this.lastfmApi.updateTrackNowPlayingAsync(this.sessionKey, artist, trackTitle, albumTitle);
            return Promise.resolve(isSuccess);
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Could not update Now Playing for track '${artist} - ${trackTitle}' on Last.fm`,
                'LastfmProvider',
                'updateNowPlayingAsync'
            );
            return Promise.resolve(false);
        }
    }

    public async scrobbleAsync(track: TrackModel, startTime: Date): Promise<boolean> {
        if (this.signInState !== SignInState.SignedIn) {
            return Promise.resolve(false);
        }

        const artist: string = track.rawFirstArtist;
        const trackTitle: string = track.rawTitle;
        const albumTitle: string = track.rawAlbumTitle;

        try {
            const isSuccsess: boolean = await this.lastfmApi.scrobbleTrackAsync(
                this.sessionKey,
                artist,
                trackTitle,
                albumTitle,
                startTime,
            );
            return Promise.resolve(isSuccsess);
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Could not Scrobble track '${artist} - ${trackTitle}' to Last.fm`,
                'LastfmProvider',
                'scrobbleAsync',
            );
            return Promise.resolve(false);
        }
    }
}
