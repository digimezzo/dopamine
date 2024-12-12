import { Client, Presence } from 'discord-rpc';

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

    public constructor(clientId: string) {
        this.clientId = clientId;
        this.rpc = new Client({ transport: 'ipc' });
        this.isReady = false;

        // Bind event listeners
        this.rpc.on('ready', () => {
            console.log('Discord RPC is ready!');
            this.isReady = true;
        });

        this.rpc.on('disconnected', () => {
            console.warn('Discord RPC disconnected. Attempting to reconnect...');
            this.isReady = false;
            this.login(); // Reattempt connection
        });

        // Log in to Discord RPC
        this.login();
    }

    private login(): void {
        this.rpc
            .login({ clientId: this.clientId })
            .then(() => console.log('Successfully logged into Discord RPC'))
            .catch((error) => console.error('Failed to log into Discord RPC:', error));
    }

    public setPresence(args: PresenceArgs): void {
        if (!this.isReady) {
            console.warn('Discord RPC is not ready. Cannot set presence.');
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
        console.log('Rich Presence updated:', presence);
    }

    public clearPresence(): void {
        if (!this.isReady) {
            console.warn('Discord RPC is not ready. Cannot clear presence.');
            return;
        }

        this.rpc.clearActivity();
        console.log('Rich Presence cleared.');
    }

    public shutdown(): void {
        this.rpc.destroy();
        console.log('Discord RPC client destroyed.');
    }
}
