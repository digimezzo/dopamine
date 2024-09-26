import { Injectable } from '@angular/core';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { AlbumArtworkRepositoryBase } from '../../data/repositories/album-artwork-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { ApplicationPaths } from '../../common/application/application-paths';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable({ providedIn: 'root' })
export class AlbumArtworkRemover {
    public constructor(
        private albumArtworkRepository: AlbumArtworkRepositoryBase,
        private fileAccess: FileAccessBase,
        private applicationPaths: ApplicationPaths,
        private notificationService: NotificationServiceBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public async removeAlbumArtworkThatHasNoTrackAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();
        
        const albumKeyIndex: string = this.settings.albumKeyIndex;

        try {
            const numberOfAlbumArtworkToRemove: number = this.albumArtworkRepository.getNumberOfAlbumArtworkThatHasNoTrack(
                albumKeyIndex,
            );

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There is no album artwork to remove. Time required: ${timer.elapsedMilliseconds} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkThatHasNoTrackAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrackAsync',
            );

            await this.notificationService.updatingAlbumArtworkAsync();

            const numberOfRemovedAlbumArtwork: number = this.albumArtworkRepository.deleteAlbumArtworkThatHasNoTrack(
                albumKeyIndex,
            );

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.elapsedMilliseconds} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrackAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(e, 'Could not remove album artwork', 'AlbumArtworkRemover', 'removeAlbumArtworkThatHasNoTrackAsync');
        }
    }

    public async removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const albumKeyIndex: string = this.settings.albumKeyIndex;
            const numberOfAlbumArtworkToRemove: number =
                this.albumArtworkRepository.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(albumKeyIndex);

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There is no album artwork to remove. Time required: ${timer.elapsedMilliseconds} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );

            await this.notificationService.updatingAlbumArtworkAsync();

            const numberOfRemovedAlbumArtwork: number = this.albumArtworkRepository.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(
                albumKeyIndex,
            );

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.elapsedMilliseconds} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(
                e,
                'Could not remove album artwork',
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        }
    }

    public async removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync(): Promise<void> {
        try {
            const allAlbumArtworkInDatabase: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtwork() ?? [];

            this.logger.info(
                `Found ${allAlbumArtworkInDatabase.length} album artwork in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const allArtworkIdsInDatabase: string[] = allAlbumArtworkInDatabase.map((x) => x.artworkId);

            this.logger.info(
                `Found ${allArtworkIdsInDatabase.length} artworkIds in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const coverArtCacheFullPath: string = this.applicationPaths.coverArtCacheFullPath();
            const allAlbumArtworkFilePaths: string[] = await this.fileAccess.getFilesInDirectoryAsync(coverArtCacheFullPath);

            this.logger.info(
                `Found ${allAlbumArtworkFilePaths.length} artwork files on disk`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            let numberOfRemovedAlbumArtwork: number = 0;

            for (const albumArtworkFilePath of allAlbumArtworkFilePaths) {
                const albumArtworkFileNameWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(albumArtworkFilePath);

                if (!allArtworkIdsInDatabase.includes(albumArtworkFileNameWithoutExtension)) {
                    await this.fileAccess.deleteFileIfExistsAsync(albumArtworkFilePath);
                    numberOfRemovedAlbumArtwork++;
                }

                if (numberOfRemovedAlbumArtwork === 1) {
                    // Only trigger the notification once
                    await this.notificationService.updatingAlbumArtworkAsync();
                }
            }
        } catch (e: unknown) {
            this.logger.error(
                e,
                'Could not remove album artwork from disk',
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );
        }
    }
}
