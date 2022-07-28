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
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.updatePresence();
            })
        );

        this.subscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                this.updatePresence();
            })
        );

        this.subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.updatePresence();
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.presenceUpdater.clearPresence();
            })
        );

        this.subscription.add(
            this.playbackService.playbackSkipped$.subscribe(() => {
                this.updatePresence();
            })
        );
    }

    private removeSubscriptions(): void {
        this.subscription.unsubscribe();
    }

    private calculateTimeRemainingInMilliseconds(): number {
        const timeRemainingInMilliseconds: number =
            (this.playbackService.progress.totalSeconds - this.playbackService.progress.progressSeconds) * 1000;

        // AudioPlayer does not fill in its progress immediately, so progress is (0,0) when a track starts playing.
        if (timeRemainingInMilliseconds === 0) {
            return this.playbackService.currentTrack.durationInMilliseconds;
        }

        return timeRemainingInMilliseconds;
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
        let endTime: number = 0;
        let shouldSendTimestamps: boolean = false;

        if (this.playbackService.canPause) {
            startTime = this.dateProxy.now();
            endTime = startTime + this.calculateTimeRemainingInMilliseconds();
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
            endTime
        );
    }
}
