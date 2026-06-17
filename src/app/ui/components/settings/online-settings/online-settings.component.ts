import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { SignInState } from '../../../../services/scrobbling/sign-in-state';
import { LastfmProvider } from '../../../../services/scrobbling/lastfm.provider';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { NotificationServiceBase } from '../../../../services/notification/notification.service.base';
import { DiscordService } from '../../../../services/discord/discord.service';
import { UpdateServiceBase } from '../../../../services/update/update.service.base';
import { ListenbrainzProvider } from '../../../../services/scrobbling/listenbrainz.provider';

@Component({
    selector: 'app-online-settings',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './online-settings.component.html',
    styleUrls: ['./online-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OnlineSettingsComponent implements OnInit, OnDestroy {
    private _lastfmSignInState: SignInState = SignInState.SignedOut;
    private _listenbrainzSignInState: SignInState = SignInState.SignedOut;
    private subscription: Subscription = new Subscription();

    public constructor(
        public discordService: DiscordService,
        private lastfmProvider: LastfmProvider,
        private listenbrainzProvider: ListenbrainzProvider,
        private notificationService: NotificationServiceBase,
        private updateService: UpdateServiceBase,
        public settings: SettingsBase,
    ) {}

    public signInStateEnum: typeof SignInState = SignInState;

    public get lastfmSignInState(): SignInState {
        return this._lastfmSignInState;
    }

    public get listenbrainzSignInState(): SignInState {
        return this._listenbrainzSignInState;
    }

    public get lastFmUserName(): string {
        return this.lastfmProvider.username;
    }
    public set lastFmUserName(v: string) {
        this.lastfmProvider.username = v;
    }

    public get lastFmPassword(): string {
        return this.lastfmProvider.password;
    }
    public set lastFmPassword(v: string) {
        this.lastfmProvider.password = v;
    }

    public get listenbrainzToken(): string {
        return this.listenbrainzProvider.token;
    }
    public set listenbrainzToken(v: string) {
        this.listenbrainzProvider.token = v;
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.lastfmProvider.signInStateChanged$.subscribe((signInState: SignInState) => {
                this._lastfmSignInState = signInState;

                if (signInState === SignInState.Error) {
                    PromiseUtils.noAwait(this.notificationService.lastFmLoginFailedAsync());
                }
            }),
        );

        this.subscription.add(
            this.listenbrainzProvider.signInStateChanged$.subscribe((signInState: SignInState) => {
                this._listenbrainzSignInState = signInState;
                console.log("Listenbrainz sign in state changed: " + SignInState[signInState]);

                if (signInState === SignInState.Error) {
                    
                }
            }),
        );

        this._lastfmSignInState = this.lastfmProvider.signInState;
        this._listenbrainzSignInState = this.listenbrainzProvider.signInState;
    }

    public get downloadLyricsOnline(): boolean {
        return this.settings.downloadLyricsOnline;
    }

    public set downloadLyricsOnline(v: boolean) {
        this.settings.downloadLyricsOnline = v;
    }

    public get enableLastFmScrobbling(): boolean {
        return this.settings.enableLastFmScrobbling;
    }

    public set enableLastFmScrobbling(v: boolean) {
        this.settings.enableLastFmScrobbling = v;

        if (!v) {
            this.lastfmProvider.signOut();
        }
    }

    public async signInToLastFmAsync(): Promise<void> {
        await this.lastfmProvider.signInAsync();
    }

    public get checkForUpdates(): boolean {
        return this.settings.checkForUpdates;
    }

    public set checkForUpdates(v: boolean) {
        this.settings.checkForUpdates = v;

        if (v) {
            void this.updateService.checkForUpdatesAsync();
        }
    }

    public get enableListenbrainzScrobbling(): boolean {
        return this.settings.enableListenbrainzScrobbling;
    }

    public set enableListenbrainzScrobbling(v: boolean) {
        this.settings.enableListenbrainzScrobbling = v;

        if (!v) {
            this.listenbrainzProvider.signOut();
        }
    }

    public async signInToListenbrainzAsync(): Promise<void> {
        await this.listenbrainzProvider.signInAsync();
    }
}
