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
            const allAlbumArtworkThatHaveNoTrack: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtworkThatHasNoTrack();

            for (const albumArtworkThatHaveNoTrack of allAlbumArtworkThatHaveNoTrack) {
                this.albumArtworkRepository.deleteAlbumArtwork(albumArtworkThatHaveNoTrack.albumKey);
            }
        } catch (e) {
            this.logger.info(
                `Could not remove album artwork that has no track. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );
        }
    }

    public removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): void {
        try {
            const allAlbumArtworkForTracksThatNeedAlbumArtworkIndexing: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            for (const albumArtworkForTracksThatNeedAlbumArtworkIndexing of allAlbumArtworkForTracksThatNeedAlbumArtworkIndexing) {
                this.albumArtworkRepository.deleteAlbumArtwork(albumArtworkForTracksThatNeedAlbumArtworkIndexing.albumKey);
            }
        } catch (e) {
            this.logger.info(
                `Could not remove album artwork for tracks that need album artwork indexing. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing'
            );
        }
    }

    public async removeAlbumArtworkThatIsNotInTheDatabaseFromDiskASync(): Promise<void> {
        const allAlbumArtworkInDatabase: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtwork();
        const allArtworkIdsInDatabases: string[] = allAlbumArtworkInDatabase.map(x => x.artworkId);
        const coverArtCacheFullPath: string = this.fileSystem.coverArtCacheFullPath();
        const allAlbumArtworkFilePaths: string[] = await this.fileSystem.getFilesInDirectoryAsync(coverArtCacheFullPath);

        for (const albumArtworkFilePath of allAlbumArtworkFilePaths) {
            const albumArtworkFileNameWithoutExtension: string = this.fileSystem.getFileNameWithoutExtension(albumArtworkFilePath);

            if (!allArtworkIdsInDatabases.includes(albumArtworkFileNameWithoutExtension)) {
                this.fileSystem.deleteFileIfExists(albumArtworkFilePath);
            }
        }
    }
}
