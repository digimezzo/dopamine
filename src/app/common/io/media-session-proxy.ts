import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MediaSessionProxy {
    public setActionHandler(action: MediaSessionAction, handler: MediaSessionActionHandler): void {
        window.navigator.mediaSession.setActionHandler(action, handler);
    }

    public clearActionHandler(action: MediaSessionAction): void {
        window.navigator.mediaSession.setActionHandler(action, () => undefined);
    }

    public setMetadata(title: string, artist: string, album: string, artwork: string): void {
        window.navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            album: album,
            artwork: [
                {
                    src: artwork,
                },
            ],
        });
    }

    public clearMetadata(): void {
        window.navigator.mediaSession.metadata = null;
    }
}
