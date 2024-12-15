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
    private readonly _clientId: string;
    private _client: Client;
    private _isReady: boolean;
    private _presenceToSetWhenReady: PresenceArgs | undefined;

    public constructor(clientId: string) {
        this._clientId = clientId;
        this.reconnect();
    }

    private reconnect(): void {
        this._client = new Client({ transport: 'ipc' });
        this._isReady = false;

        this._client.on('ready', () => {
            log.info('[DiscordApi] [ready] Discord client is ready!');
            this._isReady = true;

            if (this._presenceToSetWhenReady) {
                this.setPresence(this._presenceToSetWhenReady);
                this._presenceToSetWhenReady = undefined;
            }
        });

        this._client.on('disconnected', () => {
            log.info('[DiscordApi] [disconnected] Discord client disconnected. Attempting to reconnect...');
            this._isReady = false;
            this.login();
        });

        this.login();
    }

    private async login(): Promise<void> {
        try {
            await this._client.login({ clientId: this._clientId });
            log.info('[DiscordApi] [login] Successfully logged into Discord client');
        } catch (error) {
            log.error(`[DiscordApi] [login] Failed to log into Discord client: ${error}`);
        }
    }

    public setPresence(args: PresenceArgs): void {
        if (!this._isReady) {
            log.warn('[DiscordApi] [setPresence] Discord client is not ready. Attempting reconnect.');
            this._presenceToSetWhenReady = args;
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
        this._presenceToSetWhenReady = undefined;

        if (!this._isReady) {
            log.warn('[DiscordApi] [clearPresence] Discord client is not ready. Cannot clear presence.');
            return;
        }

        this._client.clearActivity();
        log.info('[DiscordApi] [clearPresence] Rich Presence cleared.');
    }

    public shutdown(): void {
        this._presenceToSetWhenReady = undefined;

        this._client.destroy();
        log.info('[DiscordApi] [shutdown] Discord client destroyed.');
    }
}
