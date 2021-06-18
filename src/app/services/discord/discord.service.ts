import { Injectable } from '@angular/core';
import { Client } from 'discord-rpc';
import { Subscription } from 'rxjs';
import { SensitiveInformation } from '../../common/application/sensitive-information';
import { Logger } from '../../common/logger';
import { BaseDiscordService } from './base-discord.service';

@Injectable()
export class DiscordService implements BaseDiscordService {
    private subscription: Subscription = new Subscription();

    constructor(private logger: Logger) {}

    public enableRichPresence(): void {
        throw new Error('Method not implemented.');
    }
    public disableRichPresence(): void {
        throw new Error('Method not implemented.');
    }

    private updatePresence(
        details: string,
        state: string,
        startTimestamp: Date,
        endTimestamp: Date,
        largeImageKey: string,
        largeImageText: string,
        smallImageKey: string,
        smallImageText: string
    ): void {
        try {
            const clientId: string = SensitiveInformation.discordClientId;
            const client = new Client({ transport: 'ipc' });
            client.login({ clientId }).catch(console.error);

            client.on('ready', () => {
                this.logger.error(`Discord client is ready`, 'DiscordRichPresenceApi', 'updatePresence');

                client.setActivity({
                    details: 'Track <<< title yesss! >>>',
                    state: 'By track <<< artist >>>',
                    startTimestamp: Date.now(),
                    endTimestamp: Date.now() + 1337,
                    largeImageKey: 'icon',
                    largeImageText: 'tea is delicious',
                    smallImageKey: 'play',
                    smallImageText: 'i am my own pillows',
                    instance: false,
                });
            });
        } catch (e) {
            this.logger.error(`Could not update Discord Rich Presence. Error: ${e.message}`, 'DiscordRichPresenceApi', 'updatePresence');
        }
    }
}
