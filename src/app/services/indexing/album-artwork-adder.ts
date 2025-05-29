import { Injectable } from '@angular/core';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { AlbumData } from '../../data/entities/album-data';
import { Track } from '../../data/entities/track';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { AlbumArtworkCacheId } from '../album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkGetter } from './album-artwork-getter';
import { AlbumArtworkCacheServiceBase } from '../album-artwork-cache/album-artwork-cache.service.base';
import { AlbumArtworkRepositoryBase } from '../../data/repositories/album-artwork-repository.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable({ providedIn: 'root' })
export class AlbumArtworkAdder {
    public constructor(
        private albumArtworkCacheService: AlbumArtworkCacheServiceBase,
        private albumArtworkRepository: AlbumArtworkRepositoryBase,
        private trackRepository: TrackRepositoryBase,
        private fileMetadataFactory: FileMetadataFactoryBase,
        private notificationService: NotificationServiceBase,
        private logger: Logger,
        private albumArtworkGetter: AlbumArtworkGetter,
        private settings: SettingsBase,
    ) {}

    public async addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(): Promise<void> {
        try {
            const albumKeyIndex = this.settings.albumKeyIndex;

            const albumDataThatNeedsIndexing: AlbumData[] = this.trackRepository.getAlbumDataThatNeedsIndexing(albumKeyIndex) ?? [];

            if (albumDataThatNeedsIndexing.length === 0) {
                this.logger.info(
                    `Found no album data that needs indexing`,
                    'AlbumArtworkAdder',
                    'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${albumDataThatNeedsIndexing.length} album data that needs indexing`,
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );

            const numberOfAlbumArtwork: number = this.albumArtworkRepository.getNumberOfAlbumArtwork();

            // Only show this notification the 1st time indexing runs.
            if (numberOfAlbumArtwork === 0) {
                await this.notificationService.updatingAlbumArtworkAsync();
            }

            for (const albumData of albumDataThatNeedsIndexing) {
                try {
                    await this.addAlbumArtworkAsync(albumKeyIndex, albumData.albumKey);
                } catch (e: unknown) {
                    this.logger.error(
                        e,
                        `Could not add album artwork for albumKey=${albumData.albumKey}`,
                        'AlbumArtworkAdder',
                        'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                    );
                }
            }
        } catch (e: unknown) {
            this.logger.error(
                e,
                'Could not add album artwork for tracks that need album artwork indexing',
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        }
    }

    private async addAlbumArtworkAsync(albumKeyIndex: string, albumKey: string): Promise<void> {
        const track: Track | undefined = this.trackRepository.getLastModifiedTrackForAlbumKeyAsync(albumKeyIndex, albumKey);

        if (track == undefined) {
            return;
        }

        let albumArtwork: Buffer | undefined;

        try {
            const fileMetadata: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path);
            albumArtwork = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetadata, true);
        } catch (e: unknown) {
            this.logger.error(e, `Could not create file metadata for path='${track.path}'`, 'AlbumArtworkAdder', 'addAlbumArtworkAsync');
        }

        if (albumArtwork == undefined) {
            return;
        }

        const albumArtworkCacheId: AlbumArtworkCacheId | undefined =
            await this.albumArtworkCacheService.addArtworkDataToCacheAsync(albumArtwork);

        if (albumArtworkCacheId == undefined) {
            return;
        }

        this.trackRepository.disableNeedsAlbumArtworkIndexing(albumKey);
        const newAlbumArtwork: AlbumArtwork = new AlbumArtwork(albumKey, albumArtworkCacheId.id);
        this.albumArtworkRepository.addAlbumArtwork(newAlbumArtwork);
    }
}
