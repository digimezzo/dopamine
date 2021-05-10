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

    public saveSelectedAlbumToSettings(selectedAlbum: AlbumModel): void {
        if (selectedAlbum == undefined) {
            this.settings.albumsTabSelectedAlbum = '';
        } else {
            this.settings.albumsTabSelectedAlbum = selectedAlbum.albumKey;
        }
    }

    public getSelectedAlbumFromSettings(availableAlbums: AlbumModel[]): AlbumModel {
        if (availableAlbums == undefined) {
            return undefined;
        }

        if (availableAlbums.length === 0) {
            return undefined;
        }

        try {
            const selectedAlbumInSettings: string = this.settings.albumsTabSelectedAlbum;

            if (!StringCompare.isNullOrWhiteSpace(selectedAlbumInSettings)) {
                this.logger.info(
                    `Found album '${selectedAlbumInSettings}' in the settings`,
                    'AlbumsPersister',
                    'getSelectedAlbumFromSettings'
                );

                if (availableAlbums.map((x) => x.albumKey).includes(selectedAlbumInSettings)) {
                    this.logger.info(`Selecting album '${selectedAlbumInSettings}'`, 'AlbumsPersister', 'getSelectedAlbumFromSettings');

                    return availableAlbums.filter((x) => x.albumKey === selectedAlbumInSettings)[0];
                } else {
                    this.logger.info(
                        `Could not select album '${selectedAlbumInSettings}' because it does not exist`,
                        'AlbumsPersister',
                        'getSelectedAlbumFromSettings'
                    );
                }
            }
        } catch (e) {
            this.logger.error(
                `Could not get selected album from settings. Error: ${e.message}`,
                'AlbumsPersister',
                'getSelectedAlbumFromSettings'
            );
        }

        return availableAlbums[0];
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
