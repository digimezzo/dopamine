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
    private _discordClient: any;
    private _discordClientIsReady: boolean = false;

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
        if (this._discordClient == undefined || !this._discordClientIsReady) {
            const clientId: string = SensitiveInformation.discordClientId;
            this._discordClient = new Client({ transport: 'ipc' });
            this._discordClient.login({ clientId }).catch(console.error);

            // 'Ready' is emitted when the client is connected to Discord
            this._discordClient.on('ready', () => {
                this._discordClientIsReady = true;
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

            // 'Disconnected' is emitted when the client has disconnected from Discord
            this._discordClient.on('disconnected', () => {
                this._discordClientIsReady = false;
                this.logger.info(`Discord client has disconnected`, 'DiscordService', 'updatePresence');
            });
        } else {
            this.setPresence(details, state, smallImageKey, smallImageText, largeImageKey, largeImageText, shouldSendTimestamps, startTime);
        }
    }

    public clearPresence(): void {
        if (this._discordClient == undefined || !this._discordClientIsReady) {
            return;
        }

        try {
            this._discordClient.clearActivity();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not clear Discord Rich Presence', 'DiscordService', 'clearPresence');
        }
    }

    private setPresence(
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
            this._discordClient.clearActivity();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not clear Discord Rich Presence', 'DiscordService', 'clearPresence');
        }

        setTimeout(() => {
            try {
                if (shouldSendTimestamps) {
                    this._discordClient.setActivity({
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
                    this._discordClient.setActivity({
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
        }, 500);
    }
}
