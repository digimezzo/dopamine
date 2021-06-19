import { Injectable } from '@angular/core';
import { Client } from 'discord-rpc';
import { Subscription } from 'rxjs';
import { SensitiveInformation } from '../../common/application/sensitive-information';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseDiscordService } from './base-discord.service';

@Injectable()
export class DiscordService implements BaseDiscordService {
    private discordClient: any;
    private currentTrack: TrackModel;
    private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: BasePlaybackService,
        private translatorService: BaseTranslatorService,
        private settings: BaseSettings,
        private logger: Logger
    ) {}

    public enableRichPresence(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.currentTrack = playbackStarted.currentTrack;

                if (this.currentTrack != undefined) {
                    this.updatePresence('play', this.translatorService.get('Discord.Playing'));
                }
            })
        );

        this.subscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                if (this.currentTrack != undefined) {
                    this.updatePresence('pause', this.translatorService.get('Discord.Paused'));
                }
            })
        );

        this.subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                if (this.currentTrack != undefined) {
                    this.updatePresence('play', this.translatorService.get('Discord.Playing'));
                }
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.currentTrack = undefined;
                this.clearPresence();
            })
        );

        if (this.playbackService.isPlaying) {
            this.currentTrack = this.playbackService.currentTrack;
            this.updatePresence('play', this.translatorService.get('Discord.Playing'));
        }
    }
    public disableRichPresence(): void {
        this.subscription.unsubscribe();
        this.clearPresence();
    }

    public initialize(): void {
        if (this.settings.enableDiscordRichPresence) {
            this.enableRichPresence();
        }
    }

    private updatePresence(smallImageKey: string, smallImageText: string): void {
        if (this.discordClient == undefined || !this.discordClient.discordClientIsReady) {
            const clientId: string = SensitiveInformation.discordClientId;
            this.discordClient = new Client({ transport: 'ipc' });
            this.discordClient.login({ clientId }).catch(console.error);

            this.discordClient.on('ready', () => {
                this.discordClient.discordClientIsReady = true;
                this.logger.info(`Discord client is ready`, 'DiscordService', 'updatePresence');

                this.setPresence(smallImageKey, smallImageText);
            });

            this.discordClient.on('disconnected', () => {
                this.discordClient.discordClientIsReady = false;
                this.logger.info(`Discord client has disconnected`, 'DiscordService', 'updatePresence');
            });
        } else {
            this.setPresence(smallImageKey, smallImageText);
        }
    }

    private setPresence(smallImageKey: string, smallImageText: string): void {
        try {
            if (this.currentTrack == undefined) {
                this.logger.info(`No currentTrack was found. Not setting Discord Rich Presence.`, 'DiscordService', 'setPresence');

                return;
            }

            this.discordClient.setActivity({
                details: this.currentTrack.title,
                state: this.currentTrack.artists.join(', '),
                startTimestamp: Date.now(),
                endTimestamp: Date.now() + this.currentTrack.durationInMilliseconds,
                largeImageKey: 'icon',
                largeImageText: this.translatorService.get('PlayingWithDopamine'),
                smallImageKey: smallImageKey,
                smallImageText: smallImageText,
                instance: false,
            });
        } catch (e) {
            this.logger.error(`Could not set Discord Rich Presence. Error: ${e.message}`, 'DiscordService', 'setPresence');
        }
    }

    private clearPresence(): void {
        try {
            this.discordClient.clearActivity();
        } catch (e) {
            this.logger.error(`Could not clear Discord Rich Presence. Error: ${e.message}`, 'DiscordService', 'clearPresence');
        }
    }
}
