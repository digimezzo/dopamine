import { Injectable } from '@angular/core';
import { BaseMediaSessionProxy } from './base-media-session-proxy';

@Injectable()
export class MediaSessionProxy implements BaseMediaSessionProxy {
    public constructor() {}

    public setActionHandler(action: MediaSessionAction, handler: MediaSessionActionHandler): void {
        window.navigator.mediaSession.setActionHandler(action, handler);
    }

    public clearActionHandler(action: MediaSessionAction): void {
        window.navigator.mediaSession.setActionHandler(action, () => undefined);
    }

    public setMetadata(title: string, artist: string, album: string, artwork: string): void {
        const metadata: MediaMetadata = new MediaMetadata({
            title: title,
            artist: artist,
            album: album,
            artwork: [
                {
                    src: artwork,
                },
            ],
        });

        window.navigator.mediaSession.metadata = metadata;
    }

    public clearMetadata(): void {
        window.navigator.mediaSession.metadata = undefined;
    }
}
