import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';

@Injectable()
export class AlbumArtworkRemover {
    constructor(
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private fileSystem: FileSystem,
        private logger: Logger) {
    }

    public removeAlbumArtworkThatHasNoTrack(): void {
        try {
            const allAlbumArtworkThatHasNoTrack: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtworkThatHasNoTrack();

            this.logger.info(
                `Found ${allAlbumArtworkThatHasNoTrack.length} album artwork that has no track`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );

            for (const albumArtworkThatHasNoTrack of allAlbumArtworkThatHasNoTrack) {
                this.albumArtworkRepository.deleteAlbumArtwork(albumArtworkThatHasNoTrack.albumKey);
            }
        } catch (e) {
            this.logger.error(
                `Could not remove album artwork that has no track. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );
        }
    }

    public removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): void {
        try {
            const allAlbumArtworkForTracksThatNeedAlbumArtworkIndexing: AlbumArtwork[] =
                this.albumArtworkRepository.getAllAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            this.logger.info(
                `Found ${allAlbumArtworkForTracksThatNeedAlbumArtworkIndexing.length} album artwork for tracks that need album artwork indexing`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );

            for (const albumArtworkForTracksThatNeedAlbumArtworkIndexing of allAlbumArtworkForTracksThatNeedAlbumArtworkIndexing) {
                this.albumArtworkRepository.deleteAlbumArtwork(albumArtworkForTracksThatNeedAlbumArtworkIndexing.albumKey);
            }
        } catch (e) {
            this.logger.error(
                `Could not remove album artwork for tracks that need album artwork indexing. Error: ${e.message}`,
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
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync');

            const allArtworkIdsInDatabase: string[] = allAlbumArtworkInDatabase.map(x => x.artworkId);
            this.logger.info(
                `Found ${allArtworkIdsInDatabase.length} artworkIds in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync');

            const coverArtCacheFullPath: string = this.fileSystem.coverArtCacheFullPath();
            const allAlbumArtworkFilePaths: string[] = await this.fileSystem.getFilesInDirectoryAsync(coverArtCacheFullPath);

            this.logger.info(
                `Found ${allAlbumArtworkFilePaths.length} artwork files on disk`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync');

            for (const albumArtworkFilePath of allAlbumArtworkFilePaths) {
                const albumArtworkFileNameWithoutExtension: string = this.fileSystem.getFileNameWithoutExtension(albumArtworkFilePath);

                if (!allArtworkIdsInDatabase.includes(albumArtworkFileNameWithoutExtension)) {
                    await this.fileSystem.deleteFileIfExistsAsync(albumArtworkFilePath);
                }
            }
        } catch (e) {
            this.logger.error(
                `Could not remove album artwork that is not in the database from disk. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync'
            );
        }
    }
}
