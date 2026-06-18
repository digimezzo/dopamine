import { Injectable } from '@angular/core';
import { ScrobbleProvider } from './scrobbling.service';
import { Observable, Subject } from 'rxjs';
import { TrackModel } from '../track/track-model';
import { SignInState } from './sign-in-state';
import { ListenbrainzApi } from '../../common/api/listenbrainz/listenbrainz.api';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { StringUtils } from '../../common/utils/string-utils';

@Injectable({ providedIn: 'root' })
export class ListenbrainzProvider implements ScrobbleProvider {
    public readonly id: string = 'listenbrainz';

    private signInStateChanged: Subject<SignInState> = new Subject();
    private _signInState: SignInState = SignInState.SignedOut;
    public signInStateChanged$: Observable<SignInState> = this.signInStateChanged.asObservable();

    public token: string = '';
    public username: string | undefined = undefined;

    public constructor(
        private listenbrainzApi: ListenbrainzApi,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public get isProviderEnabled(): boolean {
        return this.settings.enableListenbrainzScrobbling;
    }

    public get signInState(): SignInState {
        return this._signInState;
    }

    public initialize(): void {
        if (!this.settings.enableListenbrainzScrobbling) {
            return;
        }

        this.token = this.settings.listenbrainzToken;

        if (!StringUtils.isNullOrWhiteSpace(this.token)) {
            this._signInState = SignInState.SignedIn;
        } else {
            this._signInState = SignInState.SignedOut;
        }
    }

    public async signInAsync(): Promise<void> {
        this.username = await this.listenbrainzApi.getUsernameByToken(this.token);

        if (!StringUtils.isNullOrWhiteSpace(this.username)) {
            this.logger.info(`Successfully signed in to Listenbrainz as '${this.username}'`, 'ListenbrainzProvider', 'signInAsync');
            this.settings.listenbrainzToken = this.token;
            this.settings.listenbrainzUsername = this.username ?? '';
            this._signInState = SignInState.SignedIn;
        } else {
            this.logger.info(`Failed to sign in to Listenbrainz with provided token`, 'ListenbrainzProvider', 'signInAsync');
            this._signInState = SignInState.Error;
        }

        this.signInStateChanged.next(this.signInState);
    }
    public signOut(): void {
        // listenbrainz does not have a concept of sessions.
        // just update flags
        this.logger.info('Signing out of Listenbrainz provider', 'ListenbrainzProvider', 'signOut');
        this._signInState = SignInState.SignedOut;
        this.signInStateChanged.next(this.signInState);
    }

    public async updateNowPlayingAsync(track: TrackModel): Promise<boolean> {
        if (this.signInState !== SignInState.SignedIn) {
            return Promise.resolve(false);
        }

        const artist: string = track.rawFirstArtist;
        const trackTitle: string = track.rawTitle;
        const albumTitle: string = track.rawAlbumTitle;

        try {
            const isSuccess: boolean = await this.listenbrainzApi.updateNowPlayingAsync(this.token, artist, trackTitle, albumTitle);
            return Promise.resolve(isSuccess);
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Could not update Now Playing for track '${artist} - ${trackTitle}' on Listenbrainz`,
                'ListenbrainzProvider',
                'updateNowPlayingAsync',
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
            const isSuccess: boolean = await this.listenbrainzApi.scrobbleTrackAsync(this.token, artist, trackTitle, albumTitle, startTime);
            return Promise.resolve(isSuccess);
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Could not scrobble track '${artist} - ${trackTitle}' on Listenbrainz`,
                'ListenbrainzProvider',
                'scrobbleAsync',
            );
            return Promise.resolve(false);
        }
    }
    public async sendTrackLoveAsync(track: TrackModel, love: boolean): Promise<void> {
        // Listenbrainz does not support this feature
        return Promise.resolve();
    }
}
