import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { SignInState } from '../../../../services/scrobbling/sign-in-state';
import { LastfmProvider } from '../../../../services/scrobbling/lastfm.provider';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { NotificationServiceBase } from '../../../../services/notification/notification.service.base';
import { DiscordService } from '../../../../services/discord/discord.service';
import { UpdateServiceBase } from '../../../../services/update/update.service.base';

@Component({
    selector: 'app-online-settings',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './online-settings.component.html',
    styleUrls: ['./online-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OnlineSettingsComponent implements OnInit, OnDestroy {
    private _signInState: SignInState = SignInState.SignedOut;
    private subscription: Subscription = new Subscription();

    public constructor(
        public discordService: DiscordService,
        private lastfmProvider: LastfmProvider,
        private notificationService: NotificationServiceBase,
        private updateService: UpdateServiceBase,
        public settings: SettingsBase,
    ) {}

    public signInStateEnum: typeof SignInState = SignInState;

    public get signInState(): SignInState {
        return this._signInState;
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

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.lastfmProvider.signInStateChanged$.subscribe((signInState: SignInState) => {
                this._signInState = signInState;

                if (signInState === SignInState.Error) {
                    PromiseUtils.noAwait(this.notificationService.lastFmLoginFailedAsync());
                }
            }),
        );

        this._signInState = this.lastfmProvider.signInState;
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
}
