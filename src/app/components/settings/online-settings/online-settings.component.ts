import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseSettings } from '../../../common/settings/base-settings';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { BaseDiscordService } from '../../../services/discord/base-discord.service';
import { BaseScrobblingService } from '../../../services/scrobbling/base-scrobbling.service';
import { SignInState } from '../../../services/scrobbling/sign-in-state';
import { BaseSnackBarService } from '../../../services/snack-bar/base-snack-bar.service';

@Component({
    selector: 'app-online-settings',
    host: { style: 'display: block' },
    templateUrl: './online-settings.component.html',
    styleUrls: ['./online-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OnlineSettingsComponent implements OnInit, OnDestroy {
    private _signInState: SignInState = SignInState.SignedOut;
    private subscription: Subscription = new Subscription();

    public constructor(
        private discordService: BaseDiscordService,
        private scrobblingService: BaseScrobblingService,
        private snackBarService: BaseSnackBarService,
        public settings: BaseSettings
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
                    PromiseUtils.noAwait(this.snackBarService.lastFmLoginFailedAsync());
                }
            })
        );

        this._signInState = this.scrobblingService.signInState;
    }

    public get enableDiscordRichPresence(): boolean {
        return this.settings.enableDiscordRichPresence;
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.settings.enableDiscordRichPresence = v;
        this.discordService.setRichPresence(v);
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
