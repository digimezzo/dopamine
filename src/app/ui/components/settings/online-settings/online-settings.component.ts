import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { SignInState } from '../../../../services/scrobbling/sign-in-state';
import { ScrobblingService } from '../../../../services/scrobbling/scrobbling.service';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { NotificationServiceBase } from '../../../../services/notification/notification.service.base';
import { DiscordService } from '../../../../services/discord/discord.service';

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
        private scrobblingService: ScrobblingService,
        private notificationService: NotificationServiceBase,
        public settings: SettingsBase,
    ) {}

    public signInStateEnum: typeof SignInState = SignInState;

    public get signInState(): SignInState {
        return this._signInState;
    }

    public get lastFmUserName(): string {
        return this.scrobblingService.username;
    }
    public set lastFmUserName(v: string) {
        this.scrobblingService.username = v;
    }

    public get lastFmPassword(): string {
        return this.scrobblingService.password;
    }
    public set lastFmPassword(v: string) {
        this.scrobblingService.password = v;
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.scrobblingService.signInStateChanged$.subscribe((signInState: SignInState) => {
                this._signInState = signInState;

                if (signInState === SignInState.Error) {
                    PromiseUtils.noAwait(this.notificationService.lastFmLoginFailedAsync());
                }
            }),
        );

        this._signInState = this.scrobblingService.signInState;
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
            this.scrobblingService.signOut();
        }
    }

    public async signInToLastFmAsync(): Promise<void> {
        await this.scrobblingService.signInAsync();
    }
}
