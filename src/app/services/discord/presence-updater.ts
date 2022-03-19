import { Injectable } from '@angular/core';
import { Client } from 'discord-rpc';
import { SensitiveInformation } from '../../common/application/sensitive-information';
import { Logger } from '../../common/logger';

@Injectable()
export class PresenceUpdater {
    private discordClient: any;

    constructor(private logger: Logger) {}

    public updatePresence(
        details: string,
        state: string,
        smallImageKey: string,
        smallImageText: string,
        largeImageKey: string,
        largeImageText: string,
        shouldSendTimestamps: boolean,
        startTime: number,
        endTime: number
    ): void {
        if (this.discordClient == undefined || !this.discordClient.discordClientIsReady) {
            const clientId: string = SensitiveInformation.discordClientId;
            this.discordClient = new Client({ transport: 'ipc' });
            this.discordClient.login({ clientId }).catch(console.error);

            this.discordClient.on('ready', () => {
                this.discordClient.discordClientIsReady = true;
                this.logger.info(`Discord client is ready`, 'DiscordService', 'updatePresence');

                this.setPresence(
                    details,
                    state,
                    smallImageKey,
                    smallImageText,
                    largeImageKey,
                    largeImageText,
                    shouldSendTimestamps,
                    startTime,
                    endTime
                );
            });

            this.discordClient.on('disconnected', () => {
                this.discordClient.discordClientIsReady = false;
                this.logger.info(`Discord client has disconnected`, 'DiscordService', 'updatePresence');
            });
        } else {
            this.setPresence(
                details,
                state,
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

    public setPresence(
        details: string,
        state: string,
        smallImageKey: string,
        smallImageText: string,
        largeImageKey: string,
        largeImageText: string,
        shouldSendTimestamps: boolean,
        startTime: number,
        endTime: number
    ): void {
        try {
            if (shouldSendTimestamps) {
                this.discordClient.setActivity({
                    details: details,
                    state: state,
                    startTimestamp: startTime,
                    endTimestamp: endTime,
                    largeImageKey: largeImageKey,
                    largeImageText: largeImageText,
                    smallImageKey: smallImageKey,
                    smallImageText: smallImageText,
                    instance: false,
                });
            } else {
                this.discordClient.setActivity({
                    details: details,
                    state: state,
                    largeImageKey: largeImageKey,
                    largeImageText: largeImageText,
                    smallImageKey: smallImageKey,
                    smallImageText: smallImageText,
                    instance: false,
                });
            }

            this.logger.info(`Set Discord Rich Presence`, 'DiscordService', 'setPresence');
        } catch (e) {
            this.logger.error(`Could not set Discord Rich Presence. Error: ${e.message}`, 'DiscordService', 'setPresence');
        }
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
