import { Injectable } from '@angular/core';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { StringCompare } from '../../../core/string-compare';
import { AlbumModel } from '../../../services/album/album-model';
import { AlbumOrder } from '../album-order';

@Injectable({
    providedIn: 'root',
})
export class AlbumsPersister {
    constructor(private settings: BaseSettings, private logger: Logger) {}

    public saveSelectedAlbumsToSettings(selectedAlbums: AlbumModel[]): void {
        try {
            let albumKeysToSave: string = '';

            if (selectedAlbums != undefined && selectedAlbums.length > 0) {
                albumKeysToSave = selectedAlbums.map((x) => x.albumKey).join(',');
            }

            this.settings.albumsTabSelectedAlbums = albumKeysToSave;
        } catch (e) {
            this.logger.error(
                `Could not save selected album to settings. Error: ${e.message}`,
                'AlbumsPersister',
                'saveSelectedAlbumsToSettings'
            );
        }
    }

    public getSelectedAlbumsFromSettings(availableAlbums: AlbumModel[]): AlbumModel[] {
        if (availableAlbums == undefined) {
            return undefined;
        }

        if (availableAlbums.length === 0) {
            return undefined;
        }

        try {
            const selectedAlbumsInSettings: string = this.settings.albumsTabSelectedAlbums;

            if (!StringCompare.isNullOrWhiteSpace(selectedAlbumsInSettings)) {
                const albumKeysFromSettings: string[] = selectedAlbumsInSettings.split(',');
                const selectedAlbums: AlbumModel[] = availableAlbums.filter((x) => albumKeysFromSettings.includes(x.albumKey));

                return selectedAlbums;
            }
        } catch (e) {
            this.logger.error(
                `Could not get selected albums from settings. Error: ${e.message}`,
                'AlbumsPersister',
                'getSelectedAlbumFromSettings'
            );
        }

        return undefined;
    }

    public saveSelectedAlbumOrderToSettings(selectedAlbumOrder: AlbumOrder): void {
        this.settings.albumsTabSelectedAlbumOrder = AlbumOrder[selectedAlbumOrder];
    }

    public getSelectedAlbumOrderFromSettings(): AlbumOrder {
        const albumOrderFromSettings: AlbumOrder = (AlbumOrder as any)[this.settings.albumsTabSelectedAlbumOrder];

        if (albumOrderFromSettings != undefined) {
            return albumOrderFromSettings;
        }

        return AlbumOrder.byAlbumTitleAscending;
    }
}
