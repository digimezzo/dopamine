import { Injectable } from '@angular/core';
import { Client } from 'discord-rpc';
import { SensitiveInformation } from '../../application/sensitive-information';
import { Logger } from '../../logger';

@Injectable()
export class DiscordRichPresenceApi {
    constructor(private logger: Logger) {}

    public updatePresence(): void {
        try {
            // const client = require('discord-rich-presence-typescript')(SensitiveInformation.discordClientId);

            // client.updatePresence({
            //     state: 'By track <<< artist >>>',
            //     details: 'Track <<< title >>>',
            //     startTimestamp: Date.now(),
            //     endTimestamp: Date.now() + 1337,
            //     largeImageKey: 'icon',
            //     smallImageKey: 'play',
            //     instance: false,
            // });
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
