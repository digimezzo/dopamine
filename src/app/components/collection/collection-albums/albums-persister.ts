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

    public saveActiveAlbumToSettings(activeAlbum: AlbumModel): void {
        if (activeAlbum == undefined) {
            this.settings.albumsTabActiveAlbum = '';
        } else {
            this.settings.albumsTabActiveAlbum = activeAlbum.albumKey;
        }
    }

    public getActiveAlbumFromSettings(availableAlbums: AlbumModel[]): AlbumModel {
        if (availableAlbums == undefined) {
            return undefined;
        }

        if (availableAlbums.length === 0) {
            return undefined;
        }

        try {
            const activeAlbumInSettings: string = this.settings.albumsTabActiveAlbum;

            if (!StringCompare.isNullOrWhiteSpace(activeAlbumInSettings)) {
                this.logger.info(`Found album '${activeAlbumInSettings}' in the settings`, 'AlbumsPersister', 'getActiveAlbumFromSettings');

                if (availableAlbums.map((x) => x.albumKey).includes(activeAlbumInSettings)) {
                    this.logger.info(`Selecting album '${activeAlbumInSettings}'`, 'AlbumsPersister', 'getActiveAlbumFromSettings');

                    return availableAlbums.filter((x) => x.albumKey === activeAlbumInSettings)[0];
                } else {
                    this.logger.info(
                        `Could not select album '${activeAlbumInSettings}' because it does not exist`,
                        'AlbumsPersister',
                        'getActiveAlbumFromSettings'
                    );
                }
            }
        } catch (e) {
            this.logger.error(
                `Could not get active album from settings. Error: ${e.message}`,
                'AlbumsPersister',
                'getActiveAlbumFromSettings'
            );
        }

        return availableAlbums[0];
    }

    public saveActiveAlbumOrderToSettings(activeAlbumOrder: AlbumOrder): void {
        this.settings.albumsTabActiveAlbumOrder = AlbumOrder[activeAlbumOrder];
    }

    public getActiveAlbumOrderFromSettings(): AlbumOrder {
        const albumOrderFromSettings: AlbumOrder = (AlbumOrder as any)[this.settings.albumsTabActiveAlbumOrder];

        if (albumOrderFromSettings != undefined) {
            return albumOrderFromSettings;
        }

        return AlbumOrder.byAlbumTitleAscending;
    }
}
