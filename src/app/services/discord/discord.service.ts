import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { DateProxy } from '../../common/io/date-proxy';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseDiscordService } from './base-discord.service';
import { PresenceUpdater } from './presence-updater';

@Injectable()
export class DiscordService implements BaseDiscordService {
    private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: BasePlaybackService,
        private translatorService: BaseTranslatorService,
        private presenceUpdater: PresenceUpdater,
        private dateProxy: DateProxy,
        private settings: BaseSettings,
        private logger: Logger
    ) {}

    public setRichPresenceFromSettings(): void {
        if (!this.settings.enableDiscordRichPresence) {
            this.removeSubscriptions();
            this.presenceUpdater.clearPresence();

            return;
        }

        this.addSubscriptions();

        if (this.playbackService.isPlaying) {
            this.updatePresenceToPlaying();
        }
    }

    private addSubscriptions(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.updatePresenceToPlaying();
            })
        );

        this.subscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                this.updatePresenceToPaused();
            })
        );

        this.subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.updatePresenceToPlaying();
            })
        );

        this.subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.updatePresenceToPlaying();
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.presenceUpdater.clearPresence();
            })
        );
    }

    private removeSubscriptions(): void {
        this.subscription.unsubscribe();
    }

    private calculateTimeRemainingInMilliseconds(): number {
        const timeRemainingInMilliseconds: number =
            (this.playbackService.progress.totalSeconds - this.playbackService.progress.progressSeconds) * 1000;

        return timeRemainingInMilliseconds;
    }

    private updatePresenceToPlaying(): void {
        this.updatePresence(
            'play',
            this.translatorService.get('playing'),
            'icon',
            this.translatorService.get('playing-with-dopamine'),
            true
        );
    }

    private updatePresenceToPaused(): void {
        this.updatePresence(
            'pause',
            this.translatorService.get('paused'),
            'icon',
            this.translatorService.get('playing-with-dopamine'),
            false
        );
    }

    private updatePresence(
        smallImageKey: string,
        smallImageText: string,
        largeImageKey: string,
        largeImageText: string,
        shouldSendTimestamps: boolean
    ): void {
        if (this.playbackService.currentTrack == undefined) {
            this.logger.info(`No currentTrack was found. Not setting Discord Rich Presence.`, 'DiscordService', 'setPresence');

            return;
        }

        let startTime: number = 0;
        let endTime: number = 0;

        if (shouldSendTimestamps) {
            startTime = this.dateProxy.now();
            endTime = startTime + this.calculateTimeRemainingInMilliseconds();
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
            endTime
        );
    }
}
