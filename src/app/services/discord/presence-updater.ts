/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';
import { Client } from 'discord-rpc';
import { SensitiveInformation } from '../../common/application/sensitive-information';
import { Logger } from '../../common/logger';

@Injectable()
export class PresenceUpdater {
    private discordClient: any;

    public constructor(private logger: Logger) {}

    public updatePresence(
        details: string,
        state: string,
        smallImageKey: string,
        smallImageText: string,
        largeImageKey: string,
        largeImageText: string,
        shouldSendTimestamps: boolean,
        startTime: number,
    ): void {
        if (this.discordClient == undefined || !(<boolean>this.discordClient.discordClientIsReady)) {
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
                );
            });

            this.discordClient.on('disconnected', () => {
                this.discordClient.discordClientIsReady = false;
                this.logger.info(`Discord client has disconnected`, 'DiscordService', 'updatePresence');
            });
        } else {
            this.setPresence(details, state, smallImageKey, smallImageText, largeImageKey, largeImageText, shouldSendTimestamps, startTime);
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
    ): void {
        try {
            // It seems required to clear the activity before setting a new one
            // Otherwise the activity will not be updated most of the time
            this.discordClient.clearActivity();

            if (shouldSendTimestamps) {
                this.discordClient.setActivity({
                    details: details,
                    state: state,
                    startTimestamp: startTime,
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
        } catch (e: unknown) {
            this.logger.error(e, 'Could not set Discord Rich Presence', 'DiscordService', 'setPresence');
        }
    }

    public clearPresence(): void {
        try {
            if (this.discordClient != undefined && (this.discordClient.discordClientIsReady as boolean)) {
                this.discordClient.clearActivity();
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not clear Discord Rich Presence', 'DiscordService', 'clearPresence');
        }
    }
}
