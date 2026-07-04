import { Injectable } from '@angular/core';
import { ArtistArtwork } from '../../data/entities/artist-artwork';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { ArtistArtworkRepositoryBase } from '../../data/repositories/artist-artwork-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { ApplicationPaths } from '../../common/application/application-paths';

@Injectable({ providedIn: 'root' })
export class ArtistArtworkRemover {
    public constructor(
        private artistArtworkRepository: ArtistArtworkRepositoryBase,
        private fileAccess: FileAccessBase,
        private applicationPaths: ApplicationPaths,
        private notificationService: NotificationServiceBase,
        private logger: Logger,
    ) {}

    public async removeArtistArtworkThatHasNoTrackAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const numberOfArtistArtworkToRemove: number = this.artistArtworkRepository.getNumberOfArtistArtworkThatHasNoTrack();

            if (numberOfArtistArtworkToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There is no artist artwork to remove. Time required: ${timer.elapsedMilliseconds} ms.`,
                    'ArtistArtworkRemover',
                    'removeArtistArtworkThatHasNoTrackAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfArtistArtworkToRemove} artist artwork.`,
                'ArtistArtworkRemover',
                'removeArtistArtworkThatHasNoTrackAsync',
            );

            await this.notificationService.updatingArtistArtworkAsync();

            const numberOfRemovedArtistArtwork: number = this.artistArtworkRepository.deleteArtistArtworkThatHasNoTrack();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedArtistArtwork} artist artwork. Time required: ${timer.elapsedMilliseconds} ms.`,
                'ArtistArtworkRemover',
                'removeArtistArtworkThatHasNoTrackAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(e, 'Could not remove artist artwork', 'ArtistArtworkRemover', 'removeArtistArtworkThatHasNoTrackAsync');
        }
    }

    public async removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync(): Promise<void> {
        try {
            const allArtistArtworkInDatabase: ArtistArtwork[] = this.artistArtworkRepository.getAllArtistArtwork() ?? [];

            this.logger.info(
                `Found ${allArtistArtworkInDatabase.length} artist artwork in the database`,
                'ArtistArtworkRemover',
                'removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const artistArtCacheFullPath: string = this.applicationPaths.artistArtCacheFullPath();
            const allArtistArtworkFilePaths: string[] = await this.fileAccess.getFilesInDirectoryAsync(artistArtCacheFullPath);

            this.logger.info(
                `Found ${allArtistArtworkFilePaths.length} artwork files on disk`,
                'ArtistArtworkRemover',
                'removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const allArtworkIdsInDatabase: string[] = allArtistArtworkInDatabase.map((x) => x.artworkId);
            let numberOfRemovedArtistArtwork: number = 0;

            for (const artistArtworkFilePath of allArtistArtworkFilePaths) {
                const artistArtworkFileNameWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(artistArtworkFilePath);

                if (!allArtworkIdsInDatabase.includes(artistArtworkFileNameWithoutExtension)) {
                    await this.fileAccess.deleteFileIfExistsAsync(artistArtworkFilePath);
                    numberOfRemovedArtistArtwork++;
                }

                if (numberOfRemovedArtistArtwork === 1) {
                    // Only trigger the notification once
                    await this.notificationService.updatingArtistArtworkAsync();
                }
            }

            this.logger.info(
                `Removed ${numberOfRemovedArtistArtwork} artwork files on disk`,
                'ArtistArtworkRemover',
                'removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );
        } catch (e: unknown) {
            this.logger.error(
                e,
                'Could not remove artist artwork from disk',
                'ArtistArtworkRemover',
                'removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );
        }
    }

    public removeArtistArtworkWithDefaultIdAsync(): void {
        try {
            const numberOfDeletedEntries: number = this.artistArtworkRepository.deleteArtistArtworkWithDefaultId();
            this.logger.info(
                `Deleted ${numberOfDeletedEntries} artist artwork from database`,
                'ArtistArtworkRemover',
                'removeArtistArtworkWithDefaultIdAsync',
            );
        } catch (e) {
            this.logger.error(
                e,
                'Could not remove artist artwork from disk',
                'ArtistArtworkRemover',
                'removeArtistArtworkWithDefaultIdAsync',
            );
        }
    }

    public removeAllArtistArtworkAsync(): void {
        try {
            const numberOfDeletedEntries: number = this.artistArtworkRepository.deleteAllArtistArtwork();
            this.logger.info(
                `Deleted ${numberOfDeletedEntries} artist artwork from database`,
                'ArtistArtworkRemover',
                'removeAllArtistArtworkAsync',
            );
        } catch (e) {
            this.logger.error(e, 'Could not remove artist artwork from disk', 'ArtistArtworkRemover', 'removeAllArtistArtworkAsync');
        }
    }
}
