import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
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
        private settings: BaseSettings
    ) {}

    public enableRichPresence(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.presenceUpdater.updatePresence('play', this.translatorService.get('Discordd.Playing'));
            })
        );

        this.subscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                this.presenceUpdater.updatePresence('pause', this.translatorService.get('Discordd.Paused'));
            })
        );

        this.subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.presenceUpdater.updatePresence('play', this.translatorService.get('Discordd.Playing'));
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.presenceUpdater.clearPresence();
            })
        );

        if (this.playbackService.isPlaying) {
            this.presenceUpdater.updatePresence('play', this.translatorService.get('Discordd.Playing'));
        }
    }

    public disableRichPresence(): void {
        this.subscription.unsubscribe();
        this.presenceUpdater.clearPresence();
    }

    public initialize(): void {
        if (this.settings.enableDiscordRichPresence) {
            this.enableRichPresence();
        }
    }
}
