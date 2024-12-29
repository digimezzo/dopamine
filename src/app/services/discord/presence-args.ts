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
