import { Injectable } from '@angular/core';
import { FileAccessBase } from '../io/file-access.base';
import { DesktopBase } from '../io/desktop.base';

@Injectable({
    providedIn: 'root',
})
export class ApplicationPaths {
    public constructor(
        private fileAccess: FileAccessBase,
        private desktop: DesktopBase,
    ) {}

    public coverArtCacheFullPath(): string {
        return this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'Cache', 'CoverArt']);
    }

    public coverArtFullPath(artworkId: string): string {
        return this.fileAccess.combinePath([this.coverArtCacheFullPath(), `${artworkId}.jpg`]);
    }

    public playlistsDirectoryFullPath(): string {
        return this.fileAccess.combinePath([this.desktop.getMusicDirectory(), 'Dopamine', 'Playlists']);
    }

    public themesDirectoryFullPath(): string {
        return this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'Themes']);
    }
}
