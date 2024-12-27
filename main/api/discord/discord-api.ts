import { Client, Presence } from 'discord-rpc';
import log from 'electron-log';
import { PresenceArgs } from './presence-args';

export class DiscordApi {
    private readonly _clientId: string;
    private _client: Client;
    private _isReady: boolean;
    private _presenceToSetWhenReady: PresenceArgs | undefined;
    private _isReconnecting: boolean = false;

    public constructor(clientId: string) {
        this._clientId = clientId;
    }

    private reconnect(): void {
        if (this._isReconnecting) {
            log.info('[DiscordApi] [reconnect] Already attempting to reconnect. Skipping...');
            return;
        }

        this._isReconnecting = true;
        this._isReady = false;
        this._client = new Client({ transport: 'ipc' });

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
        } finally {
            this._isReconnecting = false;
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

        if (!this._client) {
            log.error('[DiscordApi] [setPresence] Discord client not found.');
            return;
        }

        this._client.setActivity(presence);
        log.info(`[DiscordApi] [setPresence] Rich Presence updated: ${presence.state} - ${presence.details} (${presence.smallImageKey})`);
    }

    public clearPresence(): void {
        this._presenceToSetWhenReady = undefined;

        if (!this._isReady) {
            log.warn('[DiscordApi] [clearPresence] Discord client is not ready. Cannot clear presence.');
            return;
        }

        if (!this._client) {
            log.error('[DiscordApi] [clearPresence] Discord client not found.');
            return;
        }

        this._client.clearActivity();
        log.info('[DiscordApi] [clearPresence] Rich Presence cleared.');
    }

    public shutdown(): void {
        this._presenceToSetWhenReady = undefined;

        if (!this._client) {
            log.warn('[DiscordApi] [shutdown] Discord client not found.');
            return;
        }

        this._client.destroy();
        log.info('[DiscordApi] [shutdown] Discord client destroyed.');
    }
}
