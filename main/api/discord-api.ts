import { Client, Presence } from 'discord-rpc';
import log from 'electron-log';

export interface PresenceArgs {
    title: string;
    artists: string;
    smallImageKey?: string;
    smallImageText?: string;
    largeImageKey?: string;
    largeImageText?: string;
    shouldSendTimestamps?: boolean;
    startTime?: number;
}

export class DiscordApi {
    private readonly clientId: string;
    private _client: Client;
    private isReady: boolean;
    private presenceToSetWhenReady: PresenceArgs | undefined;

    public constructor(clientId: string) {
        this.clientId = clientId;
        this.reconnect();
    }

    private reconnect(): void {
        this._client = new Client({ transport: 'ipc' });
        this.isReady = false;

        this._client.on('ready', () => {
            log.info('[DiscordApi] [ready] Discord client is ready!');
            this.isReady = true;

            if (this.presenceToSetWhenReady) {
                this.setPresence(this.presenceToSetWhenReady);
                this.presenceToSetWhenReady = undefined;
            }
        });

        this._client.on('disconnected', () => {
            log.info('[DiscordApi] [disconnected] Discord client disconnected. Attempting to reconnect...');
            this.isReady = false;
            this.login();
        });

        this.login();
    }

    private async login(): Promise<void> {
        try {
            await this._client.login({ clientId: this.clientId });
            log.info('[DiscordApi] [login] Successfully logged into Discord client');
        } catch (error) {
            log.error(`[DiscordApi] [login] Failed to log into Discord client: ${error}`);
        }
    }

    public setPresence(args: PresenceArgs): void {
        if (!this.isReady) {
            log.warn('[DiscordApi] [setPresence] Discord client is not ready. Attempting reconnect.');
            this.presenceToSetWhenReady = args;
            this.reconnect();

            return;
        }

        const presence: Presence = {
            details: `${args.title}`,
            state: `${args.artists}`,
            largeImageKey: args.largeImageKey,
            largeImageText: args.largeImageText,
            smallImageKey: args.smallImageKey,
            smallImageText: args.smallImageText,
        };

        if (args.shouldSendTimestamps && args.startTime) {
            presence.startTimestamp = Math.floor(args.startTime / 1000);
        }

        this._client.setActivity(presence);
        log.info(`[DiscordApi] [setPresence] Rich Presence updated: ${presence.state} - ${presence.details}`);
    }

    public clearPresence(): void {
        this.presenceToSetWhenReady = undefined;

        if (!this.isReady) {
            log.warn('[DiscordApi] [clearPresence] Discord client is not ready. Cannot clear presence.');
            return;
        }

        this._client.clearActivity();
        log.info('[DiscordApi] [clearPresence] Rich Presence cleared.');
    }

    public shutdown(): void {
        this.presenceToSetWhenReady = undefined;

        this._client.destroy();
        log.info('[DiscordApi] [shutdown] Discord client destroyed.');
    }
}
