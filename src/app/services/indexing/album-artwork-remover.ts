import { Injectable } from '@angular/core';
import { AlbumArtwork } from '../../common/data/entities/album-artwork';
import { BaseAlbumArtworkRepository } from '../../common/data/repositories/base-album-artwork-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';

@Injectable()
export class AlbumArtworkRemover {
    constructor(
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private fileAccess: BaseFileAccess,
        private snackBarService: BaseSnackBarService,
        private logger: Logger
    ) {}

    public removeAlbumArtworkThatHasNoTrack(): void {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const numberOfAlbumArtworkToRemove: number = this.albumArtworkRepository.getNumberOfAlbumArtworkThatHasNoTrack();

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There is no album artwork to remove. Time required: ${timer.elapsedMilliseconds} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkThatHasNoTrack'
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );

            this.snackBarService.updatingAlbumArtworkAsync();

            const numberOfRemovedAlbumArtwork: number = this.albumArtworkRepository.deleteAlbumArtworkThatHasNoTrack();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.elapsedMilliseconds} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );
        } catch (e) {
            timer.stop();

            this.logger.error(
                `Could not remove album artwork. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );
        }
    }

    public removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): void {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const numberOfAlbumArtworkToRemove: number =
                this.albumArtworkRepository.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There is no album artwork to remove. Time required: ${timer.elapsedMilliseconds} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing'
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing'
            );

            this.snackBarService.updatingAlbumArtworkAsync();

            const numberOfRemovedAlbumArtwork: number =
                this.albumArtworkRepository.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.elapsedMilliseconds} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing'
            );
        } catch (e) {
            timer.stop();

            this.logger.error(
                `Could not remove album artwork. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing'
            );
        }
    }

    public async removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync(): Promise<void> {
        try {
            const allAlbumArtworkInDatabase: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtwork();

            this.logger.info(
                `Found ${allAlbumArtworkInDatabase.length} album artwork in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync'
            );

            const allArtworkIdsInDatabase: string[] = allAlbumArtworkInDatabase.map((x) => x.artworkId);

            this.logger.info(
                `Found ${allArtworkIdsInDatabase.length} artworkIds in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync'
            );

            const coverArtCacheFullPath: string = this.fileAccess.coverArtCacheFullPath();
            const allAlbumArtworkFilePaths: string[] = await this.fileAccess.getFilesInDirectoryAsync(coverArtCacheFullPath);

            this.logger.info(
                `Found ${allAlbumArtworkFilePaths.length} artwork files on disk`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync'
            );

            let numberOfRemovedAlbumArtwork: number = 0;

            for (const albumArtworkFilePath of allAlbumArtworkFilePaths) {
                const albumArtworkFileNameWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(albumArtworkFilePath);

                if (!allArtworkIdsInDatabase.includes(albumArtworkFileNameWithoutExtension)) {
                    await this.fileAccess.deleteFileIfExistsAsync(albumArtworkFilePath);
                    numberOfRemovedAlbumArtwork++;
                }

                if (numberOfRemovedAlbumArtwork === 1) {
                    // Only trigger the snack bar once
                    await this.snackBarService.updatingAlbumArtworkAsync();
                }
            }
        } catch (e) {
            this.logger.error(
                `Could not remove album artwork from disk. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync'
            );
        }
    }
}
