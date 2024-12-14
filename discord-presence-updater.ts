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

export class DiscordPresenceUpdater {
    private clientId: string;
    private rpc: Client;
    private isReady: boolean;
    private presenceToSetWhenReady: PresenceArgs | undefined;

    public constructor(clientId: string) {
        this.clientId = clientId;
        this.reconnect();
    }

    private reconnect(): void {
        this.rpc = new Client({ transport: 'ipc' });
        this.isReady = false;

        // Bind event listeners
        this.rpc.on('ready', () => {
            log.info('[DiscordPresenceUpdater] [ready] Discord RPC is ready!');
            this.isReady = true;

            if (this.presenceToSetWhenReady) {
                this.setPresence(this.presenceToSetWhenReady);
                this.presenceToSetWhenReady = undefined;
            }
        });

        this.rpc.on('disconnected', () => {
            log.info('[DiscordPresenceUpdater] [disconnected] Discord RPC disconnected. Attempting to reconnect...');
            this.isReady = false;
            this.login(); // Reattempt connection
        });

        // Log in to Discord RPC
        this.login();
    }

    private async login(): Promise<void> {
        try {
            await this.rpc.login({ clientId: this.clientId });
            log.info('[DiscordPresenceUpdater] [login] Successfully logged into Discord RPC');
        } catch (error) {
            log.error(`[DiscordPresenceUpdater] [login] Failed to log into Discord RPC: ${error}`);
        }
    }

    public setPresence(args: PresenceArgs): void {
        if (!this.isReady) {
            log.warn('[DiscordPresenceUpdater] [setPresence] Discord RPC is not ready. Attempting reconnect.');
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

        this.rpc.setActivity(presence);
        log.info(`[DiscordPresenceUpdater] [setPresence] Rich Presence updated:: ${presence}`);
    }

    public clearPresence(): void {
        this.presenceToSetWhenReady = undefined;

        if (!this.isReady) {
            log.warn('[DiscordPresenceUpdater] [clearPresence] Discord RPC is not ready. Cannot clear presence.');
            return;
        }

        this.rpc.clearActivity();
        log.info('[DiscordPresenceUpdater] [clearPresence] Rich Presence cleared.');
    }

    public shutdown(): void {
        this.presenceToSetWhenReady = undefined;

        this.rpc.destroy();
        log.info('[DiscordPresenceUpdater] [shutdown] Discord RPC client destroyed.');
    }
}
