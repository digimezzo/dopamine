import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { DateProxy } from '../../common/io/date-proxy';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { PresenceUpdater } from './presence-updater';
import { PlaybackService } from '../playback/playback.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';

@Injectable({ providedIn: 'root' })
export class DiscordService {
    private _subscription: Subscription = new Subscription();

    public constructor(
        private playbackService: PlaybackService,
        private translatorService: TranslatorServiceBase,
        private presenceUpdater: PresenceUpdater,
        private dateProxy: DateProxy,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public setRichPresenceFromSettings(): void {
        this.setRichPresence(this.settings.enableDiscordRichPresence);
    }

    public setRichPresence(enableRichPresence: boolean): void {
        if (!enableRichPresence) {
            this.removeSubscriptions();
            this.presenceUpdater.clearPresence();

            return;
        }

        this.addSubscriptions();

        if (this.playbackService.isPlaying) {
            this.updatePresence();
        }
    }

    private addSubscriptions(): void {
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
                this.presenceUpdater.clearPresence();
            }),
        );

        this._subscription.add(
            this.playbackService.playbackSkipped$.subscribe(() => {
                this.updatePresence();
            }),
        );
    }

    private removeSubscriptions(): void {
        this._subscription.unsubscribe();
    }

    private calculateElapsedTimeInMilliseconds(): number {
        return this.playbackService.progress.progressSeconds * 1000;
    }

    private updatePresence(): void {
        if (this.playbackService.currentTrack == undefined) {
            this.logger.info(`No currentTrack was found. Not setting Discord Rich Presence.`, 'DiscordService', 'setPresence');

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

        this.presenceUpdater.updatePresence(
            this.playbackService.currentTrack.title,
            this.playbackService.currentTrack.artists,
            smallImageKey,
            smallImageText,
            largeImageKey,
            largeImageText,
            shouldSendTimestamps,
            startTime,
        );
    }
}
