import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { DateProxy } from '../../common/io/date-proxy';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { PlaybackService } from '../playback/playback.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { DiscordApiCommandType } from './discord-api-command-type';
import { DiscordApiCommand } from './discord-api-command';
import { PresenceArgs } from './presence-args';

@Injectable({ providedIn: 'root' })
export class DiscordService {
    private _subscription: Subscription | undefined;
    private _updatePresenceTimeout: ReturnType<typeof setTimeout>;
    private _updatePresenceTimeoutMillis: number = 1000;

    public constructor(
        private playbackService: PlaybackService,
        private translatorService: TranslatorServiceBase,
        private dateProxy: DateProxy,
        private ipcProxy: IpcProxyBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public get enableDiscordRichPresence(): boolean {
        return this.settings.enableDiscordRichPresence;
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.settings.enableDiscordRichPresence = v;
        this.initialize();
    }

    public initialize(): void {
        if (this.settings.enableDiscordRichPresence) {
            this.addSubscriptions();
            this.updatePresence();
        } else {
            this.removeSubscriptions();
            this.clearPresence();
        }
    }

    private addSubscriptions(): void {
        this._subscription = new Subscription();

        this._subscription.add(
            this.playbackService.playbackStarted$.subscribe(() => {
                this.updatePresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                this.updatePresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.updatePresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.clearPresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackSkipped$.subscribe(() => {
                this.updatePresence();
            }),
        );
    }

    private removeSubscriptions(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    private calculateElapsedTimeInMilliseconds(): number {
        return this.playbackService.progress.progressSeconds * 1000;
    }

    private clearPresence(): void {
        this.ipcProxy.sendToMainProcess('discord-api-command', new DiscordApiCommand(DiscordApiCommandType.ClearPresence, undefined));
    }

    private updatePresence(): void {
        if (this._updatePresenceTimeout) {
            clearTimeout(this._updatePresenceTimeout);
        }

        this._updatePresenceTimeout = setTimeout(() => {
            if (this.playbackService.currentTrack == undefined) {
                this.logger.info(`No currentTrack was found. Not setting Discord Rich Presence.`, 'DiscordService', 'updatePresence');
                return;
            }

            let smallImageKey: string = 'pause';
            let smallImageText: string = this.translatorService.get('paused');
            const largeImageKey: string = 'icon';
            const largeImageText: string = this.translatorService.get('playing-with-dopamine');
            let startTime: number = 0;
            let shouldSendTimestamps: boolean = false;

            if (this.playbackService.canPause) {
                startTime = this.dateProxy.now() - this.calculateElapsedTimeInMilliseconds();
                shouldSendTimestamps = true;
                smallImageKey = 'play';
                smallImageText = this.translatorService.get('playing');
            }

            const args: PresenceArgs = {
                title: this.playbackService.currentTrack.title,
                artists: this.playbackService.currentTrack.artists,
                smallImageKey: smallImageKey,
                smallImageText: smallImageText,
                largeImageKey: largeImageKey,
                largeImageText: largeImageText,
                shouldSendTimestamps: shouldSendTimestamps,
                startTime: startTime,
            };

            this.ipcProxy.sendToMainProcess('discord-api-command', new DiscordApiCommand(DiscordApiCommandType.SetPresence, args));
        }, this._updatePresenceTimeoutMillis);
    }
}
