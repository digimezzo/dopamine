import { Injectable } from '@angular/core';
import { Client } from 'discord-rpc';
import { SensitiveInformation } from '../../common/application/sensitive-information';
import { Logger } from '../../common/logger';
import { BasePlaybackService } from '../playback/base-playback.service';
import { BaseTranslatorService } from '../translator/base-translator.service';

@Injectable()
export class PresenceUpdater {
    private discordClient: any;

    constructor(private playbackService: BasePlaybackService, private translatorService: BaseTranslatorService, private logger: Logger) {}

    public updatePresence(smallImageKey: string, smallImageText: string): void {
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

    public setPresence(smallImageKey: string, smallImageText: string): void {
        if (this.playbackService.currentTrack == undefined) {
            this.logger.info(`No currentTrack was found. Not setting Discord Rich Presence.`, 'DiscordService', 'setPresence');

            return;
        }

        try {
            this.discordClient.setActivity({
                details: this.playbackService.currentTrack.title,
                state: this.playbackService.currentTrack.artists.join(', '),
                startTimestamp: Date.now(),
                endTimestamp: Date.now() + this.calculateTimeRemainingInMilliseconds(),
                largeImageKey: 'icon',
                largeImageText: this.translatorService.get('PlayingWithDopamine'),
                smallImageKey: smallImageKey,
                smallImageText: smallImageText,
                instance: false,
            });
            this.logger.info(`Set Discord Rich Presence`, 'DiscordService', 'setPresence');
        } catch (e) {
            this.logger.error(`Could not set Discord Rich Presence. Error: ${e.message}`, 'DiscordService', 'setPresence');
        }
    }

    public calculateTimeRemainingInMilliseconds(): number {
        const timeRemainingInMilliseconds: number =
            (this.playbackService.progress.totalSeconds - this.playbackService.progress.progressSeconds) * 1000;

        if (timeRemainingInMilliseconds === 0) {
            return this.playbackService.currentTrack.durationInMilliseconds;
        }

        return timeRemainingInMilliseconds;
    }

    public clearPresence(): void {
        try {
            if (this.discordClient != undefined && this.discordClient.discordClientIsReady) {
                this.discordClient.clearActivity();
            }
        } catch (e) {
            this.logger.error(`Could not clear Discord Rich Presence. Error: ${e.message}`, 'DiscordService', 'clearPresence');
        }
    }
}
