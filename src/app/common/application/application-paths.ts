import { Injectable } from '@angular/core';
import { FileAccessBase } from '../io/file-access.base';
import { DesktopBase } from '../io/desktop.base';

@Injectable({
    providedIn: 'root',
})
export class ApplicationPaths {
    private _coverArtCacheFullPath = '';
    private _themesDirectoryFullPath = '';

    public constructor(
        private fileAccess: FileAccessBase,
        private desktop: DesktopBase,
    ) {
        this._coverArtCacheFullPath = this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'Cache', 'CoverArt']);
        this._themesDirectoryFullPath = this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'Themes']);
    }

    public coverArtCacheFullPath(): string {
        return this._coverArtCacheFullPath;
    }

    public coverArtFullPath(artworkId: string): string {
        return this.fileAccess.combinePath([this._coverArtCacheFullPath, `${artworkId}.jpg`]);
    }

    public themesDirectoryFullPath(): string {
        return this._themesDirectoryFullPath;
    }
}
