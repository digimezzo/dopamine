export abstract class BaseMediaSessionProxy {
    public abstract setActionHandler(action: MediaSessionAction, handler: MediaSessionActionHandler): void;
    public abstract clearActionHandler(action: MediaSessionAction): void;
    public abstract setMetadata(title: string, artist: string, album: string, artwork: string): void;
    public abstract clearMetadata(): void;
}
